# HackMate Server 🚀

Backend API server for HackMate - A terminal-based social network for developers and hackers.

## Tech Stack

- **Framework**: Fastify (Node.js)
- **Database**: MongoDB (with Mongoose ODM)
- **Cache/Sessions**: Redis (Upstash)
- **Real-time**: Socket.IO
- **Authentication**: JWT + Argon2
- **Validation**: Zod schemas

## Features

- 🔐 **Authentication** - Signup, Login, Email verification (OTP)
- 👤 **User Profiles** - Skills, tech stack, bio, socials
- 💬 **Real-time Chat** - Direct messages and group chats
- 🌐 **Social Network** - Friend requests, following, blocking
- 🛠️ **Projects** - Post projects, find collaborators
- 👥 **Groups** - Create and join communities
- 🔔 **Notifications** - Real-time updates
- ⚡ **Admin Panel** - User management

## Prerequisites

- Node.js >= 20
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- SMTP credentials (for email verification)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hackmate
   UPSTASH_REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   PORT=3001
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:3001` with hot reload.

### Production Mode
```bash
npm run build
npm start
```

### Seed Admin User
```bash
npm run seed:admin
```

## Project Structure

```
server/
├── src/
│   ├── models/           # Mongoose models
│   │   ├── User.ts
│   │   ├── Profile.ts
│   │   ├── Message.ts
│   │   ├── Group.ts
│   │   └── ...
│   ├── schemas/          # Zod validation schemas
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   └── ...
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── chat/
│   │   ├── network/
│   │   ├── project/
│   │   ├── group/
│   │   └── admin/
│   ├── plugins/          # Fastify plugins
│   │   ├── infra/        # MongoDB, Redis, Socket.IO
│   │   └── security/     # JWT, CORS, Rate limiting
│   ├── services/         # Shared services
│   ├── types/            # TypeScript types
│   ├── app.ts            # Fastify app setup
│   └── start.ts          # Server entry point
├── scripts/              # Utility scripts
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login
- `POST /auth/otp/send` - Send verification OTP
- `POST /auth/otp/verify` - Verify OTP

### Profile
- `GET /profile` - Get own profile
- `PUT /profile` - Update profile
- `GET /profile/:username` - View user profile

### Chat
- `GET /chat/dm/:userId` - Get DM history
- `GET /chat/group/:groupId` - Get group messages
- `GET /chat/conversations` - List all conversations

### Network
- `POST /network/follow` - Send friend request
- `GET /network/requests` - List pending requests
- `POST /network/requests/:id/accept` - Accept request
- `GET /network/friends` - List friends

### Projects
- `GET /project` - List open projects
- `POST /project` - Create project
- `POST /project/:id/apply` - Apply to project
- `POST /project/:id/accept/:userId` - Accept applicant

### Groups
- `GET /group` - List groups
- `POST /group` - Create group
- `POST /group/:id/join` - Join group

### Admin
- `GET /admin/users` - List all users
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id` - Update user role

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t hackmate-server .
docker run -p 3001:3001 --env-file .env hackmate-server
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hackmate` |
| `UPSTASH_REDIS_URL` | Redis URL | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing key | *(required)* |
| `SMTP_USER` | Email for sending OTPs | *(optional)* |
| `SMTP_PASS` | Email password/app password | *(optional)* |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |

## License

MIT
