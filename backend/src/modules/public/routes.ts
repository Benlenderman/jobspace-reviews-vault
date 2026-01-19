import { FastifyInstance } from 'fastify';
import { ReviewCollection } from '../../models/ReviewCollection.js';
import { ReviewSubmission } from '../../models/ReviewSubmission.js';
import { GoogleReview } from '../../models/GoogleReview.js';
import { saveUploadedFile } from '../../utils/fileStore.js';
import { generateDiscountCode, getDiscountPercent } from '../../utils/discountCode.js';
import { getSetting } from '../../models/Settings.js';
import { generateUploadSignature } from '../../utils/cloudinary.js';

const MAX_FILE_SIZE = 200 * 1024 * 1024;

export async function publicRoutes(app: FastifyInstance): Promise<void> {
  // Get Cloudinary upload signature for direct upload
  app.get('/public/cloudinary-signature/:publicToken', async (request, reply) => {
    const { publicToken } = request.params as { publicToken: string };

    const collection = await ReviewCollection.findOne({
      publicToken,
      isActive: true,
    });

    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found or inactive' });
    }

    const signatureData = generateUploadSignature();

    return {
      success: true,
      ...signatureData,
    };
  });

  // Submit review with Cloudinary video URL
  app.post('/public/submit-cloudinary/:publicToken', async (request, reply) => {
    const { publicToken } = request.params as { publicToken: string };

    const collection = await ReviewCollection.findOne({
      publicToken,
      isActive: true,
    });

    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found or inactive' });
    }

    const body = request.body as any;
    const {
      cloudinaryPublicId,
      cloudinaryUrl,
      videoFormat,
      videoDuration,
      videoBytes,
      personName,
      personRole,
      companyName,
      rating,
      text,
      consent,
    } = body;

    if (!cloudinaryPublicId || !cloudinaryUrl || !personName || !personRole || !text || !consent) {
      return reply.code(400).send({
        error: 'Missing required fields',
      });
    }

    // Validate 4-minute maximum duration
    if (videoDuration > 240) {
      return reply.code(400).send({
        error: 'Video duration exceeds 4 minutes maximum',
      });
    }

    if (text.length > 1000) {
      return reply.code(400).send({ error: 'Text too long (max 1000 chars)' });
    }

    // Generate unique discount code for video submission
    const discountCode = generateDiscountCode('video');
    const discountPercent = getDiscountPercent('video');

    const submission = new ReviewSubmission({
      collectionId: collection._id,
      status: 'pending',
      personName,
      personRole,
      companyName: companyName || undefined,
      rating: parseInt(rating) || 5,
      text,
      consent,
      consentAt: new Date(),
      source: 'manual',
      discountCode,
      discountPercent,
      video: {
        originalFilename: `${cloudinaryPublicId}.${videoFormat}`,
        mimeType: `video/${videoFormat}`,
        sizeBytes: videoBytes || 0,
        storagePath: cloudinaryUrl,
      },
    });

    await submission.save();

    return {
      success: true,
      submissionId: submission._id,
      discountCode,
      discountPercent,
    };
  });

  // Legacy route: direct file upload (fallback)
  app.post('/public/submit/:publicToken', async (request, reply) => {
    const { publicToken } = request.params as { publicToken: string };

    const collection = await ReviewCollection.findOne({
      publicToken,
      isActive: true,
    });

    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found or inactive' });
    }

    const data = await request.file({
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    });

    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.code(400).send({
        error: 'Invalid file type. Allowed: mp4, webm, mov',
      });
    }

    const fields = data.fields as any;
    const personName = (fields.personName as any)?.value;
    const personRole = (fields.personRole as any)?.value;
    const companyName = (fields.companyName as any)?.value;
    const rating = parseInt((fields.rating as any)?.value || '5');
    const text = (fields.text as any)?.value;
    const consent = (fields.consent as any)?.value === 'true';

    if (!personName || !personRole || !text || !consent) {
      return reply.code(400).send({
        error: 'Missing required fields: personName, personRole, text, consent',
      });
    }

    if (text.length > 1000) {
      return reply.code(400).send({ error: 'Text too long (max 1000 chars)' });
    }

    // Generate unique discount code for video submission
    const discountCode = generateDiscountCode('video');
    const discountPercent = getDiscountPercent('video');

    const submission = new ReviewSubmission({
      collectionId: collection._id,
      status: 'pending',
      personName,
      personRole,
      companyName: companyName || undefined,
      rating,
      text,
      consent,
      consentAt: new Date(),
      source: 'manual',
      discountCode,
      discountPercent,
      video: {
        originalFilename: '',
        mimeType: '',
        sizeBytes: 0,
        storagePath: '',
      },
    });

    await submission.save();

    const savedFile = await saveUploadedFile(data, submission._id.toString());
    submission.video = savedFile;
    await submission.save();

    if (app.agenda) {
      await app.agenda.now('generate-thumbnail', {
        submissionId: submission._id.toString(),
      });
    }

    return {
      success: true,
      submissionId: submission._id,
      discountCode,
      discountPercent,
    };
  });

  app.get('/public/wall/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const collection = await ReviewCollection.findOne({ slug });
    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found' });
    }

    const approvedSubmissions = await ReviewSubmission.find({
      collectionId: collection._id,
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const googleReviews = await GoogleReview.find()
      .sort({ time: -1 })
      .limit(20);

    return {
      collection: {
        title: collection.title,
        slug: collection.slug,
      },
      approvedSubmissions,
      googleReviews,
    };
  });

  // Generate discount code for Google review
  app.post('/public/google-review-discount/:publicToken', async (request, reply) => {
    const { publicToken } = request.params as { publicToken: string };

    const collection = await ReviewCollection.findOne({
      publicToken,
      isActive: true,
    });

    if (!collection) {
      return reply.code(404).send({ error: 'Collection not found or inactive' });
    }

    // Generate unique discount code for Google review
    const discountCode = generateDiscountCode('google');
    const discountPercent = getDiscountPercent('google');

    return {
      success: true,
      discountCode,
      discountPercent,
    };
  });

  // Get Google Review URL
  app.get('/public/google-review-url', async () => {
    const googleReviewUrl = await getSetting('googleReviewUrl', 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review');
    return {
      googleReviewUrl,
    };
  });
}
