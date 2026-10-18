import { SiteHeader } from "@/components/site-header";
import { SubmitButton } from "@/components/submit-button";
import { getSupabasePublicConfig } from "@/lib/supabase/server";
import { loginAdmin } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "دخول الإدارة | منحتي",
};

const loginErrors: Record<string, string> = {
  configuration: "أضف عنوان Supabase ومفتاح anon إلى ملف .env.local أولًا.",
  invalid: "أدخل بريدًا إلكترونيًا صالحًا وكلمة المرور.",
  credentials: "تعذر تسجيل الدخول بهذه البيانات. تحقق منها وحاول مجددًا.",
  unauthorized: "تم تسجيل الدخول، لكن هذا الحساب غير مخوّل لإدارة المنح.",
  "access-check": "تعذر التحقق من صلاحية الحساب. تحقق من إعدادات قاعدة البيانات.",
};

type AdminLoginPageProps = {
  searchParams?: { error?: string };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const error = searchParams?.error
    ? loginErrors[searchParams.error]
    : undefined;
  const configured = Boolean(getSupabasePublicConfig());

  return (
    <>
      <SiteHeader />
      <main className="login-shell">
        <h1>دخول الإدارة</h1>
        <p>سجّل الدخول باستخدام حساب مُضاف إلى قائمة مديري منحتي.</p>
        {error ? (
          <div className="notice notice-error" role="alert">
            {error}
          </div>
        ) : null}
        {!configured ? (
          <div className="notice" role="status">
            تحتاج هذه الصفحة إلى إعداد Supabase قبل تسجيل الدخول.
          </div>
        ) : null}
        <form className="login-form" action={loginAdmin}>
          <label>
            البريد الإلكتروني
            <input
              className="field"
              type="email"
              name="email"
              autoComplete="username"
              dir="ltr"
              required
            />
          </label>
          <label>
            كلمة المرور
            <input
              className="field"
              type="password"
              name="password"
              autoComplete="current-password"
              dir="ltr"
              required
            />
          </label>
          <SubmitButton disabled={!configured} />
        </form>
      </main>
    </>
  );
}
