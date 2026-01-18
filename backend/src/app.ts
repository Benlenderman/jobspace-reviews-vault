import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import mongoose from 'mongoose';
import { getConfig } from './config/index.js';
import { errorHandler } from './plugins/errorHandler.js';
import { ensureUploadDir } from './utils/fileStore.js';
import { authRoutes } from './modules/auth/routes.js';
import { collectionsRoutes } from './modules/collections/routes.js';
import { submissionsRoutes } from './modules/submissions/routes.js';
import { publicRoutes } from './modules/public/routes.js';
import { settingsRoutes } from './modules/settings/routes.js';
import { setupAgenda } from './jobs/scheduler.js';
import path from 'path';

declare module 'fastify' {
  interface FastifyInstance {
    agenda?: any;
  }
}

export async function buildApp() {
  const config = getConfig();

  const app = Fastify({
    logger: config.NODE_ENV === 'development',
    bodyLimit: 210 * 1024 * 1024,
  });

  await app.register(helmet);

  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(jwt, {
    secret: config.JWT_SECRET,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 200 * 1024 * 1024,
    },
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  await app.register(fastifyStatic, {
    root: path.resolve(config.UPLOAD_DIR),
    prefix: '/uploads/',
  });

  await errorHandler(app);

  await mongoose.connect(config.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await ensureUploadDir();
  console.log('✅ Upload directory ready');

  const agenda = await setupAgenda();
  app.decorate('agenda', agenda);

  await agenda.now('sync-google-reviews', {});

  app.register(
    async (apiApp) => {
      await apiApp.register(authRoutes);
      await apiApp.register(collectionsRoutes);
      await apiApp.register(submissionsRoutes);
      await apiApp.register(publicRoutes);
      await apiApp.register(settingsRoutes);

      apiApp.get('/health', async () => ({ status: 'ok' }));
    },
    { prefix: '/api' }
  );

  return app;
}
