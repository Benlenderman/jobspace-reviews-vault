# 🚀 Deployment Guide - JobSpace Reviews Vault

## Prerequisites

- Docker & Docker Compose installed
- MongoDB Atlas account (free tier) OR MongoDB instance
- Domain name (optional but recommended)
- Server/VPS OR cloud platform account

---

## Option 1: Deploy to VPS (Digital Ocean, AWS EC2, etc.)

### Step 1: Prepare Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

### Step 2: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/jobspace-reviews-vault.git
cd jobspace-reviews-vault
```

### Step 3: Configure Environment

```bash
# Backend environment
cp backend/.env.example backend/.env
nano backend/.env
```

Update the following:
```env
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-super-secret-jwt-key-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-production
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
GOOGLE_PLACES_API_KEY=your-google-api-key (optional)
GOOGLE_PLACE_ID=your-google-place-id (optional)
```

```bash
# Frontend environment
cp frontend/.env.example frontend/.env
nano frontend/.env
```

Update:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Step 4: Build & Deploy

```bash
# Build and start containers
docker compose -f docker-compose.prod.yml up -d --build

# Run database seed
docker compose exec backend npm run seed

# Check logs
docker compose logs -f
```

### Step 5: Configure Nginx (Reverse Proxy)

```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/jobspace
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 210M;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:3000;
        client_max_body_size 210M;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jobspace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 2: Deploy to Railway.app (Easiest)

### Step 1: Push to GitHub

```bash
# Already done! Just push to your GitHub repo
```

### Step 2: Connect Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `jobspace-reviews-vault`

### Step 3: Configure Services

Railway will auto-detect Docker Compose. Configure:

**MongoDB Service:**
- Add MongoDB from Railway marketplace OR use MongoDB Atlas

**Backend Service:**
- Add environment variables from `backend/.env.example`
- Set `MONGODB_URI` to Railway MongoDB or Atlas
- Set `CORS_ORIGIN` to Railway frontend URL

**Frontend Service:**
- Add `VITE_API_URL` pointing to Railway backend URL

### Step 4: Deploy

Railway auto-deploys on push! 🎉

---

## Option 3: Deploy to Vercel + MongoDB Atlas

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variable in Vercel dashboard:
VITE_API_URL=your-backend-url
```

### Backend (Any Node.js host)

- Deploy backend to Heroku, Render, Railway, or Fly.io
- Connect to MongoDB Atlas
- Update CORS_ORIGIN to Vercel URL

---

## Post-Deployment Checklist

- [ ] Test video upload (max 200MB)
- [ ] Test admin login
- [ ] Configure Google Review URL in Settings
- [ ] Test discount code generation
- [ ] Test email notifications (if configured)
- [ ] Set up backups for MongoDB
- [ ] Configure monitoring (UptimeRobot, etc.)
- [ ] Update DNS records
- [ ] Test SSL certificate
- [ ] Verify CORS settings

---

## Environment Variables Reference

### Backend (.env)

```env
# Required
MONGODB_URI=mongodb://...
JWT_SECRET=random-secret-here
REFRESH_TOKEN_SECRET=another-random-secret
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# Optional
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
UPLOAD_DIR=./uploads
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Backup Strategy

### MongoDB Backup

```bash
# Create backup
docker compose exec mongodb mongodump --out=/backup

# Restore backup
docker compose exec mongodb mongorestore /backup
```

### Files Backup

```bash
# Backup uploads folder
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/
```

---

## Monitoring

### Health Check Endpoint

```bash
curl https://api.yourdomain.com/api/health
```

Should return:
```json
{"status":"ok"}
```

### Container Health

```bash
docker compose ps
docker compose logs --tail=100
```

---

## Scaling Tips

1. **MongoDB Atlas** - Use dedicated cluster for production
2. **CDN** - Serve uploads via CloudFlare or AWS CloudFront
3. **Redis** - Add Redis for session storage
4. **Load Balancer** - Add nginx or HAProxy for multiple instances
5. **Separate Storage** - Use S3/Wasabi for video storage

---

## Troubleshooting

### Issue: 413 Payload Too Large

Solution: Increase client_max_body_size in nginx

### Issue: CORS errors

Solution: Update CORS_ORIGIN in backend/.env

### Issue: Videos not playing

Solution: Check uploads directory permissions

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backup automation
- [ ] Rate limiting configured
- [ ] File upload validation

---

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Review documentation in README.md
- Check GitHub issues

---

**🎉 Your JobSpace Reviews Vault is ready for production!**
