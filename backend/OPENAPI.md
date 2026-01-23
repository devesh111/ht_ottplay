# OpenAPI 3.0 Specification - OTT Platform API

## Overview

This document describes the OTT Aggregator Platform API following OpenAPI 3.0 specification.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer <jwt_token>
```

## Content Negotiation

### Accept-Language Header

Supported languages: `en` (English), `ar` (Arabic)

```
Accept-Language: en-US,en;q=0.9,ar;q=0.8
```

## Response Format

### Success Response (2xx)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-22T18:00:00Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "timestamp": "2024-01-22T18:00:00Z"
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400,
    "details": null
  },
  "timestamp": "2024-01-22T18:00:00Z"
}
```

## Endpoints

### Authentication

#### POST /auth/request-otp
Request OTP for login

**Request Body**:
```json
{
  "phoneOrEmail": "user@example.com"
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

**Error Codes**:
- `VALIDATION_ERROR` (400): Missing phone/email
- `AUTHENTICATION_ERROR` (401): User not found

---

#### POST /auth/verify-otp
Verify OTP and get authentication token

**Request Body**:
```json
{
  "phoneOrEmail": "user@example.com",
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
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "phone": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "preferredLanguage": "en"
    }
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR` (400): Missing fields
- `AUTHENTICATION_ERROR` (401): Invalid/expired OTP

---

#### POST /auth/register
Register new user

**Request Body**:
```json
{
  "email": "user@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "phone": "+1234567890"
    }
  }
}
```

**Error Codes**:
- `VALIDATION_ERROR` (400): Invalid input
- `CONFLICT` (409): User already exists

---

### Content

#### GET /content/movies
Get paginated list of movies

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page
- `genreId` (string, optional): Filter by genre
- `lang` (string, default: en): Language code

**Headers**:
```
Accept-Language: en-US
```

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "The Matrix",
      "slug": "the-matrix",
      "description": "A computer hacker learns about reality",
      "releaseDate": "1999-03-31T00:00:00Z",
      "duration": 136,
      "rating": 8.7,
      "posterUrl": "https://example.com/poster.jpg",
      "genre": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Action"
      },
      "platforms": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
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

---

#### GET /content/movies/{id}
Get movie details

**Path Parameters**:
- `id` (string): Movie ID or slug

**Query Parameters**:
- `lang` (string, default: en): Language code

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Matrix",
    "slug": "the-matrix",
    "description": "A computer hacker learns about reality",
    "releaseDate": "1999-03-31T00:00:00Z",
    "duration": 136,
    "rating": 8.7,
    "averageUserRating": "9.0",
    "posterUrl": "https://example.com/poster.jpg",
    "backdropUrl": "https://example.com/backdrop.jpg",
    "trailerUrl": "https://example.com/trailer.mp4",
    "director": "Lana Wachowski, Lilly Wachowski",
    "cast": ["Keanu Reeves", "Laurence Fishburne"],
    "genre": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Action"
    },
    "platforms": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Netflix",
        "isAvailable": true,
        "availableFrom": "2024-01-01T00:00:00Z",
        "availableUntil": "2024-12-31T23:59:59Z"
      }
    ],
    "reviews": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "title": "Amazing movie!",
        "content": "One of the best sci-fi movies ever made",
        "rating": 9.0,
        "author": "John"
      }
    ]
  }
}
```

**Error Codes**:
- `NOT_FOUND` (404): Movie not found

---

#### GET /content/shows
Get paginated list of shows

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page
- `genreId` (string, optional): Filter by genre
- `lang` (string, default: en): Language code

**Response**: Similar to movies endpoint

---

#### GET /content/shows/{id}
Get show details with seasons and episodes

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Breaking Bad",
    "slug": "breaking-bad",
    "description": "A high school chemistry teacher turns to cooking meth",
    "releaseDate": "2008-01-20T00:00:00Z",
    "totalSeasons": 5,
    "totalEpisodes": 62,
    "rating": 9.5,
    "posterUrl": "https://example.com/poster.jpg",
    "genre": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Drama"
    },
    "seasons": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "seasonNumber": 1,
        "title": "Season 1",
        "episodes": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "episodeNumber": 1,
            "title": "Pilot",
            "description": "A high school chemistry teacher is diagnosed with cancer",
            "duration": 58,
            "releaseDate": "2008-01-20T00:00:00Z",
            "thumbnailUrl": "https://example.com/thumb.jpg"
          }
        ]
      }
    ],
    "platforms": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "name": "Netflix"
      }
    ]
  }
}
```

---

#### GET /content/live-tv
Get live TV channels

**Query Parameters**:
- `lang` (string, default: en): Language code

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "channels": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "News Channel",
        "slug": "news-channel",
        "description": "24/7 news coverage",
        "logoUrl": "https://example.com/logo.png",
        "category": "News",
        "streamUrl": "https://stream.example.com/news",
        "platforms": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "Netflix"
          }
        ]
      }
    ]
  }
}
```

---

### Search

#### GET /search
Search content across movies, shows, and articles

**Query Parameters**:
- `query` (string, required): Search term
- `contentType` (string, default: all): 'all', 'movie', 'show', 'article'
- `lang` (string, default: en): Language code

**Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "movies": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "movie",
        "title": "The Matrix",
        "description": "A computer hacker learns about reality",
        "posterUrl": "https://example.com/poster.jpg",
        "rating": 8.7,
        "releaseDate": "1999-03-31T00:00:00Z"
      }
    ],
    "shows": [],
    "articles": []
  }
}
```

---

### Watchlist

#### POST /watchlist
Add item to watchlist

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "contentId": "550e8400-e29b-41d4-a716-446655440000",
  "contentType": "movie"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Added to watchlist",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "contentId": "550e8400-e29b-41d4-a716-446655440000",
    "contentType": "movie",
    "status": "to_watch",
    "watchedProgress": 0
  }
}
```

---

#### GET /watchlist
Get user's watchlist

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page
- `status` (string, optional): 'to_watch', 'watching', 'completed'

**Response** (200): Paginated watchlist items

---

#### PATCH /watchlist/{id}
Update watchlist item

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "status": "watching",
  "watchedProgress": 50
}
```

**Response** (200): Updated watchlist item

---

#### DELETE /watchlist/{id}
Remove from watchlist

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Removed from watchlist"
}
```

---

## HTTP Status Codes

- `200 OK`: Successful GET/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate/conflict
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Rate limits are applied per IP address:
- 100 requests per minute for public endpoints
- 1000 requests per minute for authenticated endpoints

---

## Pagination

All list endpoints support pagination:

**Query Parameters**:
- `page` (integer, default: 1): Page number (1-indexed)
- `limit` (integer, default: 20): Items per page (max: 100)

**Response Includes**:
```json
{
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

---

## Filtering

Supported filters vary by endpoint:

**Movies/Shows**:
- `genreId`: Filter by genre
- `isAvailable`: Filter by availability
- `language`: Filter by language

**Search**:
- `contentType`: Filter by content type
- `language`: Filter by language

---

## Sorting

Default sorting:
- Movies: `releaseDate` (descending)
- Shows: `releaseDate` (descending)
- Articles: `publishedAt` (descending)

---

## Versioning

Current API Version: **v1**

Future versions will be available at `/api/v2/...`

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
