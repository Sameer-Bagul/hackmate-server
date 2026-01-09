import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { UserModel } from '@hackmate/db';
import argon2 from 'argon2';

import { SignupSchema, LoginSchema } from '@hackmate/shared';

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
};

export default auth;
