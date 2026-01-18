import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ReviewCollection } from '../../models/ReviewCollection.js';
import { authenticate } from '../../plugins/auth.js';
import { generatePublicToken } from '../../utils/crypto.js';
import { nanoid } from 'nanoid';

const createCollectionSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).optional(),
});

export async function collectionsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/collections', { preHandler: authenticate }, async (request) => {
    const collections = await ReviewCollection.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return { collections };
  });

  app.post('/collections', { preHandler: authenticate }, async (request, reply) => {
    const body = createCollectionSchema.parse(request.body);

    const slug = body.slug || nanoid(10);

    const existing = await ReviewCollection.findOne({ slug });
    if (existing) {
      return reply.code(400).send({ error: 'Slug already exists' });
    }

    const collection = new ReviewCollection({
      title: body.title,
      slug,
      publicToken: generatePublicToken(),
      createdBy: request.currentUser!._id,
      isActive: true,
    });

    await collection.save();

    return { collection };
  });

  app.patch(
    '/collections/:id/toggle',
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const collection = await ReviewCollection.findById(id);
      if (!collection) {
        return reply.code(404).send({ error: 'Collection not found' });
      }

      collection.isActive = !collection.isActive;
      await collection.save();

      return { collection };
    }
  );

  app.get('/collections/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const collection = await ReviewCollection.findById(id).populate(
      'createdBy',
      'name email'
    );

    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found' });
    }

    return { collection };
  });
}
