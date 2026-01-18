import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReviewSubmission extends Document {
  collectionId: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  personName: string;
  personRole: string;
  companyName?: string;
  rating: number;
  text: string;
  video: {
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    storagePath: string;
    thumbnailPath?: string;
    durationSec?: number;
  };
  consent: boolean;
  consentAt?: Date;
  source: 'manual' | 'google';
  discountCode?: string;
  discountPercent?: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSubmissionSchema = new Schema<IReviewSubmission>(
  {
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'ReviewCollection',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    personName: {
      type: String,
      required: true,
    },
    personRole: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
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
      maxlength: 1000,
    },
    video: {
      originalFilename: String,
      mimeType: String,
      sizeBytes: Number,
      storagePath: String,
      thumbnailPath: String,
      durationSec: Number,
    },
    consent: {
      type: Boolean,
      required: true,
    },
    consentAt: {
      type: Date,
    },
    source: {
      type: String,
      enum: ['manual', 'google'],
      default: 'manual',
    },
    discountCode: {
      type: String,
    },
    discountPercent: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

reviewSubmissionSchema.index({ collectionId: 1, status: 1, createdAt: -1 });
reviewSubmissionSchema.index({ status: 1, createdAt: -1 });

export const ReviewSubmission = mongoose.model<IReviewSubmission>(
  'ReviewSubmission',
  reviewSubmissionSchema
);
