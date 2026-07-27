import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { id: string; email: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): { id: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
  } catch {
    return null;
  }
}

// Custom verify token for Edge runtime compatibility using Web Crypto API
export async function verifyTokenEdge(token: string): Promise<{ id: string; email: string; name: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload
    const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    // Verify expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      Buffer.from(signatureB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
      encoder.encode(`${headerB64}.${payloadB64}`)
    );

    if (!verified) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
