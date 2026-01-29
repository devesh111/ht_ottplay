# Login Endpoint - Quick Reference

## 🚀 Quick Start

### Endpoint
```
POST /api/auth/login
```

### Request
```json
{
  "emailOrPhone": "user@example.com",
  "password": "password123"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "phone": "+1234567890",
      "firstName": "John",
      "lastName": "Doe",
      "preferredLanguage": "en",
      "isVerified": true
    }
  }
}
```

## 📁 File Location
```
backend/app/api/auth/login/route.js
```

## 🔑 Key Features
- ✅ Login with email OR phone
- ✅ Secure password verification (bcryptjs)
- ✅ JWT token generation (7-day expiry)
- ✅ HTTP-only cookie storage
- ✅ CSRF protection (SameSite=strict)
- ✅ Comprehensive error handling

## 🧪 Test with cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"user@example.com","password":"password123"}'
```

## 🔐 Security
- Password hashed with bcryptjs
- JWT signed with HS256
- HTTP-only cookie (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=strict (CSRF protection)
- Generic error messages

## 📚 Documentation
- **Full Docs:** `LOGIN_ENDPOINT_DOCS.md`
- **Implementation Summary:** `LOGIN_IMPLEMENTATION_SUMMARY.md`
- **This File:** `LOGIN_QUICK_REFERENCE.md`

## 🔗 Related Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/request-otp` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP

## ⚙️ Environment Variables
```env
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
NODE_ENV=production
```

## 💡 Usage in Frontend
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important!
  body: JSON.stringify({
    emailOrPhone: 'user@example.com',
    password: 'password123'
  })
})

const data = await response.json()
if (data.success) {
  // Token in data.data.token
  // Token also in authToken cookie
  // User data in data.data.user
}
```

## ✅ Status Codes
- `200` - Login successful
- `400` - Missing required fields
- `401` - Invalid credentials or inactive account
- `500` - Server error

## 🎯 What's Implemented
✅ Password-based login endpoint
✅ Email/Phone flexible authentication
✅ JWT token generation
✅ HTTP-only cookie storage
✅ Comprehensive error handling
✅ Security best practices
✅ Full documentation

## 📝 Notes
- Users must have a password set
- Account must be active (isActive=true)
- No verification required for login
- Always use HTTPS in production
- Token expires in 7 days
