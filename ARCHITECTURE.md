# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSERS                            │
└────────────┬──────────────────────────────────┬─────────────────┘
             │                                  │
             │ Public                           │ Admin
             │ (Anonymous)                      │ (Authenticated)
             │                                  │
             ▼                                  ▼
┌────────────────────────┐         ┌────────────────────────────┐
│   PUBLIC PAGES         │         │      ADMIN PANEL           │
│                        │         │                            │
│  • /reviews/:slug      │         │  • /admin/login            │
│  • /submit/:token      │         │  • /admin/dashboard        │
│                        │         │  • /admin/submissions      │
│  Features:             │         │  • /admin/collections      │
│  - View reviews        │         │  - Moderate submissions    │
│  - Submit testimonial  │         │  - Manage collections      │
│  - Watch videos        │         │  - View analytics          │
│  - i18n (EN/HE + RTL) │         │  - Configure settings      │
└────────────┬───────────┘         └──────────────┬─────────────┘
             │                                    │
             └────────────────┬───────────────────┘
                              │
                              │ HTTP/REST API
                              │
                              ▼
                    ┌─────────────────────┐
                    │   FASTIFY BACKEND   │
                    │   (Node.js 20)      │
                    │                     │
                    │  • JWT Auth         │
                    │  • File Upload      │
                    │  • Rate Limiting    │
                    │  • Security Headers │
                    └──────────┬──────────┘
                              │
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │   MONGODB    │   │   AGENDA     │   │  FILE        │
   │              │   │   (Jobs)     │   │  STORAGE     │
   │ • Users      │   │              │   │              │
   │ • Collections│   │ • Thumbnail  │   │ /uploads/    │
   │ • Submissions│   │ • Google Sync│   │  ├─ {id}/   │
   │ • Reviews    │   │              │   │  │  ├─video  │
   │ • Settings   │   │              │   │  │  └─thumb  │
   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Request Flow

### Public Testimonial Submission

```
1. User Opens Submit Link
   /submit/:publicToken

   ↓

2. Frontend Validates Collection
   GET /api/public/wall/:slug (to check if active)

   ↓

3. User Fills Form + Uploads Video
   - Name, Role, Company
   - Rating (1-5)
   - Text testimonial
   - Video file (multipart/form-data)
   - Consent checkbox

   ↓

4. Frontend Submits
   POST /api/public/submit/:publicToken
   - multipart/form-data
   - Max 200MB

   ↓

5. Backend Processes
   a) Validate collection (active?)
   b) Validate file type (mp4/webm/mov)
   c) Create ReviewSubmission (status: pending)
   d) Save video to /uploads/{submissionId}/
   e) Schedule thumbnail job

   ↓

6. Agenda Job Runs (Background)
   - ffmpeg generates thumbnail at 2 sec
   - Saves as thumbnail.jpg
   - Updates ReviewSubmission record

   ↓

7. Success Response
   { success: true, submissionId: "..." }
```

### Admin Approval Flow

```
1. Admin Logs In
   POST /api/auth/login
   { email, password }

   ↓

2. Backend Validates
   - Find user by email
   - Verify password (bcrypt)
   - Generate JWT access token (15min)
   - Generate JWT refresh token (7d)
   - Hash refresh token → store in DB

   ↓

3. Frontend Stores Tokens
   - localStorage (Zustand persist)
   - Sets auth state

   ↓

4. Admin Views Submissions
   GET /api/submissions?status=pending
   Headers: Authorization: Bearer {accessToken}

   ↓

5. Admin Clicks "View"
   GET /api/submissions/:id
   - Full details
   - Video URL

   ↓

6. Admin Clicks "Approve"
   PATCH /api/submissions/:id/approve

   ↓

7. Backend Updates
   - submission.status = 'approved'
   - Save to MongoDB

   ↓

8. Public Wall Refreshes
   GET /api/public/wall/:slug
   - Returns approved submissions
   - User's video now visible!
```

### Google Reviews Sync

```
1. Agenda Scheduler
   - Every 6 hours (if API key present)
   - OR manual trigger from admin

   ↓

2. Check Configuration
   - GOOGLE_PLACES_API_KEY exists?
   - GOOGLE_PLACE_ID exists?

   ↓

3a. If API Key Present:
    - Fetch from Google Places API
    - Parse reviews
    - Upsert to GoogleReview collection

3b. If No API Key:
    - Use mock data (5 seeded reviews)
    - Insert/update mock reviews

   ↓

4. Public Wall Shows Reviews
   GET /api/public/wall/:slug
   - Returns approvedSubmissions + googleReviews
```

---

## Data Models Relationships

