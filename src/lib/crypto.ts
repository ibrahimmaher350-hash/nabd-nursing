import crypto from 'crypto';

/**
 * src/lib/crypto.ts
 * AES-256-GCM encryption and decryption utility for sensitive tokens at rest.
 * Used for Google refresh tokens stored in the database.
 * 
 * ASSUMPTION: ENCRYPTION_KEY is a 32-byte hex string (64 characters) or UTF-8 passphrase.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || 'nabd-secret-encryption-key-32-chars-min-length-safe!';
  if (secret.length === 64 && /^[0-9a-fA-F]+$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  // Hash passphrase into exactly 32 bytes
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt plain text using AES-256-GCM
 * Returns formatted string: "iv:authTag:encryptedPayload"
 */
export function encryptToken(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt token string formatted as "iv:authTag:encryptedPayload"
 */
export function decryptToken(encryptedText: string): string {
  if (!encryptedText) return '';
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }
  const [ivHex, authTagHex, encryptedData] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
