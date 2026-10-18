# منحتي

منصة عربية لاكتشاف المنح الدراسية حول العالم وإدارة بيانات المنح المنشورة باستخدام Supabase.

## المتطلبات

- Node.js بإصدار 20 أو أحدث، ويتضمن npm.
- مشروع Supabase.

## تشغيل المشروع محليًا

1. ثبّت اعتماديات المشروع:

   ```bash
   npm install
   ```

2. انسخ ملف إعدادات البيئة:

   ```bash
   cp .env.example .env.local
   ```

   على Windows PowerShell استخدم:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. من لوحة مشروعك في Supabase، افتح **Project Settings → API** وانسخ عنوان المشروع ومفتاح **publishable** إلى `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   لا تضع مفتاح `service_role` في متغير يبدأ بـ `NEXT_PUBLIC_` أو في ملفات تُرفع إلى Git.

4. من **SQL Editor** في Supabase، شغّل محتوى الملف:

   ```text
   supabase/migrations/001_schema.sql
   ```

تتوافر تهيئة Supabase في `src/lib/supabase/client.ts` للاستخدام من المتصفح، وفي `src/lib/supabase/server.ts` و`src/lib/supabase/middleware.ts` لعمليات الخادم والجلسات.

5. ابدأ خادم التطوير:

   ```bash
   npm run dev
   ```

6. افتح [http://localhost:3000](http://localhost:3000).

## إنشاء أول مدير في Supabase

1. من لوحة Supabase افتح **Authentication → Users**، ثم أضف مستخدمًا جديدًا باستخدام البريد الإلكتروني وكلمة المرور.
2. انسخ معرّف المستخدم **User UID** من صفحة المستخدم.
3. افتح **SQL Editor** ونفّذ الاستعلام التالي بعد استبدال `USER_UUID_HERE` بالمعرّف المنسوخ:

   ```sql
   insert into public.admin_profiles (id)
   values ('USER_UUID_HERE');
   ```

   مثال على شكل المعرّف: `123e4567-e89b-12d3-a456-426614174000`.

4. افتح [http://localhost:3000/admin/login](http://localhost:3000/admin/login)، وسجّل الدخول بالبريد وكلمة المرور اللذين أُنشئ بهما المستخدم.
5. بعد الدخول ستفتح لوحة الإدارة على `/admin/dashboard`، ومنها يمكن إضافة منحة كمسودة ثم تغيير حالتها إلى **منشورة**.

جدول `admin_profiles` محمي بسياسات RLS؛ أضف المدير الأول من لوحة Supabase بصلاحية موثوقة، ولا تمنح زوار الموقع صلاحية تعديل هذا الجدول. لا يحتاج تشغيل التطبيق إلى مفتاح `service_role`.

## صفحات المشروع

- `/` — الصفحة الرئيسية.
- `/scholarships` — البحث في المنح المنشورة.
- `/scholarships/[slug]` — تفاصيل المنحة.
- `/admin/login` — دخول المدير.
- `/admin/dashboard` — إدارة المنح وحالات نشرها.

## أوامر مفيدة

```bash
npm run dev    # تشغيل بيئة التطوير
npm run build  # إنشاء بناء الإنتاج والتحقق منه
npm start      # تشغيل بناء الإنتاج بعد npm run build
```
