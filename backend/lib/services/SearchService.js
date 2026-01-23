/**
 * Search Service
 * Full-text search across movies, shows, and articles
 * Supports filtering and language-specific search
 */

import { prisma } from '../db/client'
import { getMultilingualField } from '../middleware/language'

/**
 * Search content (movies, shows, articles)
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
export const searchContent = async (query, options = {}) => {
  const {
    language = 'en',
    contentType = 'all', // 'all', 'movie', 'show', 'article'
    limit = 50,
  } = options

  const searchQuery = `%${query}%`
  const results = {
    movies: [],
    shows: [],
    articles: [],
  }

  try {
    // Search movies
    if (['all', 'movie'].includes(contentType)) {
      const movies = await prisma.movie.findMany({
        where: {
          OR: [
            { title_en: { contains: searchQuery, mode: 'insensitive' } },
            { title_ar: { contains: searchQuery, mode: 'insensitive' } },
            { description_en: { contains: searchQuery, mode: 'insensitive' } },
            { description_ar: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { genre: true },
      })

      results.movies = movies.map((movie) => ({
        id: movie.id,
        type: 'movie',
        title: getMultilingualField(movie, 'title', language),
        description: getMultilingualField(movie, 'description', language),
        posterUrl: movie.posterUrl,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      }))
    }

    // Search shows
    if (['all', 'show'].includes(contentType)) {
      const shows = await prisma.show.findMany({
        where: {
          OR: [
            { title_en: { contains: searchQuery, mode: 'insensitive' } },
            { title_ar: { contains: searchQuery, mode: 'insensitive' } },
            { description_en: { contains: searchQuery, mode: 'insensitive' } },
            { description_ar: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { genre: true },
      })

      results.shows = shows.map((show) => ({
        id: show.id,
        type: 'show',
        title: getMultilingualField(show, 'title', language),
        description: getMultilingualField(show, 'description', language),
        posterUrl: show.posterUrl,
        rating: show.rating,
        totalSeasons: show.totalSeasons,
      }))
    }

    // Search articles
    if (['all', 'article'].includes(contentType)) {
      const articles = await prisma.article.findMany({
        where: {
          isPublished: true,
          OR: [
            { title_en: { contains: searchQuery, mode: 'insensitive' } },
            { title_ar: { contains: searchQuery, mode: 'insensitive' } },
            { content_en: { contains: searchQuery, mode: 'insensitive' } },
            { content_ar: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { author: true },
      })

      results.articles = articles.map((article) => ({
        id: article.id,
        type: 'article',
        title: getMultilingualField(article, 'title', language),
        excerpt: getMultilingualField(article, 'excerpt', language),
        featuredImage: article.featuredImage,
        author: article.author.firstName_en,
        publishedAt: article.publishedAt,
      }))
    }

    // Log search
    await prisma.searchLog.create({
      data: {
        query,
        language,
        resultsCount: results.movies.length + results.shows.length + results.articles.length,
      },
    })

    return results
  } catch (error) {
    throw error
  }
}

/**
 * Get trending searches
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Trending searches
 */
export const getTrendingSearches = async (limit = 10) => {
  try {
    const trending = await prisma.searchLog.groupBy({
      by: ['query'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    })

    return trending.map((item) => ({
      query: item.query,
      count: item._count.id,
    }))
  } catch (error) {
    throw error
  }
}
