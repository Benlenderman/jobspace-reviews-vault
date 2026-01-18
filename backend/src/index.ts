import { loadConfig, getConfig } from './config/index.js';
import { buildApp } from './app.js';

async function start() {
  try {
    loadConfig();
    const config = getConfig();

    const app = await buildApp();

    await app.listen({
      port: config.PORT,
      host: '0.0.0.0',
    });

    console.log(`🚀 Server running on http://localhost:${config.PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
