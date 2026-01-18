# Pre-Launch Checklist

Use this checklist before deploying to production or demoing the application.

## ✅ Initial Setup

- [ ] Docker and Docker Compose installed
- [ ] Ports 3000, 5173, 27017 available
- [ ] At least 8GB RAM available
- [ ] `backend/.env` file created (from `.env.example`)
- [ ] `frontend/.env` file created (from `.env.example`)

## ✅ First Run

- [ ] Run `./start.sh` or `docker compose up --build`
- [ ] Wait for services to start (2-3 minutes)
- [ ] Check logs for errors: `docker compose logs`
- [ ] Verify backend is running: http://localhost:3000/api/health
- [ ] Verify frontend is running: http://localhost:5173
- [ ] Verify seed script ran successfully (check backend logs for "Seeding complete")

## ✅ Admin Panel

- [ ] Can access admin login: http://localhost:5173/admin/login
- [ ] Can login with: `admin@jobspace.local` / `Admin123!`
- [ ] Dashboard loads with stats cards
- [ ] Chart renders (Recharts)
- [ ] Collections page shows default collection
- [ ] Collections page shows Submit URL and Wall URL
- [ ] Submissions page loads (empty or with data)
- [ ] Settings page loads
- [ ] Can logout successfully

## ✅ Public Pages

- [ ] Reviews wall loads: http://localhost:5173/reviews/jobspace
- [ ] Hero section displays correctly
- [ ] Stats cards show numbers
- [ ] Mock Google reviews display (5 reviews)
- [ ] Language toggle works (EN ↔ HE)
- [ ] RTL layout renders correctly in Hebrew
- [ ] Footer displays

## ✅ Submit Flow (End-to-End)

- [ ] Copy submit URL from Collections page
- [ ] Open submit URL in new incognito window
- [ ] Submit form loads correctly
- [ ] Fill all required fields:
  - [ ] Name
  - [ ] Role
  - [ ] Rating (click stars)
  - [ ] Text testimonial
  - [ ] Upload video file (MP4/WebM)
  - [ ] Check consent
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Check admin submissions page - new submission appears with "pending" status

## ✅ Moderation Flow

- [ ] Login to admin
- [ ] Go to Submissions → Pending
- [ ] See the submission you just created
- [ ] Click "View" button
- [ ] Modal opens with:
  - [ ] Name, role, company
  - [ ] Rating stars
  - [ ] Text testimonial
  - [ ] Video player with controls
- [ ] Video plays correctly
- [ ] Click "Approve" button
- [ ] Modal closes
- [ ] Submission moves to "Approved" status

## ✅ Public Wall Display

- [ ] Return to: http://localhost:5173/reviews/jobspace
- [ ] Refresh page
- [ ] Your approved video testimonial appears in grid
- [ ] Thumbnail displays (may take 10-30 sec to generate)
- [ ] Click thumbnail
- [ ] Video modal opens
- [ ] Video plays
- [ ] Close modal with X button

## ✅ Video Processing

- [ ] Check backend logs: `docker compose logs backend | grep thumbnail`
- [ ] Verify Agenda job ran
- [ ] Verify thumbnail.jpg created in uploads folder
- [ ] Thumbnail displays on public wall
- [ ] Thumbnail has correct aspect ratio (16:9)

## ✅ Google Reviews

- [ ] Mock reviews display on public wall (if no API key)
- [ ] 5 mock reviews visible
- [ ] Each shows: author name, rating, text, date
- [ ] OR if API key configured:
  - [ ] Real reviews fetch successfully
  - [ ] Reviews display correctly
  - [ ] Profile photos display (if available)

## ✅ Internationalization (i18n)

- [ ] English strings load correctly
- [ ] Hebrew strings load correctly
- [ ] Language persists after page refresh
- [ ] RTL layout works in Hebrew:
  - [ ] Text aligns right
  - [ ] Layout mirrors correctly
  - [ ] Navigation reverses
  - [ ] Forms align properly

## ✅ Security

- [ ] Admin routes redirect to login if not authenticated
- [ ] Logout clears tokens and redirects
- [ ] Expired access token triggers refresh (test by waiting 15+ min)
- [ ] Invalid token returns 401
- [ ] Public submit endpoint validates file types
- [ ] File size limit enforced (max 200MB)
- [ ] Rate limiting works (try 100+ requests in 15min)
- [ ] CORS blocks requests from unauthorized origins

## ✅ Error Handling

- [ ] Login with wrong password shows error
- [ ] Login with non-existent email shows error
- [ ] Submit without required fields shows validation error
- [ ] Upload wrong file type shows error message
- [ ] Network error shows user-friendly message
- [ ] 404 page for invalid routes (optional)

## ✅ Database

- [ ] MongoDB container running
- [ ] Can access MongoDB: `docker compose exec mongodb mongosh jobspace_reviews_vault`
- [ ] Collections exist: `show collections`
- [ ] Seeded data present:
  - [ ] 1 admin user: `db.users.find().pretty()`
  - [ ] 1 collection: `db.reviewcollections.find().pretty()`
  - [ ] 5 Google reviews: `db.googlereviews.find().count()`
