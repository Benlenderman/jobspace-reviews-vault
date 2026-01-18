# 🚂 Deploy to Railway - Step by Step Guide

## ✅ הקוד כבר ב-GitHub!
**Repository:** https://github.com/Benlenderman/jobspace-reviews-vault

---

## 🚀 Deploy ב-5 דקות

### שלב 1: צור חשבון ב-Railway

1. לך ל: **https://railway.app/new** (כבר פתוח!)
2. לחץ "Login" בפינה העליונה
3. בחר "Login with GitHub"
4. אשר את ההרשאות

---

### שלב 2: צור פרויקט חדש

1. אחרי ההתחברות, לחץ **"New Project"**
2. בחר **"Deploy from GitHub repo"**
3. בחר את הrepo: **jobspace-reviews-vault**
4. Railway יזהה אוטומטית את Docker Compose!

---

### שלב 3: הוסף MongoDB

1. לחץ **"+ New"** בתוך הפרויקט
2. בחר **"Database" → "Add MongoDB"**
3. Railway יצור MongoDB אוטומטית
4. המתן שה-MongoDB יהיה Ready (סטטוס ירוק)

---

### שלב 4: הגדר משתני סביבה - Backend

1. לחץ על ה-**backend service**
2. לך ל-**"Variables"** בתפריט
3. לחץ **"+ New Variable"**
4. הוסף את המשתנים הבאים:

```env
MONGODB_URI=mongodb://mongo:password@mongodb.railway.internal:27017/jobspace_reviews_vault
JWT_SECRET=your-super-secret-jwt-key-production-random-string
REFRESH_TOKEN_SECRET=your-another-super-secret-refresh-token-random
NODE_ENV=production
PORT=3000
CORS_ORIGIN=${{RAILWAY_PUBLIC_DOMAIN}}
```

**חשוב!** 
- `MONGODB_URI` - לחץ על ה-MongoDB service, העתק את ה-"Private URL"
- `JWT_SECRET` - יצור string אקראי חזק (לפחות 32 תווים)
- `REFRESH_TOKEN_SECRET` - יצור string אקראי אחר
- `CORS_ORIGIN` - Railway ימלא אוטומטית

---

### שלב 5: הגדר משתני סביבה - Frontend

1. לחץ על ה-**frontend service**
2. לך ל-**"Variables"**
3. לחץ **"+ New Variable"**
4. הוסף:

```env
VITE_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
```

**Railway ימלא אוטומטית את ה-URL של ה-backend!**

---

### שלב 6: הפעל את השירותים

1. Railway יתחיל לבנות את הקונטיינרים אוטומטית
2. המתן 2-3 דקות לבנייה
3. בדוק שכל השירותים עם סטטוס **"Active"** (ירוק)

---

### שלב 7: הרץ Seed (חד פעמי)

1. לחץ על ה-**backend service**
2. לך ל-**"Settings" → "Service Settings"**
3. תחת "Deploy Lifecycle", הוסף:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run seed && npm start`
4. Deploy מחדש (Deploy → Redeploy)

**אחרי Seed מוצלח, החזר את Start Command ל:**
```bash
npm start
```

---

### שלב 8: קבל את ה-URLs

1. לחץ על **backend service**
2. לך ל-**"Settings"**
3. תחת "Domains", לחץ **"Generate Domain"**
4. העתק את ה-URL (יהיה משהו כמו `backend-production-xxxx.up.railway.app`)

5. לחץ על **frontend service**
6. לך ל-**"Settings"**
7. תחת "Domains", לחץ **"Generate Domain"**
8. העתק את ה-URL (יהיה משהו כמו `frontend-production-xxxx.up.railway.app`)

---

### שלב 9: עדכן CORS

1. חזור ל-**backend Variables**
2. עדכן את `CORS_ORIGIN` ל-URL של ה-Frontend שקיבלת
3. שמור

---

### שלב 10: התחבר!

1. לך ל-Frontend URL שקיבלת
2. לחץ על "Admin Login"
3. התחבר עם:
   - Email: `benlenderman2@gmail.com`
   - Password: `2wsx@WSX`

**או:**
   - Email: `admin@jobspace.local`
   - Password: `Admin123!`

---

## 🎉 סיימת! האתר שלך LIVE!

**Frontend URL:** `https://frontend-production-xxxx.up.railway.app`
**Backend API:** `https://backend-production-xxxx.up.railway.app/api`

---

## 💰 עלות

Railway מציעה:
- **$5 חינם לחודש** (Hobby plan)
- אחר כך בערך **$5-10/חודש** לפרויקט בגודל הזה

---

## 🔧 לאחר Deployment

1. **הגדר Google Review URL:**
   - היכנס לAdmin → Settings
   - הדבק את ה-URL של Google Business Profile שלך

2. **שנה סיסמאות:**
   - שנה את סיסמת האדמין מ-Settings

3. **בדוק שהכל עובד:**
   - העלה סרטון testimonial
   - בדוק discount code
   - נסה Google Review
   - בדוק הורדת סרטונים

---

## ❗ Troubleshooting

### בעיה: Backend לא עולה
**פתרון:** בדוק Logs ב-Railway → Backend → Logs

### בעיה: Frontend לא מתחבר ל-Backend
**פתרון:** ודא ש-`VITE_API_URL` מצביע נכון ל-Backend Domain

### בעיה: MongoDB connection error
**פתרון:** ודא ש-`MONGODB_URI` נכון - העתק מ-MongoDB Private URL

---

## 🆘 צריך עזרה?

1. בדוק **Logs** בכל service
2. ודא שכל המשתנים מוגדרים נכון
3. בדוק ש-MongoDB רץ (Active)

---

**🎊 מזל טוב! האתר שלך באוויר!**
