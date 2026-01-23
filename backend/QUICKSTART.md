# Quick Start Guide - OTT Platform Backend

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
```bash
# Ensure you have Node.js 18+ and PostgreSQL installed
node --version  # Should be v18+
psql --version  # Should be 12+
```

### 2. Install Dependencies
```bash
cd /home/code/ott-platform
npm install
```

### 3. Setup Database
```bash
# Database already created: ott_platform
# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000 (or next available port)
```

### 5. Test API
```bash
# Get movies
curl http://localhost:3000/api/content/movies

# Search content
curl "http://localhost:3000/api/search?query=matrix"

# Request OTP
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneOrEmail": "john@example.com"}'
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `OPENAPI.md` | API specification |
| `PROJECT_SUMMARY.md` | Project overview |
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.js` | Sample data |
| `lib/services/*.js` | Business logic |
| `app/api/*/route.js` | API endpoints |

---

## 🔑 Environment Variables

Located in `.env.local`:

```bash
DATABASE_URL="postgresql://sandbox:password@localhost:5432/ott_platform"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRY="7d"
OTP_EXPIRY=600
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_LANGUAGE="en"
SUPPORTED_LANGUAGES="en,ar"
```

---

## 🧪 Sample API Calls

### Authentication

**Request OTP**:
```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneOrEmail": "john@example.com"}'
```

**Verify OTP** (use OTP from console logs):
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneOrEmail": "john@example.com", "otp": "123456"}'
```

**Register User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Content

**Get Movies**:
```bash
curl http://localhost:3000/api/content/movies?page=1&limit=10
```

**Get Movie Details**:
```bash
curl http://localhost:3000/api/content/movies/the-matrix
```

**Get Shows**:
```bash
curl http://localhost:3000/api/content/shows
```

**Get Show Details**:
```bash
curl http://localhost:3000/api/content/shows/breaking-bad
```

**Get Live TV**:
```bash
curl http://localhost:3000/api/content/live-tv
```

### Search

**Search Content**:
```bash
curl "http://localhost:3000/api/search?query=matrix&contentType=all&lang=en"
```

### Multilingual

**Get Content in Arabic**:
```bash
curl http://localhost:3000/api/content/movies/the-matrix?lang=ar
```

**Using Accept-Language Header**:
```bash
curl http://localhost:3000/api/content/movies \
  -H "Accept-Language: ar-SA,ar;q=0.9"
```

---

## 🗄️ Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name description

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Seed database
npm run seed
```

---

## 📊 Sample Data

After seeding, database contains:

**Users**:
- john@example.com (English preference)
- fatima@example.com (Arabic preference)

**Movies**:
- The Matrix (1999)
- Inception (2010)

**Shows**:
- Breaking Bad (5 seasons, 62 episodes)

**Platforms**:
- Netflix
- Amazon Prime Video

**Genres**:
- Action
- Drama
- Comedy

---

## 🔍 Debugging

### View Logs
```bash
# Check server logs
tail -f server.log

# View database queries
# Set in .env: DATABASE_LOG=query
```

### Prisma Studio
```bash
# Open interactive database viewer
npx prisma studio
# Opens at http://localhost:5555
```

### API Testing Tools

**Postman**:
1. Import OpenAPI spec from `OPENAPI.md`
2. Set base URL to `http://localhost:3000/api`
3. Test endpoints

**cURL**:
- Use examples above
- Add `-v` flag for verbose output

**Thunder Client** (VS Code):
- Install extension
- Create requests from examples

---

## 🚨 Common Issues

### Port Already in Use
```bash
# Server will use next available port (e.g., 3002)
# Check console output for actual port
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
# Check PostgreSQL is running
psql -U sandbox -d ott_platform -c "SELECT 1"
```

### OTP Not Showing
```bash
# OTP is logged to console in development
# Check terminal output for [OTP] message
```

### Prisma Client Error
```bash
# Regenerate Prisma Client
npx prisma generate
```

---

## 📈 Performance Tips

1. **Use Pagination**: Always use `page` and `limit` parameters
2. **Filter Early**: Use `genreId` to reduce results
3. **Cache Responses**: Implement Redis for frequently accessed data
4. **Index Queries**: Database indexes already configured
5. **Lazy Load**: Load related data only when needed

---

## 🔒 Security Reminders

1. **Change JWT_SECRET**: Update before production
2. **Use HTTPS**: Enable in production
3. **Validate Input**: All inputs are validated
4. **Rate Limiting**: Implement in production
5. **CORS**: Configure for your domain
6. **Environment Variables**: Never commit `.env.local`

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Review `OPENAPI.md` for API specification
3. Check `PROJECT_SUMMARY.md` for architecture overview
4. Review code comments in `lib/services/*.js`
5. Check database schema in `prisma/schema.prisma`

---

## 🎯 Next Steps

1. ✅ Start development server
2. ✅ Test API endpoints
3. ✅ Review database schema
4. ✅ Explore service implementations
5. ✅ Customize for your needs
6. ✅ Deploy to production

---

**Happy Coding! 🚀**

For production deployment, see README.md deployment section.
