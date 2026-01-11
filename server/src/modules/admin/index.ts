import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { 
    UserModel, 
    ProfileModel, 
    MessageModel, 
    GroupModel, 
    ProjectModel, 
    FriendRequestModel, 
    NotificationModel 
} from '../../models/index.js';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    // Middleware to ensure user is admin
    app.addHook('onRequest', fastify.authenticate);
    app.addHook('onRequest', async (request, reply) => {
        const user = request.user as { role: string; id: string };
        if (user.role !== 'admin') {
            return reply.code(403).send({ message: 'Forbidden: Admins only' });
        }
    });

    // LIST all users
    app.get('/users', async (request, reply) => {
        const users = await UserModel.find({}, '-passwordHash');
        return users;
    });

    // VIEW a user
    app.get('/users/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await UserModel.findById(id, '-passwordHash');
        if (!user) return reply.code(404).send({ message: 'User not found' });

        const profile = await ProfileModel.findOne({ userId: user._id });
        return { user, profile };
    });

    // DELETE a user
    app.delete('/users/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        // Prevent deleting yourself
        const requestUser = request.user as { role: string; id: string };
        if (id === requestUser.id) {
            return reply.code(400).send({ message: 'Cannot delete yourself' });
        }

        const user = await UserModel.findByIdAndDelete(id);
        if (!user) return reply.code(404).send({ message: 'User not found' });

        // Cleanup profile and messages preferably, but start with profile
        await ProfileModel.deleteOne({ userId: id });

        return { message: 'User deleted' };
    });

    // UPDATE a user (e.g. promote to admin)
    app.put('/users/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            body: z.object({
                role: z.enum(['admin', 'user']).optional(),
                username: z.string().optional(),
                email: z.string().email().optional()
            })
        }
    }, async (request, reply) => {

    // ==================== DASHBOARD STATS ====================
    app.get('/stats', async (request, reply) => {
        const [
            totalUsers,
            totalProfiles,
            totalMessages,
            totalGroups,
            totalProjects,
            totalFriendRequests,
            verifiedUsers,
            adminUsers
        ] = await Promise.all([
            UserModel.countDocuments(),
            ProfileModel.countDocuments(),
            MessageModel.countDocuments(),
            GroupModel.countDocuments(),
            ProjectModel.countDocuments(),
            FriendRequestModel.countDocuments(),
            UserModel.countDocuments({ isVerified: true }),
            UserModel.countDocuments({ role: 'admin' })
        ]);

        return {
            users: {
                total: totalUsers,
                verified: verifiedUsers,
                unverified: totalUsers - verifiedUsers,
                admins: adminUsers
            },
            profiles: totalProfiles,
            messages: totalMessages,
            groups: totalGroups,
            projects: totalProjects,
            friendRequests: totalFriendRequests
        };
    });

    // ==================== MESSAGES ====================
    app.get('/messages', async (request, reply) => {
        const { limit = 100, skip = 0 } = request.query as { limit?: number; skip?: number };
        
        const messages = await MessageModel.find()
            .populate('senderId', 'username email')
            .populate('receiverId', 'username email')
            .populate('groupId', 'name')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));

        const total = await MessageModel.countDocuments();

        return {
            messages,
            total,
            limit: Number(limit),
            skip: Number(skip)
        };
    });

    // GET messages by user
    app.get('/messages/user/:userId', {
        schema: {
            params: z.object({ userId: z.string() })
        }
    }, async (request, reply) => {
        const { userId } = request.params as { userId: string };
        
        const messages = await MessageModel.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
            .populate('senderId', 'username email')
            .populate('receiverId', 'username email')
            .sort({ createdAt: -1 })
            .limit(100);

        return messages;
    });

    // DELETE a message
    app.delete('/messages/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const message = await MessageModel.findByIdAndDelete(id);
        if (!message) return reply.code(404).send({ message: 'Message not found' });
        return { message: 'Message deleted' };
    });

    // ==================== GROUPS ====================
    app.get('/groups', async (request, reply) => {
        const groups = await GroupModel.find()
            .populate('ownerId', 'username email')
            .populate('members.userId', 'username email')
            .sort({ createdAt: -1 });

        return groups;
    });

    // GET group details
    app.get('/groups/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        
        const group = await GroupModel.findById(id)
            .populate('ownerId', 'username email')
            .populate('members.userId', 'username email')
            .populate('joinRequests.userId', 'username email');

        if (!group) return reply.code(404).send({ message: 'Group not found' });

        const messages = await MessageModel.find({ groupId: id })
            .populate('senderId', 'username email')
            .sort({ createdAt: -1 })
            .limit(50);

        return { group, recentMessages: messages };
    });

    // DELETE a group
    app.delete('/groups/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const group = await GroupModel.findByIdAndDelete(id);
        if (!group) return reply.code(404).send({ message: 'Group not found' });
        
        // Delete group messages
        await MessageModel.deleteMany({ groupId: id });
        
        return { message: 'Group and related messages deleted' };
    });

    // ==================== PROJECTS ====================
    app.get('/projects', async (request, reply) => {
        const projects = await ProjectModel.find()
            .populate('ownerId', 'username email')
            .populate('applicants.userId', 'username email')
            .sort({ createdAt: -1 });

        return projects;
    });

    // GET project details
    app.get('/projects/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        
        const project = await ProjectModel.findById(id)
            .populate('ownerId', 'username email')
            .populate('applicants.userId', 'username email');

        if (!project) return reply.code(404).send({ message: 'Project not found' });
        return project;
    });

    // DELETE a project
    app.delete('/projects/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const project = await ProjectModel.findByIdAndDelete(id);
        if (!project) return reply.code(404).send({ message: 'Project not found' });
        return { message: 'Project deleted' };
    });

    // ==================== FRIEND REQUESTS ====================
    app.get('/friend-requests', async (request, reply) => {
        const requests = await FriendRequestModel.find()
            .populate('senderId', 'username email')
            .populate('receiverId', 'username email')
            .sort({ createdAt: -1 });

        return requests;
    });

    // DELETE a friend request
    app.delete('/friend-requests/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const friendRequest = await FriendRequestModel.findByIdAndDelete(id);
        if (!friendRequest) return reply.code(404).send({ message: 'Friend request not found' });
        return { message: 'Friend request deleted' };
    });

    // ==================== NOTIFICATIONS ====================
    app.get('/notifications', async (request, reply) => {
        const { limit = 100, skip = 0 } = request.query as { limit?: number; skip?: number };
        
        const notifications = await NotificationModel.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));

        const total = await NotificationModel.countDocuments();

        return {
            notifications,
            total,
            limit: Number(limit),
            skip: Number(skip)
        };
    });

    // DELETE a notification
    app.delete('/notifications/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const notification = await NotificationModel.findByIdAndDelete(id);
        if (!notification) return reply.code(404).send({ message: 'Notification not found' });
        return { message: 'Notification deleted' };
    });

    // ==================== ACTIVITY LOG ====================
    app.get('/activity', async (request, reply) => {
        const { limit = 50 } = request.query as { limit?: number };

        // Get recent activity from multiple sources
        const [recentUsers, recentMessages, recentGroups, recentProjects] = await Promise.all([
            UserModel.find()
                .select('username email createdAt isVerified')
                .sort({ createdAt: -1 })
                .limit(10),
            MessageModel.find()
                .populate('senderId', 'username')
                .select('content createdAt senderId')
                .sort({ createdAt: -1 })
                .limit(20),
            GroupModel.find()
                .populate('ownerId', 'username')
                .select('name createdAt ownerId')
                .sort({ createdAt: -1 })
                .limit(10),
            ProjectModel.find()
                .populate('ownerId', 'username')
                .select('title createdAt ownerId')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        // Combine and format activity
        const activity = [
            ...recentUsers.map((u: any) => ({
                type: 'user_signup',
                timestamp: u.createdAt,
                data: { username: u.username, email: u.email, verified: u.isVerified }
            })),
            ...recentMessages.map((m: any) => ({
                type: 'message',
                timestamp: m.createdAt,
                data: { sender: m.senderId?.username, preview: m.content?.substring(0, 50) }
            })),
            ...recentGroups.map((g: any) => ({
                type: 'group_created',
                timestamp: g.createdAt,
                data: { name: g.name, owner: g.ownerId?.username }
            })),
            ...recentProjects.map((p: any) => ({
                type: 'project_created',
                timestamp: p.createdAt,
                data: { title: p.title, owner: p.ownerId?.username }
            }))
        ];

        // Sort by timestamp descending
        activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return activity.slice(0, Number(limit));
    });

    // ==================== SEARCH ====================
    app.get('/search', async (request, reply) => {
        const { q, type } = request.query as { q: string; type?: string };

        if (!q) {
            return reply.code(400).send({ message: 'Query parameter "q" is required' });
        }

        const searchRegex = new RegExp(q, 'i');
        const results: any = {};

        if (!type || type === 'users') {
            results.users = await UserModel.find({
                $or: [
                    { username: searchRegex },
                    { email: searchRegex }
                ]
            }).select('-passwordHash').limit(20);
        }

        if (!type || type === 'groups') {
            results.groups = await GroupModel.find({
                name: searchRegex
            }).populate('ownerId', 'username').limit(20);
        }

        if (!type || type === 'projects') {
            results.projects = await ProjectModel.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            }).populate('ownerId', 'username').limit(20);
        }

        return results;
    });
        const { id } = request.params as { id: string };
        const body = request.body as { role?: 'admin' | 'user', username?: string, email?: string };

        const user = await UserModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) return reply.code(404).send({ message: 'User not found' });

        return user;
    });
};

export default adminRoutes;
