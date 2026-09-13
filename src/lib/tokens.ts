import crypto from 'crypto';

/**
 * src/lib/tokens.ts
 * HMAC-SHA256 signature generator and verifier for 1-click appointment management links.
 * Enables patients to view, reschedule, or cancel their appointment directly from reminder emails.
 * 
 * ASSUMPTION: JWT_SECRET environment variable is used as the HMAC secret key.
 */

const SECRET = process.env.JWT_SECRET || 'nabd-clinic-super-secret-jwt-key-2026-cairo';

export interface ManageTokenPayload {
  appointmentId: string;
  email: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Signs a URL-safe manage token for a given appointment and email.
 * Defaults to 30 days expiration.
 */
export function signManageToken(appointmentId: string, email: string, expiresInDays = 30): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 86400;
  const payload: ManageTokenPayload = {
    appointmentId,
    email: email.toLowerCase().trim(),
    exp,
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes a signed manage token.
 * Returns payload if valid and not expired, or null if invalid/tampered.
 */
export function verifyManageToken(token: string): ManageTokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadBase64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadBase64).digest('base64url');
    
    // Constant-time comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as ManageTokenPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }
    return payload;
  } catch {
    return null;
  }
}
