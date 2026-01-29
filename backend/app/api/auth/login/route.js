/**
 * Password-based Login Endpoint
 * Allows users to login with email or phone number and password
 * Returns JWT token in response and sets it as an HTTP-only cookie
 */

import { prisma } from '@/lib/db/client'
import { verifyPassword } from '@/lib/services/AuthService'
import { generateToken } from '@/lib/auth/jwt'
import { successResponse, handleApiError } from '@/lib/utils/response'
import { ValidationError, AuthenticationError } from '@/lib/errors/AppError'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { emailOrPhone, password } = body

    // Validate inputs
    if (!emailOrPhone || !password) {
      throw new ValidationError('Email/Phone and password are required')
    }

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone },
        ],
      },
    })

    if (!user) {
      throw new AuthenticationError('Invalid email/phone or password')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('User account is inactive')
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email/phone or password')
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
    })

    // Create response with user data
    const responseData = {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName_en,
        lastName: user.lastName_en,
        preferredLanguage: user.preferredLanguage,
        isVerified: user.isVerified,
      },
    }

    // Create response with success message
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: responseData,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )

    // Set JWT token as HTTP-only cookie
    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days (matches JWT_EXPIRY)
      path: '/',
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}
