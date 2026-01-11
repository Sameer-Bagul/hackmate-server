import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { UserModel } from '../../models/index.js';
import argon2 from 'argon2';

import { SignupSchema, LoginSchema } from '../../schemas/index.js';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.post('/signup', async (request, reply) => {
        const body = SignupSchema.parse(request.body);

        const existing = await UserModel.findOne({ $or: [{ email: body.email }, { username: body.username }] });
        if (existing) {
            return reply.code(409).send({ message: 'User already exists' });
        }

        const passwordHash = await argon2.hash(body.password);
        const user = await UserModel.create({
            username: body.username,
            email: body.email,
            passwordHash,
        });

        const token = fastify.jwt.sign({ id: user._id, username: user.username, role: user.role });
        return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
    });

    fastify.post('/login', async (request, reply) => {
        const body = LoginSchema.parse(request.body);

        const user = await UserModel.findOne({ username: body.username });
        if (!user) {
            return reply.code(401).send({ message: 'Invalid credentials' });
        }

        const valid = await argon2.verify(user.passwordHash, body.password);
        if (!valid) {
            return reply.code(401).send({ message: 'Invalid credentials' });
        }

        const token = fastify.jwt.sign({ id: user._id, username: user.username, role: user.role });
        return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
    });

    fastify.post('/otp/send', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;
        const user = await UserModel.findById(userId) as any;
        if (!user) return reply.code(404).send({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"HackMate" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: 'Your HackMate Verification Code',
                text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
                html: `<b>Your OTP code is: ${otp}</b><br>It expires in 10 minutes.`,
            });
            fastify.log.info(`📧 Email sent to ${user.email}`);
        } else {
            fastify.log.warn('SMTP credentials missing, falling back to console log');
            console.log(`📧 [MOCK EMAIL] To: ${user.email} | OTP: ${otp}`);
        }

        return { message: 'OTP sent' };
    });

    fastify.post('/otp/verify', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;
        const { code } = request.body as { code: string };
        const user = await UserModel.findById(userId) as any;

        if (!user) return reply.code(404).send({ message: 'User not found' });

        if (user.isVerified) return { message: 'Already verified' };

        if (!user.otpCode || user.otpCode !== code) {
            return reply.code(400).send({ message: 'Invalid OTP' });
        }

        if (!user.otpExpires || new Date() > user.otpExpires) {
            return reply.code(400).send({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        return { message: 'Email verified successfully' };
    });
};

export default auth;
