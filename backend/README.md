# OTT Aggregator & Discovery Platform - Backend API

A production-ready Next.js backend for an OTT (Over-The-Top) aggregator and content discovery platform with multilingual support (English & Arabic), JWT authentication, and comprehensive content management.

## 🎯 Features

### Authentication & Users
- **OTP-based Login**: Phone/email verification with 6-digit OTP
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Multilingual user data (English & Arabic)
- **User Preferences**: Genre preferences, language selection, notification settings

### Content Management
- **Movies**: Full movie catalog with multilingual metadata
- **TV Shows**: Series with seasons and episodes
- **Live TV**: Live streaming channels
- **Genres**: Categorized content with multilingual names
- **Streaming Platforms**: Netflix, Prime Video, and more

### Discovery & Search
- **Full-Text Search**: Search across movies, shows, and articles
- **Advanced Filtering**: Filter by genre, language, availability
- **Trending Searches**: Track popular search queries
- **Pagination**: Efficient data pagination

### User Features
- **Watchlist**: Save movies/shows to watch later
- **Ratings & Reviews**: User ratings and reviews with multilingual support
- **Subscriptions**: Manage subscription plans and billing
- **Articles**: News and reviews with multilingual content

### Multilingual Support
- **Accept-Language Header**: Automatic language detection
- **Language Fallback**: English fallback for missing translations
- **Multilingual Fields**: All content stored in `field_en` and `field_ar` format

## 🏗️ Architecture

### Project Structure

```
ott-platform/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── users/             # User management
│   │   ├── content/           # Movies, shows, live TV
│   │   ├── search/            # Search functionality
│   │   ├── watchlist/         # Watchlist management
│   │   ├── subscriptions/     # Subscription management
│   │   └── articles/          # News and reviews
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── lib/
│   ├── db/
│   │   └── client.js          # Prisma client singleton
│   ├── auth/
│   │   └── jwt.js             # JWT utilities
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── language.js        # Language detection middleware
│   ├── services/
│   │   ├── AuthService.js     # Auth business logic
│   │   ├── ContentService.js  # Content management
│   │   ├── WatchlistService.js
│   │   └── SearchService.js
│   ├── errors/
│   │   └── AppError.js        # Custom error classes
│   └── utils/
│       └── response.js        # Response formatting
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Sample data
│   └── migrations/            # Database migrations
├── .env.local                 # Environment variables
├── package.json
└── README.md
```

### Modular Architecture

**Controllers → Services → Repositories Pattern**

- **API Routes** (`app/api/*/route.js`): Handle HTTP requests
- **Services** (`lib/services/*.js`): Business logic
- **Prisma Client** (`lib/db/client.js`): Data access layer
- **Middleware** (`lib/middleware/*.js`): Cross-cutting concerns
- **Error Handling** (`lib/errors/AppError.js`): Centralized error management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
cd /home/code/ott-platform
npm install
```

2. **Set up environment variables**:
```bash
# Copy and update .env.local
cp .env.example .env.local
```

3. **Run database migrations**:
```bash
npx prisma migrate dev --name init
```

4. **Seed sample data**:
```bash
npm run seed
```

5. **Start development server**:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📚 API Documentation

### OpenAPI 3.0 Compliance

All endpoints follow OpenAPI 3.0 specification with:
- Standardized request/response formats
- Proper HTTP status codes
- Error response schemas
- Bearer token authentication

### Authentication

**Bearer Token Format**:
```
Authorization: Bearer <jwt_token>
```

**Token Payload**:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "phone": "+1234567890",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Language Support

**Accept-Language Header**:
```
Accept-Language: en-US,en;q=0.9,ar;q=0.8
```

**Query Parameter Override**:
```
GET /api/content/movies?lang=ar
```

Supported languages: `en` (English), `ar` (Arabic)

---

## 🔐 Auth Endpoints

### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "phoneOrEmail": "+1234567890"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "success": true,
    "message": "OTP sent successfully",
    "expiresIn": 600
  }
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phoneOrEmail": "+1234567890",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "preferredLanguage": "en"
    }
  }
}
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123"
}
```

---

## 🎬 Content Endpoints

