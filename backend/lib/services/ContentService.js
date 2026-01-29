/**
 * Content Service
 * Handles movies, shows, live TV, and content discovery
 * Supports multilingual content with language fallback
 */

import { prisma } from '../db/client'
import { getMultilingualField } from '../middleware/language'
import { NotFoundError } from '../errors/AppError'

/**
 * Get all movies with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated movies list
 */
export const getMovies = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    language = 'en',
    genreId = null,
    isAvailable = true,
    sortBy = 'releaseDate',
  } = options

  const skip = (page - 1) * limit

  // Build where clause
  const where = {
    isAvailable,
  }

  if (genreId) {
    where.genreId = genreId
  }

  // Fetch movies
  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: 'desc' },
      include: {
        genre: true,
        streamingPlatforms: {
          include: { platform: true },
        },
      },
    }),
    prisma.movie.count({ where }),
  ])

  // Format response with language support
  const formattedMovies = movies.map((movie) => ({
    id: movie.id,
    title: getMultilingualField(movie, 'title', language),
    slug: movie.slug,
    description: getMultilingualField(movie, 'description', language),
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    rating: movie.rating,
    posterUrl: movie.posterUrl,
    thumbnailUrl: movie.thumbnailUrl,
    backdropUrl: movie.backdropUrl,
    genre: {
      id: movie.genre.id,
      name: getMultilingualField(movie.genre, 'name', language),
    },
    platforms: movie.streamingPlatforms.map((sp) => ({
      id: sp.platform.id,
      name: sp.platform.name,
      isAvailable: sp.isAvailable,
    })),
  }))

  return {
    data: formattedMovies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get movie by ID or slug
 * @param {string} identifier - Movie ID or slug
 * @param {string} language - Language code
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetail = async (identifier, language = 'en') => {
  const movie = await prisma.movie.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      genre: true,
      streamingPlatforms: {
        include: { platform: true },
      },
      reviews: {
        take: 5,
        include: { user: true },
      },
      ratings: true,
    },
  })

  if (!movie) {
    throw new NotFoundError('Movie')
  }

  // Calculate average rating
  const avgRating =
    movie.ratings.length > 0
      ? (movie.ratings.reduce((sum, r) => sum + r.score, 0) / movie.ratings.length).toFixed(1)
      : null

  return {
    id: movie.id,
    title: getMultilingualField(movie, 'title', language),
    slug: movie.slug,
    description: getMultilingualField(movie, 'description', language),
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    rating: movie.rating,
    averageUserRating: avgRating,
    posterUrl: movie.posterUrl,
    thumbnailUrl: movie.thumbnailUrl,
    backdropUrl: movie.backdropUrl,
    trailerUrl: movie.trailerUrl,
    director: getMultilingualField(movie, 'director', language),
    cast: movie[`cast_${language}`] ? JSON.parse(movie[`cast_${language}`]) : [],
    genre: {
      id: movie.genre.id,
      name: getMultilingualField(movie.genre, 'name', language),
    },
    platforms: movie.streamingPlatforms.map((sp) => ({
      id: sp.platform.id,
      name: sp.platform.name,
      isAvailable: sp.isAvailable,
      availableFrom: sp.availableFrom,
      availableUntil: sp.availableUntil,
    })),
    reviews: movie.reviews.map((review) => ({
      id: review.id,
      title: getMultilingualField(review, 'title', language),
      content: getMultilingualField(review, 'content', language),
      rating: review.rating,
      author: review.user.firstName_en,
    })),
  }
}

/**
 * Get all shows with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated shows list
 */
export const getShows = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    language = 'en',
    genreId = null,
    isAvailable = true,
  } = options

  const skip = (page - 1) * limit

  const where = { isAvailable }
  if (genreId) where.genreId = genreId

  const [shows, total] = await Promise.all([
    prisma.show.findMany({
      where,
      skip,
      take: limit,
      orderBy: { releaseDate: 'desc' },
      include: {
        genre: true,
        streamingPlatforms: {
          include: { platform: true },
        },
      },
    }),
    prisma.show.count({ where }),
  ])

  const formattedShows = shows.map((show) => ({
    id: show.id,
    title: getMultilingualField(show, 'title', language),
    slug: show.slug,
    description: getMultilingualField(show, 'description', language),
    releaseDate: show.releaseDate,
    totalSeasons: show.totalSeasons,
    totalEpisodes: show.totalEpisodes,
    rating: show.rating,
    posterUrl: show.posterUrl,
    thumbnailUrl: show.thumbnailUrl,
    genre: {
      id: show.genre.id,
      name: getMultilingualField(show.genre, 'name', language),
    },
    platforms: show.streamingPlatforms.map((sp) => ({
      id: sp.platform.id,
      name: sp.platform.name,
    })),
  }))

  return {
    data: formattedShows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get show details with seasons and episodes
 * @param {string} identifier - Show ID or slug
 * @param {string} language - Language code
 * @returns {Promise<Object>} Show details with seasons
 */
export const getShowDetail = async (identifier, language = 'en') => {
  const show = await prisma.show.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      genre: true,
      seasons: {
        include: {
          episodes: {
            orderBy: { episodeNumber: 'asc' },
          },
        },
        orderBy: { seasonNumber: 'asc' },
      },
      streamingPlatforms: {
        include: { platform: true },
      },
    },
  })

  if (!show) {
    throw new NotFoundError('Show')
  }

  return {
    id: show.id,
    title: getMultilingualField(show, 'title', language),
    slug: show.slug,
    description: getMultilingualField(show, 'description', language),
    releaseDate: show.releaseDate,
    totalSeasons: show.totalSeasons,
    totalEpisodes: show.totalEpisodes,
    rating: show.rating,
    posterUrl: show.posterUrl,
    thumbnailUrl: show.thumbnailUrl,
    backdropUrl: show.backdropUrl,
    genre: {
      id: show.genre.id,
      name: getMultilingualField(show.genre, 'name', language),
    },
    seasons: show.seasons.map((season) => ({
      id: season.id,
      seasonNumber: season.seasonNumber,
      title: getMultilingualField(season, 'title', language),
      episodes: season.episodes.map((episode) => ({
        id: episode.id,
        episodeNumber: episode.episodeNumber,
        title: getMultilingualField(episode, 'title', language),
        description: getMultilingualField(episode, 'description', language),
        duration: episode.duration,
        releaseDate: episode.releaseDate,
        thumbnailUrl: episode.thumbnailUrl,
      })),
    })),
    platforms: show.streamingPlatforms.map((sp) => ({
      id: sp.platform.id,
      name: sp.platform.name,
    })),
  }
}

/**
 * Get live TV channels
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Live TV channels
 */
export const getLiveTV = async (options = {}) => {
  const { language = 'en', limit = 50 } = options

  const channels = await prisma.liveTV.findMany({
    where: { isLive: true },
    take: limit,
    include: {
      streamingPlatforms: {
        include: { platform: true },
      },
    },
  })

  return channels.map((channel) => ({
    id: channel.id,
    name: getMultilingualField(channel, 'name', language),
    slug: channel.slug,
    description: getMultilingualField(channel, 'description', language),
    logoUrl: channel.logoUrl,
    category: getMultilingualField(channel, 'category', language),
    streamUrl: channel.streamUrl,
    platforms: channel.streamingPlatforms.map((sp) => ({
      id: sp.platform.id,
      name: sp.platform.name,
    })),
  }))
}
