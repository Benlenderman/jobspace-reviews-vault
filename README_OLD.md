# JobSpace Reviews Vault

A production-grade standalone application for collecting video testimonials and showcasing Google Reviews.

## Features

- 🎥 Video testimonial collection with automatic thumbnail generation
- ⭐ Google Reviews integration (with mock fallback)
- 🌍 Bilingual support (English/Hebrew) with full RTL
- 🔐 Secure admin panel with JWT authentication
- 📊 Analytics dashboard with charts
- 🎨 Modern, responsive design matching Base44 reference
- 🐳 Fully containerized with Docker Compose

## Quick Start

### Prerequisites

- Docker & Docker Compose
- 8GB RAM recommended
- Ports 3000, 5173, 27017 available

### Setup & Run

1. **Clone and navigate to project:**
   ```bash
   cd jobspace-reviews-vault
   ```

2. **Create environment files:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services:**
   ```bash
   docker compose up --build
   ```

4. **Wait for services to be ready** (2-3 minutes first time):
   - MongoDB starts
   - Backend builds, runs seed script, starts server
   - Frontend builds and starts dev server

5. **Access the application:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:3000/api
   - **Public Wall:** http://localhost:5173/reviews/jobspace
   - **Admin Panel:** http://localhost:5173/admin

### Default Credentials

```
Email: admin@jobspace.local
Password: Admin123!
```

## Demo Flow

Follow these steps to see the complete flow:

### 1. View Public Reviews Wall
- Navigate to: http://localhost:5173/reviews/jobspace
- See mock Google reviews (5 seeded reviews)
- View stats and ratings
- Switch language EN/עב to test RTL

### 2. Submit a Video Testimonial
- **Get submit link from admin panel** (see step 3)
- Or use the default: http://localhost:5173/submit/[publicToken]
  - Check admin panel Collections page for the exact token
- Fill out the form:
  - Name: Your Name
  - Role: Your Role
  - Company: (optional)
  - Rating: 1-5 stars
  - Text: Your testimonial (max 1000 chars)
  - Video: Upload an MP4/WebM file (max 200MB)
  - Consent: Check the box
- Submit and wait for success message

### 3. Admin: View & Approve Submission
- Login to admin: http://localhost:5173/admin/login
- Use credentials above
- Go to **Submissions** page
- See your pending submission
- Click **View** to see details and video
- Click **Approve** to approve

### 4. View Approved Testimonial on Public Wall
- Return to: http://localhost:5173/reviews/jobspace
- Your approved video testimonial now appears!
- Click thumbnail to play video in modal

### 5. Explore Admin Features
- **Dashboard:** View stats and rating distribution chart
- **Collections:** See submit links and wall URLs
- **Settings:** Configure Google Places API (optional)

## Project Structure

```
jobspace-reviews-vault/
├── backend/
│   ├── src/
│   │   ├── config/         # Zod validation
│   │   ├── models/         # Mongoose models
│   │   ├── modules/        # Route modules
│   │   │   ├── auth/
│   │   │   ├── collections/
│   │   │   ├── submissions/
│   │   │   ├── public/
│   │   │   └── settings/
│   │   ├── jobs/           # Agenda jobs
│   │   ├── plugins/        # Auth & error handling
│   │   ├── utils/          # Helpers
│   │   ├── scripts/        # Seed script
│   │   ├── app.ts
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── i18n/           # Translations (en/he)
│   │   ├── pages/          # Public & Admin pages
│   │   ├── store/          # Zustand store
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile.dev
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Public

```
POST   /api/public/submit/:publicToken    - Submit testimonial
GET    /api/public/wall/:slug              - Get public wall data
```

### Auth

```
POST   /api/auth/login        - Login
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - Logout
GET    /api/auth/me           - Get current user
```

### Admin (Protected)

```
GET    /api/collections                    - List collections
POST   /api/collections                    - Create collection
GET    /api/collections/:id                - Get collection
PATCH  /api/collections/:id/toggle         - Toggle active

GET    /api/submissions                    - List submissions (?status=pending)
GET    /api/submissions/:id                - Get submission
PATCH  /api/submissions/:id/approve        - Approve
PATCH  /api/submissions/:id/reject         - Reject
GET    /api/submissions/stats/summary      - Get stats

GET    /api/settings                       - Get settings
PUT    /api/settings                       - Update settings
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/jobspace_reviews_vault
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-in-production
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=/app/uploads

# Optional: Real Google Places API
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
```

**Note:** If `GOOGLE_PLACES_API_KEY` is not set, the app uses mock Google reviews.

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Tech Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Fastify (TypeScript)
- **Database:** MongoDB + Mongoose
- **Jobs:** Agenda.js
- **Auth:** JWT (access + refresh tokens)
- **Security:** @fastify/helmet, @fastify/rate-limit
- **Validation:** Zod
- **Video Processing:** ffmpeg (thumbnail generation)

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router DOM
- **State:** TanStack Query + Zustand
- **Styling:** Tailwind CSS
- **i18n:** react-i18next (EN/HE with RTL)
- **Charts:** Recharts

## Troubleshooting

### Port Conflicts

If ports are already in use:
```bash
# Check what's using ports
lsof -i :3000
lsof -i :5173
lsof -i :27017

# Stop services
docker compose down
```

### Seed Script Doesn't Run

```bash
# Run manually
docker compose exec backend npm run seed
```

### Video Upload Fails

- Check file size (max 200MB)
- Ensure file type is mp4/webm/mov
- Check backend logs: `docker compose logs backend`

### Thumbnail Not Generated

```bash
# Check ffmpeg is installed
docker compose exec backend ffmpeg -version

# Check job logs
docker compose logs backend | grep thumbnail
```

### MongoDB Connection Issues

```bash
# Restart MongoDB
docker compose restart mongodb

# Check MongoDB logs
docker compose logs mongodb
```

### Frontend Not Loading

```bash
# Rebuild frontend
docker compose up --build frontend

# Check logs
docker compose logs frontend
```

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Access

```bash
# MongoDB shell
docker compose exec mongodb mongosh jobspace_reviews_vault

# List collections
show collections

# Query users
db.users.find().pretty()
```

## Production Deployment

For production:

1. Change all secrets in `.env`
2. Use production MongoDB (Atlas, etc.)
3. Build frontend for production: `npm run build`
4. Use nginx to serve frontend static files
5. Set `NODE_ENV=production`
6. Enable SSL/TLS
7. Configure proper CORS origins
8. Set up monitoring and logging

## Security Notes

- JWT secrets must be 32+ characters in production
- Refresh tokens are hashed with bcrypt before storage
- Rate limiting on public endpoints
- File upload size limits enforced
- Helmet security headers enabled
- CORS properly configured
- No tokens/passwords in logs

## License

MIT

## Support

For issues or questions, please check the troubleshooting section above.
