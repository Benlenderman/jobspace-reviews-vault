# 🎥 JobSpace Reviews Vault

<div align="center">

![GitHub](https://img.shields.io/github/license/Benlenderman/jobspace-reviews-vault)
![GitHub last commit](https://img.shields.io/github/last-commit/Benlenderman/jobspace-reviews-vault)
![GitHub repo size](https://img.shields.io/github/repo-size/Benlenderman/jobspace-reviews-vault)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Node](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)

**Full-stack video testimonials platform with automated discount codes**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🎯 Features](#-features) • [🔧 Tech Stack](#-tech-stack)

</div>

---

## 🎯 Features

### Public Features
- 🎥 **Video Testimonial Submission** - Upload videos up to 200MB
- 💰 **Automated Discount Codes** - 20% for video, 10% for Google reviews
- 🎁 **Incentive Landing Page** - Dual submission options with rewards
- ⬇️ **Easy Video Downloads** - Single and bulk download options
- 🌍 **Bilingual Support** - English/Hebrew with full RTL
- 📱 **Responsive Design** - Mobile-first UI
- 🎬 **Video Playback** - Modal with thumbnail previews

### Admin Features
- 🔐 **Secure Authentication** - JWT with refresh tokens
- 📊 **Analytics Dashboard** - Stats and rating distribution
- ✅ **Moderation System** - Approve/reject submissions
- 📥 **Bulk Downloads** - Download all videos at once
- ⚙️ **Settings Panel** - Configure Google Review URL
- 👥 **Multi-admin Support** - Multiple admin accounts

### Backend Features
- 🚀 **RESTful API** - Fastify with TypeScript
- 🔒 **Security** - Helmet, rate limiting, CORS
- 📹 **Video Processing** - FFmpeg thumbnail generation
- 📦 **Background Jobs** - Agenda.js task scheduling
- 🗄️ **MongoDB** - Flexible document storage
- 🐳 **Docker Ready** - Full containerization

---

## 🚀 Quick Start

### Option 1: One-Command Deployment (Recommended)

```bash
git clone https://github.com/Benlenderman/jobspace-reviews-vault.git
cd jobspace-reviews-vault
./start.sh
```

**That's it!** 🎉 Open http://localhost:5173

### Option 2: Production Deployment

```bash
cp .env.production.example .env.production
nano .env.production  # Edit your secrets
./deploy-prod.sh
```

### Option 3: Cloud Deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/select-repo?type=blueprint)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Get running in 3 minutes |
| [PRODUCTION.md](PRODUCTION.md) | Production deployment guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment options |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [SUCCESS.md](SUCCESS.md) | Feature overview & demo flow |

---

## 🔧 Tech Stack

### Backend
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Fastify
- **Database:** MongoDB 7 + Mongoose
- **Jobs:** Agenda.js
- **Video:** FFmpeg
- **Auth:** JWT + bcrypt
- **Validation:** Zod

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **State:** TanStack Query + Zustand
- **Styling:** Tailwind CSS
- **i18n:** react-i18next
- **Routing:** React Router

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Web Server:** Nginx (production)
- **Deployment:** Railway, Render, or VPS

---

## 🎬 Demo Flow

1. **Visit Incentive Page** → Choose video or Google review
2. **Submit Review** → Upload video and get discount code
3. **Admin Approval** → Review and approve submission
4. **Public Display** → Appears on reviews wall
5. **Download** → Bulk download all testimonials

---

## 🔑 Default Credentials

### Admin 1
```
Email: admin@jobspace.local
Password: Admin123!
```

### Admin 2
```
Email: benlenderman2@gmail.com
Password: 2wsx@WSX
```

⚠️ **Change these in production!**

---

## 📊 Project Stats

- **Files:** 85+
- **Lines of Code:** 10,500+
- **Commits:** 5
- **Languages:** TypeScript, JavaScript, Markdown
- **Test Coverage:** Manual testing complete
- **Documentation:** 100% complete

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🆘 Support

- 📖 [Read the docs](README.md)
- 🐛 [Report bugs](https://github.com/Benlenderman/jobspace-reviews-vault/issues)
- 💬 [Ask questions](https://github.com/Benlenderman/jobspace-reviews-vault/discussions)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Built with ❤️ using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)

</div>
