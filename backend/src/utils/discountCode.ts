import crypto from 'crypto';

/**
 * Generates a unique discount code
 * Format: VIDEO20-XXXX or GOOGLE10-XXXX where X is random alphanumeric
 */
export function generateDiscountCode(type: 'video' | 'google'): string {
  const prefix = type === 'video' ? 'VIDEO20' : 'GOOGLE10';
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase().substring(0, 6);
  return `${prefix}-${randomPart}`;
}

/**
 * Gets the discount percentage based on type
 */
export function getDiscountPercent(type: 'video' | 'google'): number {
  return type === 'video' ? 20 : 10;
}
