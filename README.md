# منحتي | Menhati - منصة المنح الدراسية

منصة عربية شاملة للبحث عن المنح الدراسية حول العالم.

## 🚀 البدء السريع

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد Supabase
1. أنشئ مشروع جديد على [supabase.com](https://supabase.com)
2. اذهب إلى SQL Editor وشغل ملف supabase/migrations/001_initial_schema.sql
3. أنشئ Storage Bucket باسم scholarships-images واجعله Public
4. انسخ مفاتيح المشروع إلى ملف .env.local

```bash
cp .env.example .env.local
```

### 3. إنشاء أول أدمن
بعد تسجيل أول مستخدم عبر /admin/login، شغل هذا SQL في Supabase:

```sql
insert into admin_profiles (id, role)
values ('USER_UUID_HERE', 'admin');
-- استبدل USER_UUID_HERE بـ auth.users id
```

### 4. التشغيل المحلي
```bash
npm run dev
```
افتح http://localhost:3000

### 5. النشر على Vercel
1. ارفع المشروع إلى GitHub
2. اربط المستودع في Vercel
3. أضف متغيرات البيئة في Vercel Dashboard
4. Deploy

## 📁 هيكل المشروع
- src/app - صفحات Next.js App Router
- src/components - مكونات مشتركة
- src/lib/supabase - إعداد Supabase
- supabase/migrations - قواعد البيانات

## 🎨 الألوان
- Olive #8b9a6e - الأساسي
- Cream #f7f2eb - الخلفية
- Teal #2a9d8f - الثانوي
- Dark #2d3a2e - النصوص

## 📄 الترخيص
MIT
