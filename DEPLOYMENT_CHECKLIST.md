# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Completed

- [x] Cloudinary direct upload integration (videos don't pass through backend)
- [x] 4-minute video duration validation (240 seconds max)
- [x] Hardcoded secrets removed from all configs
- [x] Environment variables enforced for all sensitive data
- [x] Production build scripts added and tested
- [x] Backend build: ✅ Success
- [x] Frontend build: ✅ Success
- [x] All changes committed to git

---

## 📋 Deployment Steps

### **Option 1: Vercel (Frontend) + Railway (Backend)** ⭐ RECOMMENDED

This is the deployment strategy configured in this project.

---

## 🎨 Frontend Deployment (Vercel)

### Prerequisites

1. **Get Cloudinary Credentials**
   - Go to: https://console.cloudinary.com/
   - Sign up or log in
   - From Dashboard, copy:
     - Cloud Name
     - API Key
     - API Secret
   - Create an Upload Preset:
     - Go to Settings → Upload
     - Scroll to "Upload presets"
     - Click "Add upload preset"
     - Name it: `jobspace-reviews`
     - Set "Signing Mode" to "Unsigned"
     - Set "Folder" to `reviews`
     - Save

### Deploy to Vercel

1. **Push to GitHub** (if not done)
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select: `Benlenderman/jobspace-reviews-vault`
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `frontend`

3. **Configure Environment Variables**

   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://your-backend-url.railway.app/api` |
   | `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | `jobspace-reviews` |

   **⚠️ Important:** You'll need to update `VITE_API_URL` after deploying the backend.

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - You'll get a URL like: `https://jobspace-reviews-vault.vercel.app`

---

## 🖥️ Backend Deployment (Railway)

### Prerequisites

- MongoDB Atlas account (Railway MongoDB is paid)

### Set up MongoDB Atlas

1. **Create Free Cluster**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier
   - Create a cluster (M0 - Free tier)
   - Wait ~5 minutes for cluster creation

2. **Create Database User**
   - Click "Database Access"
   - Add New User
   - Username: `jobspace_user`
   - Password: Generate strong password (save it!)
   - User Privileges: "Atlas admin"

3. **Whitelist IP**
   - Click "Network Access"
   - Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Railway to connect

4. **Get Connection String**
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Should look like: `mongodb+srv://jobspace_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jobspace_reviews_vault?retryWrites=true&w=majority`

### Generate Production Secrets

Run these commands to generate secure secrets:

```bash
# JWT Secret (64 characters)
openssl rand -hex 32

# JWT Refresh Secret (64 characters)
openssl rand -hex 32

# Encryption Key (64 characters)
openssl rand -hex 32
```

Save these outputs! You'll need them for Railway.

### Deploy to Railway

1. **Login to Railway**
   - Go to: https://railway.app/
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `Benlenderman/jobspace-reviews-vault`
   - Railway will detect the Dockerfile

3. **Configure Service**
   - Click on the service → "Variables"
   - Add these environment variables:

   | Variable | Value | Example |
   |----------|-------|---------|
   | `NODE_ENV` | `production` | production |
   | `PORT` | `3000` | 3000 |
   | `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@...` |
   | `JWT_SECRET` | Output from `openssl rand -hex 32` | 64-char hex string |
   | `JWT_REFRESH_SECRET` | Output from `openssl rand -hex 32` | 64-char hex string |
   | `ENCRYPTION_KEY` | Output from `openssl rand -hex 32` | 64-char hex string |
   | `CORS_ORIGIN` | Your Vercel frontend URL | `https://jobspace-reviews-vault.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | your-cloud-name |
   | `CLOUDINARY_API_KEY` | From Cloudinary dashboard | 123456789012345 |
   | `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | abcdef123456... |
   | `CLOUDINARY_UPLOAD_PRESET` | `jobspace-reviews` | jobspace-reviews |

4. **Deploy**
   - Click "Deploy"
   - Wait ~5 minutes for build + deploy
   - You'll get a URL like: `https://jobspace-reviews-vault-production.up.railway.app`

5. **Update Frontend**
   - Go back to Vercel project settings
   - Update `VITE_API_URL` to: `https://YOUR-RAILWAY-URL.railway.app/api`
   - Redeploy frontend

---

## 🧪 Testing Deployment

### Test Backend

1. Health check:
   ```bash
   curl https://YOUR-RAILWAY-URL.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

### Test Frontend

1. Visit your Vercel URL
2. Check browser console for errors
3. Try creating a review collection (admin panel)
4. Test video upload on submission page

### Test Cloudinary Integration

1. Go to submission page
2. Click "Upload Video"
3. Upload a short test video (< 4 minutes)
4. Verify upload succeeds
5. Check Cloudinary dashboard for uploaded video

---

## 📊 Post-Deployment Monitoring

### Railway Dashboard
- Monitor CPU/Memory usage
- Check deployment logs
- Set up alerts for failures

### Vercel Dashboard
- Monitor build times
- Check analytics
- Review error logs

### Cloudinary Dashboard
- Monitor storage usage
- Check bandwidth
- Review transformation credits

---

## 🔒 Security Checklist

- [ ] All environment variables set correctly
- [ ] No secrets in git repository
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS_ORIGIN set to exact frontend URL (no wildcards in production)
- [ ] Cloudinary upload preset is unsigned (for direct uploads)
- [ ] JWT secrets are strong (64+ characters)
- [ ] HTTPS enforced on both frontend and backend

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel env vars
- Verify CORS_ORIGIN in Railway matches Vercel URL exactly
- Check Railway backend is running (health endpoint)

### Video uploads failing
- Verify all Cloudinary env vars are set correctly
- Check upload preset exists and is "unsigned"
- Check browser console for Cloudinary errors
- Verify Cloudinary quota not exceeded

### MongoDB connection errors
- Verify connection string format
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify database user credentials
- Check if cluster is running

### Backend crashes on startup
- Check Railway logs for error messages
- Verify all required env vars are set
- Check MongoDB connection
- Ensure ffmpeg is installed (Dockerfile handles this)

---

## 💰 Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Vercel** | 100 GB bandwidth/month | $20/month for Pro |
| **Railway** | $5 credit/month (trial) | ~$5-10/month for small app |
| **MongoDB Atlas** | 512 MB storage (M0 free) | $9/month for M2 |
| **Cloudinary** | 25 GB storage, 25 GB bandwidth | $99/month for Plus |

**Total Free Tier:** $0/month (with limitations)
**Total Paid:** ~$25-40/month for comfortable limits

---

## 🎉 Success Criteria

✅ Frontend loads at Vercel URL
✅ Backend API responds at Railway URL
✅ Admin can login and create collections
✅ Public can submit videos via Cloudinary
✅ Videos are stored in Cloudinary (not backend)
✅ Videos over 4 minutes are rejected
✅ Review wall displays approved submissions
✅ No console errors in browser

---

## 📞 Support

If you encounter issues:

1. Check Railway logs: `railway logs`
2. Check Vercel deployment logs
3. Review Cloudinary dashboard for upload errors
4. Check MongoDB Atlas connection status

---

**Generated:** 2026-01-19
**Version:** 1.0.0
**Tech Stack:** React (Vite) + Fastify + MongoDB + Cloudinary
