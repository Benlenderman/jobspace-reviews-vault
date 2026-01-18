import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { User } from '../../models/User.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { authenticate } from '../../plugins/auth.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await User.findOne({ email: body.email });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const accessToken = app.jwt.sign(
      { userId: user._id.toString() },
      { expiresIn: '15m' }
    );

    const refreshToken = app.jwt.sign(
      { userId: user._id.toString(), type: 'refresh' },
      { expiresIn: '7d' }
    );

    user.refreshTokenHash = await hashPassword(refreshToken);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        preferences: user.preferences,
      },
    };
  });

  app.post('/auth/refresh', async (request, reply) => {
    const body = refreshSchema.parse(request.body);

    try {
      const decoded = app.jwt.verify(body.refreshToken) as any;

      if (decoded.type !== 'refresh') {
        return reply.code(401).send({ error: 'Invalid token type' });
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokenHash) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const valid = await verifyPassword(body.refreshToken, user.refreshTokenHash);
      if (!valid) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      const accessToken = app.jwt.sign(
        { userId: user._id.toString() },
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }
  });

  app.post('/auth/logout', { preHandler: authenticate }, async (request, reply) => {
    if (request.currentUser) {
      request.currentUser.refreshTokenHash = undefined;
      await request.currentUser.save();
    }
    return { success: true };
  });

  app.get('/auth/me', { preHandler: authenticate }, async (request, reply) => {
    return {
      user: {
        id: request.currentUser!._id,
        email: request.currentUser!.email,
        name: request.currentUser!.name,
        role: request.currentUser!.role,
        preferences: request.currentUser!.preferences,
      },
    };
  });
}
