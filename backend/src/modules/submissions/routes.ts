import { FastifyInstance } from 'fastify';
import { ReviewSubmission } from '../../models/ReviewSubmission.js';
import { authenticate } from '../../plugins/auth.js';

export async function submissionsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/submissions', { preHandler: authenticate }, async (request) => {
    const { status, collectionId } = request.query as {
      status?: string;
      collectionId?: string;
    };

    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (collectionId) {
      filter.collectionId = collectionId;
    }

    const submissions = await ReviewSubmission.find(filter)
      .populate('collectionId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(100);

    return { submissions };
  });

  app.get('/submissions/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const submission = await ReviewSubmission.findById(id).populate(
      'collectionId',
      'title slug'
    );

    if (!submission) {
      return reply.code(404).send({ error: 'Submission not found' });
    }

    return { submission };
  });

  app.patch(
    '/submissions/:id/approve',
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const submission = await ReviewSubmission.findById(id);
      if (!submission) {
        return reply.code(404).send({ error: 'Submission not found' });
      }

      submission.status = 'approved';
      await submission.save();

      return { submission };
    }
  );

  app.patch(
    '/submissions/:id/reject',
    { preHandler: authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const submission = await ReviewSubmission.findById(id);
      if (!submission) {
        return reply.code(404).send({ error: 'Submission not found' });
      }

      submission.status = 'rejected';
      await submission.save();

      return { submission };
    }
  );

  app.get('/submissions/stats/summary', { preHandler: authenticate }, async () => {
    const [total, pending, approved, rejected] = await Promise.all([
      ReviewSubmission.countDocuments(),
      ReviewSubmission.countDocuments({ status: 'pending' }),
      ReviewSubmission.countDocuments({ status: 'approved' }),
      ReviewSubmission.countDocuments({ status: 'rejected' }),
    ]);

    const ratingDistribution = await ReviewSubmission.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      ratingDistribution,
    };
  });
}
