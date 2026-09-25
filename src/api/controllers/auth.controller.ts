import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../core/services/auth.service.js';
import { SignupSchema, LoginSchema } from '../../shared/validators/index.js';
import { emailService } from '../../infrastructure/email/email.service.js';

export class AuthController {
    
    async signup(request: FastifyRequest, reply: FastifyReply) {
        try {
            const body = SignupSchema.parse(request.body);
            const result = await authService.signup(body, request.server.jwt.sign.bind(request.server.jwt));
            return result;
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return reply.code(409).send({ message: error.message });
            }
            throw error;
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const body = LoginSchema.parse(request.body);
            const result = await authService.login(body, request.server.jwt.sign.bind(request.server.jwt));
            return result;
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return reply.code(401).send({ message: error.message });
            }
            throw error;
        }
    }

    async sendOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;
            
            const { user, otp } = await authService.sendOTP(userId);

            // Use email service
            await emailService.sendOTP(user.email, otp);
            request.log.info(`📧 OTP sent to ${user.email}`);

            return { message: 'OTP sent' };
        } catch (error: any) {
            request.log.error(error, 'Failed to send OTP');
            throw error;
        }
    }

    async verifyOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;
            const { code } = request.body as { code: string };
            
            const result = await authService.verifyOTP(userId, code);
            return result;
        } catch (error: any) {
            if (error.message === 'User not found') {
                return reply.code(404).send({ message: error.message });
            }
            if (error.message === 'Invalid OTP' || error.message === 'OTP expired') {
                return reply.code(400).send({ message: error.message });
            }
            throw error;
        }
    }

    async checkAvailability(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username, email } = request.query as { username: string; email: string };
            const result = await authService.checkAvailability(username, email);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email } = request.body as { email: string };
            const result = await authService.forgotPassword(email);
            return result;
        } catch (error: any) {
            throw error;
        }
    }

    async verifyResetOtp(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, otp } = request.body as { email: string; otp: string };
            const result = await authService.verifyResetOtp(email, otp);
            return result;
        } catch (error: any) {
            if (error.message === 'Invalid or expired OTP' || error.message === 'OTP has expired') {
                return reply.code(400).send({ message: error.message });
            }
            throw error;
        }
    }

    async resetPassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, otp, newPassword } = request.body as { email: string; otp: string; newPassword: string };
            const result = await authService.resetPassword(email, otp, newPassword);
            return result;
        } catch (error: any) {
            if (error.message === 'Invalid or expired OTP' || error.message === 'OTP has expired') {
                return reply.code(400).send({ message: error.message });
            }
            throw error;
        }
    }

    async githubLogin(request: FastifyRequest, reply: FastifyReply) {
        const { session_id, redirect_uri, existing_user_id } = request.query as { session_id?: string; redirect_uri?: string; existing_user_id?: string };
        const clientId = process.env.GITHUB_CLIENT_ID;
        if (!clientId) throw new Error('GITHUB_CLIENT_ID not configured');

        // Pass the session_id, redirect_uri, or existing_user_id via the 'state' parameter to recover it later
        const state = JSON.stringify({ session_id, redirect_uri, existing_user_id });
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user user:email repo user:follow&state=${encodeURIComponent(state)}`;
        
        return reply.redirect(redirectUrl);
    }

    async githubCallback(request: FastifyRequest, reply: FastifyReply) {
        const { code, state } = request.query as { code: string; state?: string };
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) throw new Error('GitHub OAuth not configured');

        try {
            // 1. Exchange code for access token using axios
            const { default: axios } = await import('axios');
            const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code
            }, {
                headers: { Accept: 'application/json' }
            });

            const { access_token } = tokenResponse.data;
            if (!access_token) throw new Error('Failed to obtain access token');

            // 2. Handle login via service
            const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
            const result = await authService.handleGitHubOAuth(
                access_token, 
                request.server.jwt.sign.bind(request.server.jwt),
                parsedState.existing_user_id
            );

            // 3. Handle CLI polling or Web redirection
            if (state) {
                const parsedState = JSON.parse(decodeURIComponent(state));
                if (parsedState.session_id) {
                    // Save JWT in redis for CLI to poll
                    await request.server.redis.set(`cli_auth_${parsedState.session_id}`, JSON.stringify(result), { ex: 300 });
                    return reply.type('text/html').send(`
                        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                            <h2 style="color: #22c55e;">Authentication Successful!</h2>
                            <p>You can close this window and return to your terminal.</p>
                        </div>
                    `);
                } else if (parsedState.redirect_uri) {
                    // For Web App
                    return reply.redirect(`${parsedState.redirect_uri}?token=${result.token}`);
                }
            }

            return result;
        } catch (error) {
            request.log.error(error, 'GitHub OAuth callback failed');
            return reply.code(500).send({ message: 'Authentication failed' });
        }
    }

    async cliPoll(request: FastifyRequest, reply: FastifyReply) {
        const { session_id } = request.query as { session_id: string };
        const data = await request.server.redis.get(`cli_auth_${session_id}`);
        
        if (data) {
            // Delete after reading to prevent replay
            await request.server.redis.del(`cli_auth_${session_id}`);
            return reply.send({ status: 'success', data: typeof data === 'string' ? JSON.parse(data) : data });
        }
        
        return reply.send({ status: 'pending' });
    }
}

export const authController = new AuthController();
