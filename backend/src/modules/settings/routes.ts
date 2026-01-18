import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getSetting, setSetting } from '../../models/Settings.js';
import { authenticate } from '../../plugins/auth.js';

const updateSettingsSchema = z.object({
  placeId: z.string().optional(),
  googleSyncEnabled: z.boolean().optional(),
  googleReviewUrl: z.string().optional(),
});

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/settings', { preHandler: authenticate }, async () => {
    const [placeId, googleSyncEnabled, googleReviewUrl] = await Promise.all([
      getSetting('placeId', ''),
      getSetting('googleSyncEnabled', false),
      getSetting('googleReviewUrl', 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review'),
    ]);

    return {
      placeId,
      googleSyncEnabled,
      googleReviewUrl,
    };
  });

  app.put('/settings', { preHandler: authenticate }, async (request) => {
    const body = updateSettingsSchema.parse(request.body);

    if (body.placeId !== undefined) {
      await setSetting('placeId', body.placeId);
    }

    if (body.googleSyncEnabled !== undefined) {
      await setSetting('googleSyncEnabled', body.googleSyncEnabled);
    }

    if (body.googleReviewUrl !== undefined) {
      await setSetting('googleReviewUrl', body.googleReviewUrl);
    }

    return { success: true };
  });
}
