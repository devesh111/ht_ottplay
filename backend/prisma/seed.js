/**
 * Database Seed Script
 * Populates the database with sample data for testing
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.searchLog.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.subscriptionPlan.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.review.deleteMany()
  await prisma.watchlist.deleteMany()
  await prisma.episode.deleteMany()
  await prisma.season.deleteMany()
  await prisma.streamingPlatformLiveTV.deleteMany()
  await prisma.streamingPlatformShow.deleteMany()
  await prisma.streamingPlatformMovie.deleteMany()
  await prisma.liveTV.deleteMany()
  await prisma.show.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.streamingPlatform.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.oTPRecord.deleteMany()
  await prisma.article.deleteMany()
  await prisma.user.deleteMany()

  console.log('✓ Cleared existing data')

  // Create genres
  const actionGenre = await prisma.genre.create({
    data: {
      name_en: 'Action',
      name_ar: 'حركة',
      slug: 'action',
      description_en: 'Action-packed movies and shows',
      description_ar: 'أفلام وعروض مليئة بالحركة',
    },
  })

  const dramaGenre = await prisma.genre.create({
    data: {
      name_en: 'Drama',
      name_ar: 'دراما',
      slug: 'drama',
      description_en: 'Dramatic stories',
      description_ar: 'قصص درامية',
    },
  })

  const comedyGenre = await prisma.genre.create({
    data: {
      name_en: 'Comedy',
      name_ar: 'كوميديا',
      slug: 'comedy',
      description_en: 'Funny and entertaining content',
      description_ar: 'محتوى مضحك وممتع',
    },
  })

  console.log('✓ Created genres')

  // Create streaming platforms
  const netflix = await prisma.streamingPlatform.create({
    data: {
      name: 'Netflix',
      slug: 'netflix',
      website: 'https://netflix.com',
      description: 'Streaming entertainment service',
    },
  })

  const prime = await prisma.streamingPlatform.create({
    data: {
      name: 'Amazon Prime Video',
      slug: 'prime-video',
      website: 'https://primevideo.com',
      description: 'Amazon streaming service',
    },
  })

  console.log('✓ Created streaming platforms')

  // Create users
  const hashedPassword = await bcryptjs.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      phone: '+1234567890',
      passwordHash: hashedPassword,
      firstName_en: 'John',
      firstName_ar: 'جون',
      lastName_en: 'Doe',
      lastName_ar: 'دو',
      preferredLanguage: 'en',
      isActive: true,
      isVerified: true,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'fatima@example.com',
      phone: '+9876543210',
      passwordHash: hashedPassword,
      firstName_en: 'Fatima',
      firstName_ar: 'فاطمة',
      lastName_en: 'Ahmed',
      lastName_ar: 'أحمد',
      preferredLanguage: 'ar',
      isActive: true,
      isVerified: true,
    },
  })

  console.log('✓ Created users')

  // Create user preferences
  await prisma.userPreferences.create({
    data: {
      userId: user1.id,
      favoriteGenres_en: [actionGenre.id],
      favoriteLanguages: ['en'],
    },
  })

  await prisma.userPreferences.create({
    data: {
      userId: user2.id,
      favoriteGenres_ar: [dramaGenre.id],
      favoriteLanguages: ['ar'],
    },
  })

  console.log('✓ Created user preferences')

  // Create movies
  const movie1 = await prisma.movie.create({
    data: {
      title_en: 'The Matrix',
      title_ar: 'المصفوفة',
      slug: 'the-matrix',
      description_en: 'A computer hacker learns about the true nature of reality',
      description_ar: 'يتعلم قرصان الكمبيوتر عن الطبيعة الحقيقية للواقع',
      releaseDate: new Date('1999-03-31'),
      duration: 136,
      rating: 8.7,
      director_en: 'Lana Wachowski, Lilly Wachowski',
      director_ar: 'لانا واتشوسكي، ليلي واتشوسكي',
      ageRating: 'R',
      genreId: actionGenre.id,
      isAvailable: true,
    },
  })

  const movie2 = await prisma.movie.create({
    data: {
      title_en: 'Inception',
      title_ar: 'الحاضنة',
      slug: 'inception',
      description_en: 'A skilled thief who steals corporate secrets through dream-sharing',
      description_ar: 'لص ماهر يسرق أسرار الشركات من خلال مشاركة الأحلام',
      releaseDate: new Date('2010-07-16'),
      duration: 148,
      rating: 8.8,
      director_en: 'Christopher Nolan',
      director_ar: 'كريستوفر نولان',
      ageRating: 'PG-13',
      genreId: actionGenre.id,
      isAvailable: true,
    },
  })

  console.log('✓ Created movies')

  // Create shows
  const show1 = await prisma.show.create({
    data: {
      title_en: 'Breaking Bad',
      title_ar: 'كسر السيء',
      slug: 'breaking-bad',
      description_en: 'A high school chemistry teacher turns to cooking meth',
      description_ar: 'يتحول معلم الكيمياء بالمدرسة الثانوية إلى طهي الميثامفيتامين',
      releaseDate: new Date('2008-01-20'),
      totalSeasons: 5,
      totalEpisodes: 62,
      rating: 9.5,
      creator_en: 'Vince Gilligan',
      creator_ar: 'فينس جيليجان',
      ageRating: 'TV-MA',
      genreId: dramaGenre.id,
      isAvailable: true,
    },
  })

  console.log('✓ Created shows')

  // Create seasons and episodes
  const season1 = await prisma.season.create({
    data: {
      showId: show1.id,
      seasonNumber: 1,
      title_en: 'Season 1',
      title_ar: 'الموسم 1',
      releaseDate: new Date('2008-01-20'),
    },
  })

  await prisma.episode.create({
    data: {
      seasonId: season1.id,
      episodeNumber: 1,
      title_en: 'Pilot',
      title_ar: 'الحلقة التجريبية',
      description_en: 'A high school chemistry teacher is diagnosed with cancer',
      description_ar: 'يتم تشخيص معلم الكيمياء بالمدرسة الثانوية بالسرطان',
      duration: 58,
      releaseDate: new Date('2008-01-20'),
    },
  })

  console.log('✓ Created seasons and episodes')

  // Create live TV channels
  await prisma.liveTV.create({
    data: {
      name_en: 'News Channel',
      name_ar: 'قناة الأخبار',
      slug: 'news-channel',
      category_en: 'News',
      category_ar: 'أخبار',
      streamUrl: 'https://stream.example.com/news',
      isLive: true,
    },
  })

  console.log('✓ Created live TV channels')

  // Link movies to platforms
  await prisma.streamingPlatformMovie.create({
    data: {
      movieId: movie1.id,
      platformId: netflix.id,
      isAvailable: true,
    },
  })

  await prisma.streamingPlatformMovie.create({
    data: {
      movieId: movie2.id,
      platformId: prime.id,
      isAvailable: true,
    },
  })

  console.log('✓ Linked movies to platforms')

  // Create subscription plans
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      platformId: netflix.id,
      name_en: 'Basic',
      name_ar: 'أساسي',
      description_en: 'Basic streaming plan',
      description_ar: 'خطة البث الأساسية',
      price: 9.99,
      maxDevices: 1,
      maxQuality: 'SD',
      adSupported: true,
    },
  })

  console.log('✓ Created subscription plans')

  // Create subscription
  await prisma.subscription.create({
    data: {
      userId: user1.id,
      planId: basicPlan.id,
      status: 'active',
      startDate: new Date(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('✓ Created subscriptions')

  // Create watchlist items
  await prisma.watchlist.create({
    data: {
      userId: user1.id,
      movieId: movie1.id,
      status: 'to_watch',
    },
  })

  console.log('✓ Created watchlist items')

  // Create ratings
  await prisma.rating.create({
    data: {
      userId: user1.id,
      movieId: movie1.id,
      score: 9.0,
    },
  })

  console.log('✓ Created ratings')

  // Create reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      movieId: movie1.id,
      title_en: 'Amazing movie!',
      title_ar: 'فيلم رائع!',
      content_en: 'One of the best sci-fi movies ever made',
      content_ar: 'واحد من أفضل أفلام الخيال العلمي على الإطلاق',
      rating: 9.0,
      isVerified: true,
    },
  })

  console.log('✓ Created reviews')

  // Create articles
  await prisma.article.create({
    data: {
      title_en: 'Top 10 Movies of 2024',
      title_ar: 'أفضل 10 أفلام لعام 2024',
      slug: 'top-10-movies-2024',
      content_en: 'Here are the best movies released in 2024...',
      content_ar: 'إليك أفضل الأفلام المُصدرة في عام 2024...',
      excerpt_en: 'A list of the best movies from 2024',
      excerpt_ar: 'قائمة بأفضل الأفلام من عام 2024',
      authorId: user1.id,
      genreId: actionGenre.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  })

  console.log('✓ Created articles')

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
