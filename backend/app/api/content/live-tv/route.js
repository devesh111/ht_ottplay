import { getLiveTV } from '@/lib/services/ContentService'
import { getLanguageFromRequest } from '@/lib/middleware/language'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const language = getLanguageFromRequest(request, Object.fromEntries(searchParams))

    const channels = await getLiveTV({ language })
    return successResponse({ channels })
  } catch (error) {
    return handleApiError(error)
  }
}