```
┌──────────────┐
│     User     │
│              │
│  • email     │
│  • password  │
│  • role      │
└──────┬───────┘
       │
       │ createdBy
       │
       ▼
┌───────────────────┐
│ ReviewCollection  │
│                   │
│  • title          │
│  • slug           │
│  • publicToken    │◄────────┐
│  • isActive       │         │
└──────┬────────────┘         │
       │                      │
       │ collectionId         │ Used for public
       │                      │ submit & wall
       ▼                      │
┌───────────────────┐         │
│ ReviewSubmission  │         │
│                   │         │
│  • personName     │         │
│  • personRole     │         │
│  • rating         │         │
│  • text           │         │
│  • video { }      │         │
│  • status         │         │
│  • consent        │         │
└───────────────────┘         │
                              │
┌───────────────────┐         │
│  GoogleReview     │         │
│                   │         │
│  • placeId        │         │
│  • authorName     │         │
│  • rating         │         │
│  • text           │         │
│  • time           │         │
└───────────────────┘         │
                              │
┌───────────────────┐         │
│     Settings      │         │
│                   │         │
│  • key: placeId   │─────────┘
│  • key: syncEnabled
└───────────────────┘
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    LOGIN REQUEST                         │
│  POST /api/auth/login                                    │
│  Body: { email, password }                               │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────────┐
                 │  Find User by     │
                 │  Email in MongoDB │
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Verify Password  │
                 │  (bcrypt.compare) │
                 └────────┬──────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Generate JWT Tokens        │
            │                             │
            │  accessToken = jwt.sign(    │
            │    { userId },              │
            │    JWT_SECRET,              │
            │    { expiresIn: '15m' }     │
            │  )                          │
            │                             │
            │  refreshToken = jwt.sign(   │
            │    { userId, type: 'refresh' },│
            │    JWT_REFRESH_SECRET,      │
            │    { expiresIn: '7d' }      │
            │  )                          │
            └─────────────┬───────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Hash Refresh Token         │
            │  bcrypt.hash(refreshToken)  │
            │  Save to user.refreshTokenHash│
            └─────────────┬───────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Return to Client           │
            │  {                          │
            │    accessToken,             │
            │    refreshToken,            │
            │    user: { ... }            │
            │  }                          │
            └─────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Client Stores in           │
            │  localStorage (Zustand)     │
            └─────────────────────────────┘


┌──────────────────────────────────────────────────────────┐
│              AUTHENTICATED REQUEST                        │
│  GET /api/submissions                                    │
│  Headers: Authorization: Bearer {accessToken}            │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────────┐
                 │  Fastify JWT      │
                 │  Verify Middleware│
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  jwt.verify()     │
                 │  Extract userId   │
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Find User by ID  │
                 │  in MongoDB       │
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Attach user to   │
                 │  request.user     │
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Route Handler    │
                 │  Executes         │
                 └───────────────────┘


┌──────────────────────────────────────────────────────────┐
│              TOKEN REFRESH                                │
│  POST /api/auth/refresh                                  │
│  Body: { refreshToken }                                  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────────┐
                 │  Verify Refresh   │
                 │  Token (jwt.verify)│
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Check type=refresh│
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Find User + Hash │
                 └────────┬──────────┘
                          │
                          ▼
                 ┌───────────────────┐
                 │  Verify Hash      │
                 │  (bcrypt.compare) │
                 └────────┬──────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Generate New Access Token  │
            │  (15min expiry)             │
            └─────────────┬───────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Return { accessToken }     │
            └─────────────────────────────┘
```

---

## File Storage Architecture

```
/app/uploads/  (Backend Container Volume)
│
├── {submissionId-1}/
│   ├── video.mp4              ← Original upload
│   └── thumbnail.jpg          ← Generated by ffmpeg
│
├── {submissionId-2}/
│   ├── video.webm
│   └── thumbnail.jpg
│
└── {submissionId-3}/
    ├── video.mov
    └── thumbnail.jpg


Database Record (ReviewSubmission):
{
  video: {
    originalFilename: "my-video.mp4",
    mimeType: "video/mp4",
    sizeBytes: 15728640,
    storagePath: "{submissionId}/video.mp4",
    thumbnailPath: "{submissionId}/thumbnail.jpg"
  }
}


Access URLs:
- Video:     http://localhost:3000/uploads/{submissionId}/video.mp4
- Thumbnail: http://localhost:3000/uploads/{submissionId}/thumbnail.jpg

Served by: @fastify/static plugin
```

---

## Background Jobs (Agenda)

