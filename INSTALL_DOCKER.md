# Install Docker Desktop for Mac

## Quick Install

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Mac"
   - Choose your Mac chip:
     - Apple Silicon (M1/M2/M3): Download "Mac with Apple chip"
     - Intel: Download "Mac with Intel chip"

2. **Install:**
   - Open the downloaded `.dmg` file
   - Drag Docker.app to Applications folder
   - Open Docker from Applications
   - Follow the setup wizard
   - Grant permissions when asked

3. **Verify Installation:**
   ```bash
   docker --version
   docker compose version
   ```

## After Docker is Running

1. **Navigate to project:**
   ```bash
   cd /Users/benlenderman/jobspace-reviews-vault
   ```

2. **Start the project:**
   ```bash
   ./start.sh
   ```

   Or:
   ```bash
   docker compose up --build
   ```

3. **Wait 2-3 minutes** for all services to start

4. **Open browser:**
   - http://localhost:5173 (Frontend)
   - http://localhost:5173/admin (Admin Panel)

## Login Credentials

```
Email: admin@jobspace.local
Password: Admin123!
```

---

## Troubleshooting

### "Docker daemon not running"
- Make sure Docker Desktop is open and running (check menu bar)
- Wait for Docker Desktop to fully start (whale icon should be static, not animated)

### "Port already in use"
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5173
lsof -i :27017

# Stop other services using those ports
```

### "Permission denied"
```bash
# Make sure scripts are executable
chmod +x start.sh stop.sh reset.sh
```

---

## Alternative: Manual Run Without Docker

If you prefer not to use Docker, you can run manually:

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Install MongoDB separately
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

But Docker is **strongly recommended** as it handles everything automatically!
