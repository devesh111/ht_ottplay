/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user context to requests
 * Implements OpenAPI 3.0 Bearer token authentication
 */

import { extractTokenFromHeader, verifyToken } from '../auth/jwt'
import { AuthenticationError } from '../errors/AppError'

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to request object
 * @param {Object} request - Next.js request object
 * @returns {Object} User data from token or throws error
 */
export const verifyAuth = (request) => {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      throw new AuthenticationError('Missing authorization header')
    }

    // Extract token from "Bearer <token>" format
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      throw new AuthenticationError('Invalid authorization header format')
    }

    // Verify and decode token
    const decoded = verifyToken(token)
    
    return decoded
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError(error.message)
  }
}

/**
 * Optional authentication middleware
 * Returns user data if token is valid, otherwise returns null
 * @param {Object} request - Next.js request object
 * @returns {Object|null} User data or null
 */
export const verifyAuthOptional = (request) => {
  try {
    return verifyAuth(request)
  } catch (error) {
    return null
  }
}
