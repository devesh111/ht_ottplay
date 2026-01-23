import { getShows } from '@/lib/services/ContentService'
import { getLanguageFromRequest } from '@/lib/middleware/language'
import { paginatedResponse, handleApiError } from '@/lib/utils/response'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const language = getLanguageFromRequest(request, Object.fromEntries(searchParams))
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const genreId = searchParams.get('genreId')

    const result = await getShows({
      page,
      limit,
      language,
      genreId,
    })

    return paginatedResponse(result.data, page, limit, result.pagination.total)
  } catch (error) {
    return handleApiError(error)
  }
}