- [ ] Data persists after `docker compose down` and `docker compose up`

## ✅ File Storage

- [ ] Uploads folder exists in backend container
- [ ] Video files saved in `/app/uploads/{submissionId}/`
- [ ] Thumbnails generated in same directory
- [ ] Files accessible via: http://localhost:3000/uploads/{submissionId}/video.mp4
- [ ] Thumbnails accessible via: http://localhost:3000/uploads/{submissionId}/thumbnail.jpg
- [ ] Files persist in Docker volume

## ✅ Background Jobs (Agenda)

- [ ] Agenda starts successfully (check backend logs)
- [ ] `generate-thumbnail` job defined
- [ ] `sync-google-reviews` job defined
- [ ] Jobs execute on video upload
- [ ] Jobs execute on schedule (6 hours for sync)
- [ ] Job failures logged
- [ ] Jobs collection in MongoDB: `db.agendaJobs.find().pretty()`

## ✅ Performance

- [ ] Frontend loads in < 3 seconds
- [ ] Backend API responds in < 500ms
- [ ] Public wall loads with 50 submissions in < 2 seconds
- [ ] Video upload completes successfully
- [ ] Thumbnail generation completes in < 30 seconds
- [ ] No memory leaks (monitor Docker stats)

## ✅ Mobile Responsiveness

- [ ] Test on mobile device or Chrome DevTools
- [ ] Public wall:
  - [ ] Hero section stacks vertically
  - [ ] Stats cards stack in single column
  - [ ] Video grid adjusts to single column
  - [ ] Reviews readable on small screen
- [ ] Submit form:
  - [ ] Form fields full width
  - [ ] File upload button accessible
  - [ ] Submit button accessible
- [ ] Admin panel:
  - [ ] Navigation collapses or scrolls
  - [ ] Tables scroll horizontally if needed
  - [ ] Modals fit screen

## ✅ Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## ✅ Documentation

- [ ] README.md is accurate and complete
- [ ] QUICKSTART.md matches actual startup process
- [ ] SUMMARY.md covers all features
- [ ] ARCHITECTURE.md explains system design
- [ ] Environment variables documented in .env.example
- [ ] API endpoints documented

## ✅ Cleanup & Reset

- [ ] `./stop.sh` stops all services
- [ ] `docker compose down` cleans up containers
- [ ] `./reset.sh` prompts for confirmation
- [ ] Reset removes all data (volumes)
- [ ] Fresh start works after reset
- [ ] Seed script runs again after reset

## 🚀 Production Readiness (Before Deploy)

- [ ] Change all secrets in `.env`
- [ ] Use production MongoDB (Atlas, etc.)
- [ ] Configure real Google Places API key (optional)
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable SSL/TLS certificates
- [ ] Set up domain and DNS
- [ ] Configure CDN for static assets (optional)
- [ ] Set up monitoring (logs, metrics, errors)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Load test the application
- [ ] Pen test security
- [ ] Review and update rate limits
- [ ] Set up alerts for errors/downtime

## 📊 Load Testing (Optional)

- [ ] Test 100 concurrent users on public wall
- [ ] Test 50 concurrent video uploads
- [ ] Test admin panel under load
- [ ] Monitor MongoDB performance
- [ ] Monitor memory usage
- [ ] Monitor CPU usage
- [ ] Identify bottlenecks
- [ ] Optimize as needed

## 🔐 Security Audit (Before Production)

- [ ] Run `npm audit` in backend and frontend
- [ ] Update dependencies with vulnerabilities
- [ ] Review JWT expiration times
- [ ] Verify password hashing strength
- [ ] Test for SQL injection (not applicable, but good practice)
- [ ] Test for XSS vulnerabilities
- [ ] Test for CSRF (rate limiting helps)
- [ ] Verify file upload restrictions
- [ ] Review CORS configuration
- [ ] Enable HTTPS only in production
- [ ] Review error messages (no sensitive data leaked)

---

## Quick Commands for Testing

```bash
# Start
./start.sh

# View all logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Check MongoDB
docker compose exec mongodb mongosh jobspace_reviews_vault

# Re-seed database
docker compose exec backend npm run seed

# Stop
./stop.sh

# Full reset
./reset.sh
```

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Services won't start | `docker compose down && docker compose up --build` |
| Port already in use | `lsof -i :3000` or `lsof -i :5173` |
| Seed data missing | `docker compose exec backend npm run seed` |
| Thumbnail not generated | Check backend logs for ffmpeg errors |
| Login fails | Check backend logs, verify seeded admin user |
| Video upload fails | Check file size (max 200MB) and type (mp4/webm/mov) |

---

## Sign-Off

Date: _____________

Tested by: _____________

Environment: [ ] Development  [ ] Staging  [ ] Production

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

All checks passed: [ ] YES  [ ] NO

Ready to deploy: [ ] YES  [ ] NO
