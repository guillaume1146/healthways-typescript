import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production. Refusing to start with an insecure default.')
  }
  if (!secret) {
    console.warn('WARNING: JWT_SECRET environment variable is not set. Using insecure default for development only.')
  }
  return secret || 'omd-dev-secret-change-in-production'
}

const EFFECTIVE_JWT_SECRET = getJwtSecret()
const JWT_EXPIRY = '7d'

export interface JwtPayload {
  sub: string       // user ID
  userType: string
  email: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, EFFECTIVE_JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, EFFECTIVE_JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}