### Get Movies
```http
GET /api/content/movies?page=1&limit=20&genreId=uuid&lang=en
Accept-Language: en-US
```

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "The Matrix",
      "slug": "the-matrix",
      "description": "A computer hacker learns about reality",
      "releaseDate": "1999-03-31T00:00:00Z",
      "duration": 136,
      "rating": 8.7,
      "posterUrl": "https://...",
      "genre": {
        "id": "uuid",
        "name": "Action"
      },
      "platforms": [
        {
          "id": "uuid",
          "name": "Netflix",
          "isAvailable": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Get Movie Details
```http
GET /api/content/movies/{id}?lang=en
Accept-Language: en-US
```

### Get Shows
```http
GET /api/content/shows?page=1&limit=20&lang=en
```

### Get Show Details
```http
GET /api/content/shows/{id}?lang=en
```

Returns show with seasons and episodes.

### Get Live TV
```http
GET /api/content/live-tv?lang=en
```

---

## 🔍 Search Endpoints

### Search Content
```http
GET /api/search?query=matrix&contentType=all&lang=en
```

**Query Parameters**:
- `query` (required): Search term
- `contentType`: 'all', 'movie', 'show', 'article'
- `lang`: 'en' or 'ar'

**Response**:
```json
{
  "success": true,
  "data": {
    "movies": [...],
    "shows": [...],
    "articles": [...]
  }
}
```

---

## 📋 Watchlist Endpoints

### Add to Watchlist
```http
POST /api/watchlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentId": "uuid",
  "contentType": "movie"
}
```

### Get Watchlist
```http
GET /api/watchlist?page=1&limit=20&status=to_watch
Authorization: Bearer <token>
```

### Update Watchlist Item
```http
PATCH /api/watchlist/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "watching",
  "watchedProgress": 50
}
```

### Remove from Watchlist
```http
DELETE /api/watchlist/{id}
Authorization: Bearer <token>
```

---

## 💳 Subscription Endpoints

### Get Subscription Plans
```http
GET /api/subscriptions/plans?platformId=uuid
```

### Get User Subscriptions
```http
GET /api/subscriptions
Authorization: Bearer <token>
```

### Create Subscription
```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "uuid"
}
```

---

## 📰 Articles Endpoints

### Get Articles
```http
GET /api/articles?page=1&limit=20&lang=en&isPublished=true
```

### Get Article Details
```http
GET /api/articles/{slug}?lang=en
```

---

## 🗄️ Database Schema

### Key Models

**User**
- Multilingual fields: `firstName_en`, `firstName_ar`, `lastName_en`, `lastName_ar`
- Preferences: `preferredLanguage`, `isActive`, `isVerified`

**Movie & Show**
- Multilingual: `title_en`, `title_ar`, `description_en`, `description_ar`
- Metadata: `rating`, `releaseDate`, `duration`, `ageRating`
- Relations: `genre`, `streamingPlatforms`, `reviews`, `ratings`

**Genre**
- Multilingual: `name_en`, `name_ar`, `description_en`, `description_ar`

**Watchlist**
- Tracks user's saved content with status and progress
- Supports both movies and shows

**Subscription**
- Links users to subscription plans
- Tracks status, dates, and payment info

**Article**
- Multilingual content: `title_en`, `title_ar`, `content_en`, `content_ar`
- Publishing: `isPublished`, `publishedAt`
- SEO: `metaDescription_en`, `metaKeywords_en`

---

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ott_platform"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRY="7d"

# OTP
OTP_EXPIRY=600

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="OTT Aggregator"

# Language
DEFAULT_LANGUAGE="en"
SUPPORTED_LANGUAGES="en,ar"
```

---

## 🛠️ Development

### Database Commands

```bash
# Run migrations
npx prisma migrate dev --name description

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Seed database
npm run seed
```

### Code Structure

**Services Pattern**:
```javascript
// lib/services/MyService.js
export const myFunction = async (params) => {
  // Business logic
  // Validation
  // Database operations
  // Error handling
}
```

**API Routes**:
```javascript
// app/api/endpoint/route.js
import { myFunction } from '@/lib/services/MyService'
import { successResponse, handleApiError } from '@/lib/utils/response'

export async function GET(request) {
  try {
    const result = await myFunction()
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## 📊 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "statusCode": 400,
    "details": null
  },
  "timestamp": "2024-01-22T18:00:00Z"
}
```

### Error Codes

- `VALIDATION_ERROR` (400): Invalid input
- `AUTHENTICATION_ERROR` (401): Missing/invalid token
- `AUTHORIZATION_ERROR` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Duplicate/conflict
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

---

## 🧪 Testing

### Sample Requests

**1. Register User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**2. Request OTP**:
```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneOrEmail": "test@example.com"}'
```

**3. Get Movies**:
```bash
curl http://localhost:3000/api/content/movies \
  -H "Accept-Language: en-US"
```

**4. Search Content**:
```bash
curl "http://localhost:3000/api/search?query=matrix&lang=en"
```

---

## 📝 API Versioning

Current API Version: **v1**

Future versions will be available at `/api/v2/...`

---

## 🔒 Security

- **JWT Tokens**: HS256 algorithm with 7-day expiry
- **Password Hashing**: bcryptjs with salt rounds
- **OTP Expiry**: 10 minutes
- **CORS**: Configured for production domains
- **Input Validation**: All inputs validated before processing
- **SQL Injection**: Protected via Prisma ORM

---

## 📦 Dependencies

- **Next.js 14**: React framework
- **Prisma 5.8.0**: ORM
- **PostgreSQL**: Database
- **jsonwebtoken**: JWT handling
- **bcryptjs**: Password hashing
- **class-validator**: Input validation

---

## 🚀 Deployment

### Production Checklist

- [ ] Update `JWT_SECRET` with strong key
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Test all endpoints
- [ ] Configure CDN for media

### Deploy to Vercel

```bash
vercel deploy
```

---

## 📞 Support

For issues or questions:
1. Check the API documentation above
2. Review error messages and error codes
3. Check database schema in `prisma/schema.prisma`
4. Review service implementations in `lib/services/`

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.0)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
