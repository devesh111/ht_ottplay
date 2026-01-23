/**
 * JWT Authentication Utilities
 * Handles token generation, verification, and payload extraction
 * Implements OpenAPI 3.0 compliant authentication
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - Token payload (userId, email, etc.)
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    })
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Failed to generate authentication token')
  }
}

/**
 * Verify JWT token and extract payload
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    }
    throw error
  }
}

/**
 * Extract token from Authorization header
 * Expects format: "Bearer <token>"
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * Decode token without verification (for debugging)
 * WARNING: Only use for non-security-critical operations
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}
