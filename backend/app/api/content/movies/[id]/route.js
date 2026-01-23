import { getMovieDetail } from '@/lib/services/ContentService'
import { getLanguageFromRequest } from '@/lib/middleware/language'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const language = getLanguageFromRequest(request, Object.fromEntries(searchParams))
    const { id } = params

    const movie = await getMovieDetail(id, language)
    return successResponse(movie)
  } catch (error) {
    return handleApiError(error)
  }
}
