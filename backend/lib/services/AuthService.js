/**
 * Auth Service
 * Handles OTP-based authentication, token generation, and user verification
 * Implements OpenAPI 3.0 authentication flows
 */

import bcryptjs from 'bcryptjs'
import { prisma } from '../db/client'
import { generateToken } from '../auth/jwt'
import { AuthenticationError, ValidationError, ConflictError } from '../errors/AppError'

/**
 * Generate random OTP (6 digits)
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP to phone/email (mock implementation)
 * In production, integrate with SMS/Email service (Twilio, SendGrid, etc.)
 * @param {string} phoneOrEmail - Phone number or email
 * @param {string} otp - OTP to send
 * @returns {Promise<boolean>} Success status
 */
const sendOTP = async (phoneOrEmail, otp) => {
  // Mock implementation - log to console
  console.log(`[OTP] Sending OTP ${otp} to ${phoneOrEmail}`)
  
  // In production:
  // - Use Twilio for SMS: await twilioClient.messages.create(...)
  // - Use SendGrid for Email: await sgMail.send(...)
  
  return true
}

/**
 * Request OTP for login
 * Creates or updates OTP record with expiration
 * @param {string} phoneOrEmail - Phone number or email
 * @returns {Promise<Object>} OTP request response
 */
export const requestOTP = async (phoneOrEmail) => {
  try {
    // Validate input
    if (!phoneOrEmail) {
      throw new ValidationError('Phone number or email is required')
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail },
        ],
      },
    })

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create OTP record
    await prisma.oTPRecord.create({
      data: {
        userId: user.id,
        phone: phoneOrEmail.includes('@') ? null : phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : null,
        otp,
        expiresAt,
        isUsed: false,
      },
    })

    // Send OTP (mock)
    await sendOTP(phoneOrEmail, otp)

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600, // 10 minutes in seconds
    }
  } catch (error) {
    throw error
  }
}

/**
 * Verify OTP and generate authentication token
 * @param {string} phoneOrEmail - Phone number or email
 * @param {string} otp - OTP to verify
 * @returns {Promise<Object>} Authentication token and user data
 */
export const verifyOTP = async (phoneOrEmail, otp) => {
  try {
    // Validate inputs
    if (!phoneOrEmail || !otp) {
      throw new ValidationError('Phone/email and OTP are required')
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phoneOrEmail },
          { email: phoneOrEmail },
        ],
      },
    })

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    // Find valid OTP record
    const otpRecord = await prisma.oTPRecord.findFirst({
      where: {
        userId: user.id,
        otp,
        isUsed: false,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    })

    if (!otpRecord) {
      throw new AuthenticationError('Invalid or expired OTP')
    }

    // Mark OTP as used
    await prisma.oTPRecord.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    })

    // Mark user as verified
    if (!user.isVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
    })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName_en,
        lastName: user.lastName_en,
        preferredLanguage: user.preferredLanguage,
      },
    }
  } catch (error) {
    throw error
  }
}

/**
 * Register new user with phone/email
 * @param {Object} data - User registration data
 * @returns {Promise<Object>} Created user data
 */
export const registerUser = async (data) => {
  try {
    const { email, phone, firstName, lastName, password } = data

    // Validate required fields
    if (!email && !phone) {
      throw new ValidationError('Email or phone is required')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    })

    if (existingUser) {
      throw new ConflictError('User with this email or phone already exists')
    }

    // Hash password if provided
    let passwordHash = null
    if (password) {
      const salt = await bcryptjs.genSalt(10)
      passwordHash = await bcryptjs.hash(password, salt)
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        passwordHash: passwordHash || '',
        firstName_en: firstName || null,
        lastName_en: lastName || null,
        preferredLanguage: 'en',
        isActive: true,
        isVerified: false,
      },
    })

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
    }
  } catch (error) {
    throw error
  }
}

/**
 * Verify password (for password-based login)
 * @param {string} password - Plain text password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} Password match status
 */
export const verifyPassword = async (password, hash) => {
  try {
    return await bcryptjs.compare(password, hash)
  } catch (error) {
    return false
  }
}

/**
 * Hash password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Password hash
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
  } catch (error) {
    throw new Error('Failed to hash password')
  }
}
