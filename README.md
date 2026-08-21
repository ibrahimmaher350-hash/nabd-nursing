# نبض للتمريض المنزلي — موقع الخدمات

**Production-ready home nursing service website for دمياط، مصر**

## 🚀 البدء السريع

```bash
# 1. تثبيت الحزم
npm install

# 2. نسخ ملف البيئة
cp .env.local.example .env.local
# ثم أضف بيانات Firebase في .env.local

# 3. تشغيل محلياً
npm run dev
# افتح: http://localhost:3000

# 4. البناء للنشر
npm run build
npm run start
```

## 📁 هيكل المشروع

```
nabd-nursing/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # الصفحة الرئيسية /
│   │   ├── services/            # صفحات الخدمات
│   │   ├── booking/             # صفحة الحجز
│   │   ├── about/               # من نحن
│   │   ├── contact/             # تواصل معنا
│   │   ├── blog/                # المدونة
│   │   ├── admin/               # لوحة التحكم
│   │   ├── privacy/             # سياسة الخصوصية
│   │   ├── terms/               # الشروط والأحكام
│   │   └── medical-disclaimer/  # إخلاء المسؤولية
│   ├── components/
│   │   ├── layout/              # Header, Footer, FloatingActions
│   │   ├── sections/            # Homepage sections
│   │   ├── booking/             # BookingFlow, BookingSuccess
│   │   └── services/            # ServicesFilter
│   ├── data/
│   │   ├── siteConfig.ts        # ⭐ Central config — لا تعدّل الـ config في أماكن أخرى
│   │   └── services.ts          # ⭐ 15 خدمة — Data-driven
│   ├── lib/
│   │   ├── firebase/            # Firebase config, Firestore, FCM
│   │   ├── providers/           # BloggerProvider (swappable)
│   │   └── analytics.ts         # GA4 events
│   └── types/                   # TypeScript types
├── public/
│   ├── logo.jpg                 # ⭐ الشعار الرسمي
│   ├── manifest.webmanifest     # PWA
│   ├── sw.js                    # Service Worker
│   ├── robots.txt               # SEO
│   └── sitemap.xml              # SEO
├── firestore.rules              # Firebase Security Rules
└── .env.local.example           # Variables template
```

## ⚙️ الإعداد

### 1. Firebase Project
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ project جديد
3. فعّل: **Firestore Database**, **Authentication**, **Cloud Messaging**
4. في Authentication: فعّل Email/Password
5. في Firestore: انسخ Security Rules من `firestore.rules`
6. انسخ Firebase config في `.env.local`

### 2. متغيرات البيئة (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. نقل الشعار
انسخ `logo.jpg` (الشعار الرسمي) إلى `public/logo.jpg`

### 4. PWA Icons
أنشئ مجلد `public/icons/` وأضف الأحجام:
`icon-72.png`, `icon-96.png`, `icon-128.png`, `icon-144.png`, `icon-152.png`, `icon-192.png`, `icon-384.png`, `icon-512.png`

## 🌐 النشر

### Vercel (الأسرع)
```bash
npm install -g vercel
vercel
# أضف environment variables في Vercel Dashboard
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📊 إضافة Google Analytics
1. أنشئ GA4 Property في Google Analytics
2. أضف `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` في `.env.local`

## ✏️ إضافة خدمة جديدة
في `src/data/services.ts` فقط — أضف object جديد بنفس البنية الموجودة.

## 🔧 تغيير معلومات التواصل
في `src/data/siteConfig.ts` فقط — قسم `contact`.

## 📞 معلومات التواصل
- **واتساب:** 01099667065
- **الاتصال المباشر:** 01001097896
- **فيسبوك:** [الصفحة](https://www.facebook.com/share/1D1B1uSJMy/)
- **المدونة:** [Blogger](https://nabd-damietta.blogspot.com/?m=1)

---

Built with ❤️ for نبض للتمريض المنزلي — دمياط، مصر
