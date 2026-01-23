import { requestOTP } from '@/lib/services/AuthService'
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/response'

export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneOrEmail } = body

    if (!phoneOrEmail) {
      return errorResponse('Phone number or email is required', 400, 'VALIDATION_ERROR')
    }

    const result = await requestOTP(phoneOrEmail)
    return successResponse(result, 200, 'OTP sent successfully')
  } catch (error) {
    return handleApiError(error)
  }
}
