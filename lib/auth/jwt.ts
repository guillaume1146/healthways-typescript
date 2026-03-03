import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production. Refusing to start with an insecure default.')
}
if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not set. Using insecure default for development only.')
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'healthwyz-dev-secret-change-in-production'
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
