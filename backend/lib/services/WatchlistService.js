/**
 * Watchlist Service
 * Manages user watchlist and viewing history
 */

import { prisma } from '../db/client'
import { NotFoundError, ValidationError } from '../errors/AppError'
import { getMultilingualField } from '../middleware/language'

/**
 * Add item to watchlist
 * @param {string} userId - User ID
 * @param {string} contentId - Movie or Show ID
 * @param {string} contentType - 'movie' or 'show'
 * @returns {Promise<Object>} Watchlist item
 */
export const addToWatchlist = async (userId, contentId, contentType) => {
  try {
    if (!['movie', 'show'].includes(contentType)) {
      throw new ValidationError('Invalid content type')
    }

    const data = {
      userId,
      status: 'to_watch',
    }

    if (contentType === 'movie') {
      data.movieId = contentId
    } else {
      data.showId = contentId
    }

    const watchlistItem = await prisma.watchlist.create({
      data,
      include: {
        movie: true,
        show: true,
      },
    })

    return watchlistItem
  } catch (error) {
    throw error
  }
}

/**
 * Get user's watchlist
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Watchlist items
 */
export const getUserWatchlist = async (userId, options = {}) => {
  const { language = 'en', status = null, page = 1, limit = 20 } = options

  const skip = (page - 1) * limit

  const where = { userId }
  if (status) where.status = status

  const [items, total] = await Promise.all([
    prisma.watchlist.findMany({
      where,
      skip,
      take: limit,
      include: {
        movie: { include: { genre: true } },
        show: { include: { genre: true } },
      },
    }),
    prisma.watchlist.count({ where }),
  ])

  const formatted = items.map((item) => {
    const content = item.movie || item.show
    return {
      id: item.id,
      contentId: content.id,
      contentType: item.movie ? 'movie' : 'show',
      title: getMultilingualField(content, 'title', language),
      description: getMultilingualField(content, 'description', language),
      posterUrl: content.posterUrl,
      status: item.status,
      watchedProgress: item.watchedProgress,
      addedAt: item.createdAt,
    }
  })

  return {
    data: formatted,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Update watchlist item status
 * @param {string} watchlistId - Watchlist item ID
 * @param {string} status - New status
 * @param {number} progress - Watch progress (optional)
 * @returns {Promise<Object>} Updated watchlist item
 */
export const updateWatchlistItem = async (watchlistId, status, progress = null) => {
  try {
    const data = { status }
    if (progress !== null) {
      data.watchedProgress = progress
    }

    const updated = await prisma.watchlist.update({
      where: { id: watchlistId },
      data,
    })

    return updated
  } catch (error) {
    throw error
  }
}

/**
 * Remove from watchlist
 * @param {string} watchlistId - Watchlist item ID
 * @returns {Promise<boolean>} Success status
 */
export const removeFromWatchlist = async (watchlistId) => {
  try {
    await prisma.watchlist.delete({
      where: { id: watchlistId },
    })
    return true
  } catch (error) {
    throw error
  }
}