```
┌─────────────────────────────────────────────────────────┐
│                  AGENDA SCHEDULER                        │
│                  (MongoDB-backed)                        │
└───────────┬─────────────────────────────────┬───────────┘
            │                                 │
            │ On Video Upload                 │ Every 6 hours
            │                                 │ (if API key)
            ▼                                 ▼
┌───────────────────────┐       ┌────────────────────────┐
│  generate-thumbnail   │       │  sync-google-reviews   │
│                       │       │                        │
│  Input:               │       │  Input: (none)         │
│  - submissionId       │       │                        │
│                       │       │  Process:              │
│  Process:             │       │  1. Check API key      │
│  1. Get submission    │       │  2. Fetch from Google  │
│  2. Get video path    │       │     OR use mocks       │
│  3. Run ffmpeg:       │       │  3. Upsert to DB       │
│     - Extract frame   │       │                        │
│       at 00:00:02     │       │  Output:               │
│     - Resize 640x360  │       │  - Google reviews      │
│     - Save as JPG     │       │    in database         │
│  4. Update submission │       │                        │
│     with thumb path   │       │                        │
│                       │       │                        │
│  Output:              │       │                        │
│  - thumbnail.jpg file │       │                        │
│  - DB record updated  │       │                        │
└───────────────────────┘       └────────────────────────┘


Agenda Configuration:
- processEvery: 30 seconds
- maxConcurrency: 5
- Collection: agendaJobs (MongoDB)
```

---

## Docker Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  DOCKER COMPOSE                           │
│                  (Orchestration)                          │
└────────┬──────────────────┬──────────────────┬───────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   mongodb       │ │   backend       │ │   frontend      │
│                 │ │                 │ │                 │
│  Image:         │ │  Build:         │ │  Build:         │
│  mongo:7        │ │  ./backend/     │ │  ./frontend/    │
│                 │ │  Dockerfile     │ │  Dockerfile.dev │
│  Port:          │ │                 │ │                 │
│  27017:27017    │ │  Port:          │ │  Port:          │
│                 │ │  3000:3000      │ │  5173:5173      │
│  Volume:        │ │                 │ │                 │
│  mongodb_data   │ │  Volumes:       │ │  Volumes:       │
│                 │ │  - uploads_data │ │  - ./src (dev)  │
│                 │ │                 │ │                 │
│  Network:       │ │  Depends On:    │ │  Depends On:    │
│  jobspace-network│ │  - mongodb     │ │  - backend      │
│                 │ │                 │ │                 │
│                 │ │  Network:       │ │  Network:       │
│                 │ │  jobspace-network│ │  jobspace-network│
└─────────────────┘ └─────────────────┘ └─────────────────┘


Volumes:
┌─────────────────┐
│  mongodb_data   │  Persists database
└─────────────────┘

┌─────────────────┐
│  uploads_data   │  Persists uploaded videos/thumbnails
└─────────────────┘


Network (jobspace-network):
- Bridge driver
- Internal DNS:
  - mongodb → mongodb:27017
  - backend → backend:3000
  - frontend → frontend:5173
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    INCOMING REQUEST                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  @fastify/cors  │  Check origin
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ @fastify/helmet │  Security headers
                └────────┬────────┘
                         │
                         ▼
             ┌──────────────────────┐
             │ @fastify/rate-limit  │  100 req/15min
             └────────┬─────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │  Route: Public or Admin?│
            └────────┬────────┬───────┘
                     │        │
        Public       │        │        Admin
                     │        │
                     ▼        ▼
            ┌───────────┐  ┌─────────────────┐
            │  Public   │  │  JWT Verify     │
            │  (No auth)│  │  (authenticate) │
            └─────┬─────┘  └────────┬────────┘
                  │                 │
                  │                 ▼
                  │        ┌─────────────────┐
                  │        │  Valid JWT?     │
                  │        │  User exists?   │
                  │        └────────┬────────┘
                  │                 │
                  ▼                 ▼
            ┌──────────────────────────┐
            │     Route Handler        │
            └──────────┬───────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Input Validation    │
            │  (Zod schemas)       │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Business Logic      │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Response            │
            └──────────────────────┘


Password Security:
- Hashing: bcrypt with 10 rounds
- Never stored plain text
- Never logged
- Compared with bcrypt.compare()

Token Security:
- JWT signed with secrets
- Access token: 15min expiry
- Refresh token: 7d expiry, hashed in DB
- Never logged
- Invalidated on logout

