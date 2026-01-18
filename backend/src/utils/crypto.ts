import crypto from 'crypto';
import { getConfig } from '../config/index.js';

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generatePublicToken(): string {
  return generateToken(16);
}

export function hashToken(token: string): string {
  const config = getConfig();
  return crypto
    .createHmac('sha256', config.ENCRYPTION_KEY)
    .update(token)
    .digest('hex');
}
