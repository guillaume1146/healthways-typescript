import { NextRequest } from 'next/server'
import { verifyToken, JwtPayload } from './jwt'

/**
 * Validate the JWT from the request cookies.
 * Returns the payload if valid, null otherwise.
 */
export function validateRequest(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get('mediwyz_token')?.value
  if (!token) return null
  return verifyToken(token)
}