File Upload Security:
- Type validation (mp4/webm/mov only)
- Size limit (200MB)
- Stored outside web root
- Served through controlled endpoint
```

---

## Frontend State Management

```
┌─────────────────────────────────────────────────────────┐
│                  REACT COMPONENT TREE                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │       <App />        │
              │  (Router + Providers)│
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐           ┌──────────────────┐
│  PUBLIC ROUTES   │           │  ADMIN ROUTES    │
│                  │           │  (Protected)     │
│  - ReviewsWall   │           │                  │
│  - SubmitReview  │           │  - Dashboard     │
│                  │           │  - Submissions   │
│                  │           │  - Collections   │
│                  │           │  - Settings      │
└──────────────────┘           └──────────────────┘
         │                              │
         │                              │
         └──────────┬───────────────────┘
                    │
                    │ Uses
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌──────────────────┐    ┌────────────────────┐
│  ZUSTAND STORE   │    │  TANSTACK QUERY    │
│  (Local State)   │    │  (Server State)    │
│                  │    │                    │
│  authStore:      │    │  queries:          │
│  - user          │    │  - ['wall', slug]  │
│  - accessToken   │    │  - ['submissions'] │
│  - refreshToken  │    │  - ['stats']       │
│  - setAuth()     │    │  - ['collections'] │
│  - logout()      │    │  - ['settings']    │
│                  │    │                    │
│  Persisted:      │    │  mutations:        │
│  localStorage    │    │  - submitReview    │
│                  │    │  - approveSubmission│
│                  │    │  - login           │
└──────────────────┘    └────────────────────┘
         │                       │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
            ┌────────────────────┐
            │   API CLIENT       │
            │  (fetch wrapper)   │
            │                    │
            │  - Auto JWT header │
            │  - Error handling  │
            │  - Refresh on 401  │
            └────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  BACKEND API       │
            └────────────────────┘


i18n (react-i18next):
┌──────────────────────┐
│  i18n Instance       │
│                      │
│  languages:          │
│  - en (English)      │
│  - he (Hebrew)       │
│                      │
│  resources:          │
│  - locales/en.json   │
│  - locales/he.json   │
│                      │
│  On language change: │
│  → Update dir="rtl"  │
│  → Re-render UI      │
└──────────────────────┘
```

---

## Deployment Architecture (Production)

```
                     ┌────────────────────┐
                     │   CLOUDFLARE CDN   │
                     │   (SSL/TLS)        │
                     └──────────┬─────────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │   NGINX REVERSE    │
                     │   PROXY            │
                     │                    │
                     │  /     → Frontend  │
                     │  /api  → Backend   │
                     └──────────┬─────────┘
                                │
                ┌───────────────┼───────────────┐
                │                               │
                ▼                               ▼
    ┌────────────────────┐          ┌────────────────────┐
    │   FRONTEND         │          │   BACKEND          │
    │   (Static Build)   │          │   (Node.js PM2)    │
    │                    │          │                    │
    │  - Built assets    │          │  - Fastify server  │
    │  - Served by nginx │          │  - Agenda jobs     │
    │  - Gzipped         │          │  - Health checks   │
    └────────────────────┘          └──────────┬─────────┘
                                               │
                                               │
                              ┌────────────────┼──────────────┐
                              │                               │
                              ▼                               ▼
                  ┌────────────────────┐          ┌────────────────────┐
                  │  MONGODB ATLAS     │          │  S3 / OBJECT       │
                  │  (Production DB)   │          │  STORAGE           │
                  │                    │          │  (Videos/Thumbs)   │
                  │  - Replica set     │          │                    │
                  │  - Backups         │          │  - CDN delivery    │
                  │  - Monitoring      │          │  - Lifecycle rules │
                  └────────────────────┘          └────────────────────┘


Monitoring:
- Logging: Winston → Elasticsearch → Kibana
- Metrics: Prometheus → Grafana
- Errors: Sentry
- Uptime: UptimeRobot

Security:
- SSL/TLS certificates (Let's Encrypt)
- Environment variables (not in repo)
- Secrets management (AWS Secrets Manager)
- Regular security updates
- Database access IP whitelist
```

---

## Technology Decisions

### Why Fastify?
✅ Fastest Node.js framework
✅ Schema-based validation
✅ Plugin architecture
✅ TypeScript support
✅ Excellent documentation

### Why MongoDB?
✅ Flexible schema (video metadata varies)
✅ Fast reads for public wall
✅ Great aggregation (stats/charts)
✅ Agenda.js integration
✅ Atlas for production

### Why Agenda?
✅ Mongo-backed (no extra infrastructure)
✅ Job persistence
✅ Retries
✅ Cron-like scheduling
✅ Simple API

### Why TanStack Query?
✅ Automatic caching
✅ Background refetching
✅ Optimistic updates
✅ Loading/error states
✅ Industry standard

### Why Zustand?
✅ Minimal boilerplate
✅ No provider hell
✅ Persist middleware
✅ TypeScript support
✅ Lightweight (1KB)

### Why Tailwind?
✅ Utility-first (fast development)
✅ RTL support built-in
✅ Responsive by default
✅ JIT compiler
✅ No CSS files to manage

---

This architecture supports:
- ✅ Horizontal scaling (add more backend containers)
- ✅ High availability (MongoDB replica sets)
- ✅ CDN delivery (static frontend + videos)
- ✅ Background processing (Agenda jobs)
- ✅ Security best practices
- ✅ Monitoring and observability
