import mongoose from 'mongoose';
import { loadConfig, getConfig } from '../config/index.js';
import { User } from '../models/User.js';
import { ReviewCollection } from '../models/ReviewCollection.js';
import { GoogleReview } from '../models/GoogleReview.js';
import { hashPassword } from '../utils/password.js';
import { generatePublicToken } from '../utils/crypto.js';

async function seed() {
  try {
    loadConfig();
    const config = getConfig();

    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@jobspace.local' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@jobspace.local',
        passwordHash: await hashPassword('Admin123!'),
        name: 'Admin',
        role: 'admin',
        preferences: {
          language: 'en',
          timezone: 'Asia/Jerusalem',
        },
      });
      await admin.save();
      console.log('✅ Admin user created: admin@jobspace.local / Admin123!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    const benAdminExists = await User.findOne({ email: 'benlenderman2@gmail.com' });
    if (!benAdminExists) {
      const benAdmin = new User({
        email: 'benlenderman2@gmail.com',
        passwordHash: await hashPassword('2wsx@WSX'),
        name: 'Ben Lenderman',
        role: 'admin',
        preferences: {
          language: 'en',
          timezone: 'Asia/Jerusalem',
        },
      });
      await benAdmin.save();
      console.log('✅ Ben admin user created: benlenderman2@gmail.com / 2wsx@WSX');
    } else {
      console.log('ℹ️  Ben admin user already exists');
    }

    const admin = await User.findOne({ email: 'admin@jobspace.local' });
    if (!admin) throw new Error('Admin not found');

    const collectionExists = await ReviewCollection.findOne({ slug: 'jobspace' });
    if (!collectionExists) {
      const collection = new ReviewCollection({
        title: 'JobSpace Reviews',
        slug: 'jobspace',
        publicToken: generatePublicToken(),
        createdBy: admin._id,
        isActive: true,
      });
      await collection.save();
      console.log('✅ Default collection created: JobSpace Reviews');
      console.log(`   Incentive URL: http://localhost:5173/incentive/${collection.publicToken}`);
      console.log(`   Submit URL: http://localhost:5173/submit/${collection.publicToken}`);
      console.log(`   Wall URL: http://localhost:5173/reviews/jobspace`);
    } else {
      console.log('ℹ️  Default collection already exists');
      console.log(`   Incentive URL: http://localhost:5173/incentive/${collectionExists.publicToken}`);
      console.log(`   Submit URL: http://localhost:5173/submit/${collectionExists.publicToken}`);
      console.log(`   Wall URL: http://localhost:5173/reviews/jobspace`);
    }

    if (!config.GOOGLE_PLACES_API_KEY) {
      const mockReviews = [
        {
          reviewId: 'mock-1',
          authorName: 'Sarah Cohen',
          rating: 5,
          text: 'JobSpace completely transformed our hiring process. The platform is intuitive and the candidate quality has improved significantly.',
          time: new Date('2026-01-15'),
        },
        {
          reviewId: 'mock-2',
          authorName: 'David Levi',
          rating: 5,
          text: 'Best job board we\'ve used. Great support team and excellent features for managing applications.',
          time: new Date('2026-01-10'),
        },
        {
          reviewId: 'mock-3',
          authorName: 'Rachel Stein',
          rating: 4,
          text: 'Very satisfied with the results. Found several qualified candidates quickly. Would recommend!',
          time: new Date('2026-01-05'),
        },
        {
          reviewId: 'mock-4',
          authorName: 'Michael Ben-David',
          rating: 5,
          text: 'Outstanding service! The AI-powered matching saved us so much time in screening candidates.',
          time: new Date('2025-12-28'),
        },
        {
          reviewId: 'mock-5',
          authorName: 'Tamar Goldberg',
          rating: 5,
          text: 'Highly professional platform. We hired 3 excellent developers through JobSpace in just 2 months.',
          time: new Date('2025-12-20'),
        },
      ];

      for (const review of mockReviews) {
        await GoogleReview.findOneAndUpdate(
          { reviewId: review.reviewId },
          {
            placeId: 'mock-place-id',
            ...review,
            syncedAt: new Date(),
          },
          { upsert: true }
        );
      }
      console.log('✅ Mock Google reviews seeded');
    }

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
