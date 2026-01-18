# Quick Start Guide

## Get Running in 3 Steps

### 1. Setup Environment

```bash
cd jobspace-reviews-vault
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Start Everything

```bash
docker compose up --build
```

Wait 2-3 minutes for all services to start and seed data.

### 3. Open & Explore

**Admin Login:**
- URL: http://localhost:5173/admin/login
- Email: `admin@jobspace.local`
- Password: `Admin123!`

**Public Reviews Wall:**
- URL: http://localhost:5173/reviews/jobspace

## Complete Demo Flow

1. **Login** to admin panel with credentials above

2. **Get Submit Link:**
   - Go to "Collections" in admin
   - Copy the "Submit URL" (looks like http://localhost:5173/submit/abc123...)

3. **Submit a Review:**
   - Open the submit link in incognito/private window
   - Fill form:
     - Name, Role, Company (optional)
     - Rating (1-5 stars)
     - Testimonial text
     - Upload a video file (MP4/WebM)
     - Check consent
   - Submit

4. **Approve in Admin:**
   - Go to "Submissions" → "Pending"
   - Click "View" on your submission
   - Click "Approve"

5. **See on Public Wall:**
   - Visit http://localhost:5173/reviews/jobspace
   - Your video testimonial is live!
   - Click thumbnail to play video

## Key URLs

- **Frontend:** http://localhost:5173
- **Admin:** http://localhost:5173/admin
- **Public Wall:** http://localhost:5173/reviews/jobspace
- **Backend API:** http://localhost:3000/api
- **Submit Link:** Get from admin → Collections page

## Where to Find Things

**In Admin Panel:**
- **Dashboard:** Stats and charts
- **Collections:** Submit links and wall URLs
- **Submissions:** Moderate pending reviews
- **Settings:** Google Places API config

**Language Toggle:**
- Top right on public pages
- Switch between EN/עב (Hebrew)

## Troubleshooting

**Services not starting?**
```bash
docker compose down
docker compose up --build
```

**Need to reset data?**
```bash
docker compose down -v
docker compose up --build
```

**View logs:**
```bash
docker compose logs backend
docker compose logs frontend
```

That's it! Full documentation in README.md
