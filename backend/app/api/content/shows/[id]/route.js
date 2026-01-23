import { getShowDetail } from '@/lib/services/ContentService'
import { getLanguageFromRequest } from '@/lib/middleware/language'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const language = getLanguageFromRequest(request, Object.fromEntries(searchParams))
    const { id } = params

    const show = await getShowDetail(id, language)
    return successResponse(show)
  } catch (error) {
    return handleApiError(error)
  }
}
