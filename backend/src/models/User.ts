import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'viewer';
  preferences: {
    language: 'en' | 'he';
    timezone: string;
  };
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'viewer',
    },
    preferences: {
      language: {
        type: String,
        enum: ['en', 'he'],
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'Asia/Jerusalem',
      },
    },
    refreshTokenHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
