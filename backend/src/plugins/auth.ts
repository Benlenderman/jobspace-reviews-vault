import { FastifyRequest, FastifyReply } from 'fastify';
import { User, IUser } from '../models/User.js';

declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: IUser;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    const userId = (request.user as any).userId;

    const user = await User.findById(userId);
    if (!user) {
      return reply.code(401).send({ error: 'User not found' });
    }

    request.currentUser = user;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}
