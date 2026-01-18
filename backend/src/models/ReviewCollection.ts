import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReviewCollection extends Document {
  title: string;
  slug: string;
  isActive: boolean;
  publicToken: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewCollectionSchema = new Schema<IReviewCollection>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publicToken: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewCollection = mongoose.model<IReviewCollection>(
  'ReviewCollection',
  reviewCollectionSchema
);
