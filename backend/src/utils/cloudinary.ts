import { v2 as cloudinary } from 'cloudinary';
import { getConfig } from '../config/index.js';

let isConfigured = false;

export function configureCloudinary(): void {
  if (isConfigured) return;

  const config = getConfig();

  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });

  isConfigured = true;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export function generateUploadSignature(): CloudinarySignature {
  configureCloudinary();
  const config = getConfig();

  const timestamp = Math.round(new Date().getTime() / 1000);

  // Parameters to sign
  const params = {
    timestamp,
    upload_preset: config.CLOUDINARY_UPLOAD_PRESET,
    // Video validation: max 4 minutes (240 seconds)
    max_duration: 240,
    resource_type: 'video',
  };

  // Generate signature
  const signature = cloudinary.utils.api_sign_request(
    params,
    config.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: config.CLOUDINARY_CLOUD_NAME,
    apiKey: config.CLOUDINARY_API_KEY,
    uploadPreset: config.CLOUDINARY_UPLOAD_PRESET,
  };
}

export interface CloudinaryVideoInfo {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  duration: number;
  width: number;
  height: number;
  bytes: number;
}

export async function getVideoInfo(publicId: string): Promise<CloudinaryVideoInfo> {
  configureCloudinary();

  const result = await cloudinary.api.resource(publicId, {
    resource_type: 'video',
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    duration: result.duration,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
