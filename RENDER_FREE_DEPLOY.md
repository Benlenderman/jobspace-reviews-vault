# 🆓 Render Deployment - 100% חינם! (ללא כרטיס אשראי)

## צעד 1: צור MongoDB Atlas (2 דקות)

### לך לכאן:
https://www.mongodb.com/cloud/atlas/register

1. **Sign Up** עם Google או Email (ללא כרטיס אשראי!)
2. בחר **"Free" plan** (M0 Sandbox)
3. בחר **AWS** / **Region**: Frankfurt או קרוב אליך
4. שם ל-Cluster: `jobspace-cluster`
5. לחץ **"Create Cluster"** (לוקח 3-5 דקות)

### קבל את ה-Connection String:

1. לחץ **"Connect"** על הcluster שלך
2. בחר **"Connect your application"**
3. העתק את ה-**Connection String**

זה ייראה ככה:
```
mongodb+srv://<username>:<password>@jobspace-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**החלף את `<username>` ו-`<password>` עם הפרטים שלך!**

---

## צעד 2: Deploy ל-Render (3 דקות)

### לך לכאן:
https://dashboard.render.com/select-repo?type=blueprint

1. **Sign Up** עם GitHub (ללא כרטיס אשראי!)
2. אשר את הגישה ל-GitHub
3. בחר את הrepo: **`Benlenderman/jobspace-reviews-vault`**
4. לחץ **"Apply"**

### Render יזהה אוטומטית את `render.yaml`!

---

## צעד 3: הגדר Environment Variables

Render יבקש ממך להגדיר:

### ל-Backend Service:

```
MONGODB_URI=mongodb+srv://username:password@jobspace-cluster.xxxxx.mongodb.net/jobspace_reviews_vault?retryWrites=true&w=majority

JWT_SECRET=66efd0509a2cb92e903c310ac5247ff9b519a78388a3767ee08af1b9c8a72c91

JWT_REFRESH_SECRET=d26abcdb672872bf82709db61b3bf79a42f838c01d8ebfa9087a6c0cf82296de

ENCRYPTION_KEY=4c717a473438b8f606d95157b6561ddb3dead7eb64e90593967a1f831cca4489

NODE_ENV=production

CORS_ORIGIN=https://YOUR-FRONTEND-URL.onrender.com
```

*(תעדכן את CORS_ORIGIN אחרי שתקבל את ה-frontend URL)*

### ל-Frontend Service:

```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

*(תעדכן אחרי שתקבל את הbackend URL)*

---

## צעד 4: לחץ "Deploy"

Render יבנה ויעלה הכל! (5-10 דקות)

---

## ✅ זהו! האתר שלך LIVE!

תקבל URL כמו:
```
Frontend: https://jobspace-frontend.onrender.com
Backend: https://jobspace-backend.onrender.com
```

---

## 💰 עלויות:

**$0 - לגמרי חינם!**

מגבלות Free Tier:
- ✅ 750 שעות/חודש (יותר מספיק!)
- ✅ SSL חינם
- ⚠️ השירות "ישן" אחרי 15 דקות ללא שימוש (מתעורר תוך 30 שניות)

---

## 🔐 Admin Login:

```
URL: https://jobspace-frontend.onrender.com/admin/login
Email: benlenderman2@gmail.com
Password: 2wsx@WSX
```

---

## 🚀 עדכונים:

כל push ל-GitHub → Render עושה deploy אוטומטי!

---

## ⚠️ חשוב:

אחרי שתקבל את שני ה-URLs (frontend + backend):

1. חזור ל-Backend Environment Variables
2. עדכן את `CORS_ORIGIN` עם ה-frontend URL
3. חזור ל-Frontend Environment Variables
4. עדכן את `VITE_API_URL` עם הbackend URL
5. Redeploy (Render יעשה את זה אוטומטית)

---

**זהו! 100% חינם, 24/7, ללא כרטיס אשראי!** 🎉
