import { Job } from 'agenda';
import { GoogleReview } from '../models/GoogleReview.js';
import { getConfig } from '../config/index.js';

const MOCK_REVIEWS = [
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

export async function syncGoogleReviewsJob(job: Job): Promise<void> {
  const config = getConfig();

  console.log('🔄 Syncing Google reviews...');

  if (config.GOOGLE_PLACES_API_KEY && config.GOOGLE_PLACE_ID) {
    await syncRealGoogleReviews(config.GOOGLE_PLACES_API_KEY, config.GOOGLE_PLACE_ID);
  } else {
    await syncMockGoogleReviews();
  }

  console.log('✅ Google reviews sync completed');
}

async function syncMockGoogleReviews(): Promise<void> {
  const placeId = 'mock-place-id';

  for (const mockReview of MOCK_REVIEWS) {
    await GoogleReview.findOneAndUpdate(
      { reviewId: mockReview.reviewId },
      {
        placeId,
        ...mockReview,
        syncedAt: new Date(),
      },
      { upsert: true }
    );
  }

  console.log(`📝 Synced ${MOCK_REVIEWS.length} mock Google reviews`);
}

async function syncRealGoogleReviews(apiKey: string, placeId: string): Promise<void> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'OK' || !data.result?.reviews) {
      console.error('Failed to fetch Google reviews:', data.status);
      return;
    }

    const reviews = data.result.reviews;

    for (const review of reviews) {
      await GoogleReview.findOneAndUpdate(
        { reviewId: review.time.toString() + review.author_name },
        {
          placeId,
          reviewId: review.time.toString() + review.author_name,
          authorName: review.author_name,
          rating: review.rating,
          text: review.text,
          time: new Date(review.time * 1000),
          profilePhotoUrl: review.profile_photo_url,
          syncedAt: new Date(),
        },
        { upsert: true }
      );
    }

    console.log(`📝 Synced ${reviews.length} real Google reviews`);
  } catch (error) {
    console.error('Error syncing real Google reviews:', error);
  }
}
