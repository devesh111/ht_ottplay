# Password-Based Login Endpoint Documentation

## Overview
A new password-based login endpoint has been added to the backend at `/api/auth/login`. This endpoint allows users to authenticate using either their email or phone number along with their password.

## Endpoint Details

### Route
```
POST /api/auth/login
```

### Location
```
backend/app/api/auth/login/route.js
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Parameters
```json
{
  "emailOrPhone": "user@example.com",  // or phone number like "+1234567890"
  "password": "userPassword123"
}
```

### Example Requests

**Login with Email:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "user@example.com",
    "password": "userPassword123"
  }'
```

**Login with Phone:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "+1234567890",
    "password": "userPassword123"
  }'
```

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "phone": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "preferredLanguage": "en",
      "isVerified": true
    }
  },
  "timestamp": "2026-01-29T15:47:00.000Z"
}
```

### Error Responses

**Missing Required Fields (400 Bad Request)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email/Phone and password are required",
    "statusCode": 400
  },
  "timestamp": "2026-01-29T15:47:00.000Z"
}
```

**Invalid Credentials (401 Unauthorized)**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid email/phone or password",
    "statusCode": 401
  },
  "timestamp": "2026-01-29T15:47:00.000Z"
}
```

**User Account Inactive (401 Unauthorized)**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "User account is inactive",
    "statusCode": 401
  },
  "timestamp": "2026-01-29T15:47:00.000Z"
}
```

## Cookie Management

### JWT Token Cookie
The endpoint automatically sets an HTTP-only cookie containing the JWT token:

**Cookie Details:**
- **Name:** `authToken`
- **Value:** JWT token (7-day expiration)
- **HttpOnly:** `true` (prevents JavaScript access for security)
- **Secure:** `true` (only in production, HTTPS only)
- **SameSite:** `strict` (CSRF protection)
- **Max-Age:** 604800 seconds (7 days)
- **Path:** `/`

### Cookie Usage
The cookie is automatically sent with subsequent requests to the server. The frontend can access the token from the response body for additional uses (e.g., storing in localStorage for API calls).

## Implementation Details

### Key Features
1. **Flexible Authentication:** Users can login with either email or phone number
2. **Password Verification:** Uses bcryptjs for secure password comparison
3. **JWT Token Generation:** Generates a signed JWT token with user information
4. **HTTP-Only Cookie:** Token stored securely in an HTTP-only cookie
5. **CSRF Protection:** SameSite=strict prevents cross-site request forgery
6. **User Status Check:** Verifies user account is active before login
7. **Error Handling:** Comprehensive error handling with appropriate HTTP status codes

### Security Measures
- ✅ Password hashing with bcryptjs
- ✅ HTTP-only cookies (prevents XSS attacks)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=strict (CSRF protection)
- ✅ Generic error messages (doesn't reveal if email/phone exists)
- ✅ User active status verification

### Dependencies Used
- **JWT Generation:** `lib/auth/jwt.js` - `generateToken()`
- **Password Verification:** `lib/services/AuthService.js` - `verifyPassword()`
- **Database:** Prisma ORM for user lookup
- **Error Handling:** Custom AppError classes
- **Response Formatting:** Standardized response utilities

## Database Requirements

The endpoint requires the following User model fields:
- `id` (UUID)
- `email` (unique)
- `phone` (unique, optional)
- `passwordHash` (required)
- `firstName_en`
- `lastName_en`
- `preferredLanguage`
- `isActive`
- `isVerified`

All these fields are already defined in the Prisma schema.

## Integration with Frontend

### JavaScript/Fetch Example
```javascript
async function login(emailOrPhone, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: includes cookies
      body: JSON.stringify({
        emailOrPhone,
        password,
      }),
    })

    const data = await response.json()

    if (data.success) {
      // Login successful
      const { token, user } = data.data
      console.log('User:', user)
      // Store token if needed for API calls
      localStorage.setItem('authToken', token)
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } else {
      // Show error message
      console.error('Login failed:', data.error.message)
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
```

### React Hook Example
```javascript
import { useState } from 'react'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (emailOrPhone, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emailOrPhone, password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error.message)
      }

      return data.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
```

## Testing

### Using Postman
1. Create a new POST request to `http://localhost:3000/api/auth/login`
2. Set Content-Type header to `application/json`
3. Add request body:
```json
{
  "emailOrPhone": "test@example.com",
  "password": "testPassword123"
}
```
4. Send request
5. Check response and cookies in the "Cookies" tab

### Using cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"testPassword123"}' \
  -v
```

## Environment Variables

The endpoint uses the following environment variables (already configured in JWT utility):
- `JWT_SECRET` - Secret key for signing JWT tokens
- `JWT_EXPIRY` - Token expiration time (default: '7d')
- `NODE_ENV` - Environment (development/production)

## Related Endpoints

- **Register:** `POST /api/auth/register` - Create new user account
- **OTP Request:** `POST /api/auth/request-otp` - Request OTP for login
- **OTP Verify:** `POST /api/auth/verify-otp` - Verify OTP and login

## Notes

1. **Password Requirement:** Users must have a password set in their account (passwordHash field must not be empty)
2. **User Verification:** The endpoint doesn't require users to be verified (isVerified=true), but checks if account is active
3. **Rate Limiting:** Consider implementing rate limiting on this endpoint in production
4. **Logging:** All authentication attempts should be logged for security auditing
5. **HTTPS:** Always use HTTPS in production for secure password transmission

## Future Enhancements

- [ ] Add rate limiting to prevent brute force attacks
- [ ] Implement login attempt logging
- [ ] Add two-factor authentication (2FA)
- [ ] Add device fingerprinting
- [ ] Implement refresh token mechanism
- [ ] Add login history tracking
