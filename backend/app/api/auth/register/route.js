import { registerUser } from '@/lib/services/AuthService'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function POST(request) {
  try {
    const body = await request.json()
    const result = await registerUser(body)
    return successResponse(result, 201, 'User registered successfully')
  } catch (error) {
    return handleApiError(error)
  }
}
