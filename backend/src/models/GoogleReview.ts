import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleReview extends Document {
  placeId: string;
  reviewId: string;
  authorName: string;
  rating: number;
  text: string;
  time: Date;
  profilePhotoUrl?: string;
  syncedAt: Date;
}

const googleReviewSchema = new Schema<IGoogleReview>({
  placeId: {
    type: String,
    required: true,
  },
  reviewId: {
    type: String,
    required: true,
    unique: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  profilePhotoUrl: {
    type: String,
  },
  syncedAt: {
    type: Date,
    default: Date.now,
  },
});

googleReviewSchema.index({ placeId: 1, time: -1 });

export const GoogleReview = mongoose.model<IGoogleReview>(
  'GoogleReview',
  googleReviewSchema
);
