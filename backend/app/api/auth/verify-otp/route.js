import { verifyOTP } from '@/lib/services/AuthService'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneOrEmail, otp } = body

    const result = await verifyOTP(phoneOrEmail, otp)
    return successResponse(result, 200, 'OTP verified successfully')
  } catch (error) {
    return handleApiError(error)
  }
}
