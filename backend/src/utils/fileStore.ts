import fs from 'fs/promises';
import path from 'path';
import { getConfig } from '../config/index.js';
import type { MultipartFile } from '@fastify/multipart';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export interface SavedFile {
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
}

export async function ensureUploadDir(): Promise<void> {
  const config = getConfig();
  await fs.mkdir(config.UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(
  file: MultipartFile,
  submissionId: string
): Promise<SavedFile> {
  const config = getConfig();
  const submissionDir = path.join(config.UPLOAD_DIR, submissionId);
  await fs.mkdir(submissionDir, { recursive: true });

  const ext = path.extname(file.filename);
  const filename = `video${ext}`;
  const storagePath = path.join(submissionDir, filename);

  await pipeline(file.file, createWriteStream(storagePath));

  const stats = await fs.stat(storagePath);

  return {
    originalFilename: file.filename,
    mimeType: file.mimetype,
    sizeBytes: stats.size,
    storagePath: path.join(submissionId, filename),
  };
}

export function getAbsolutePath(relativePath: string): string {
  const config = getConfig();
  return path.join(config.UPLOAD_DIR, relativePath);
}

export async function fileExists(relativePath: string): Promise<boolean> {
  try {
    await fs.access(getAbsolutePath(relativePath));
    return true;
  } catch {
    return false;
  }
}
