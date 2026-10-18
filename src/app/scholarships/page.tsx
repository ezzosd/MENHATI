import { ScholarshipCard } from "@/components/scholarship-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedScholarships } from "@/lib/scholarships";
import {
  createSupabaseServerClient,
  getSupabasePublicConfig,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "المنح الدراسية | منحتي",
};

type ScholarshipsPageProps = {
  searchParams?: { q?: string };
};

export default async function ScholarshipsPage({
  searchParams,
}: ScholarshipsPageProps) {
  const search = searchParams?.q?.trim().slice(0, 100) ?? "";
  const config = getSupabasePublicConfig();
  let scholarships = null;
  let loadError = false;

  if (config) {
    const supabase = await createSupabaseServerClient();
    const result = await getPublishedScholarships(supabase, search);
    scholarships = result.data;
    loadError = Boolean(result.error);
  }

  return (
    <>
      <SiteHeader />
      <main className="page-shell">
        <section className="page-intro">
          <h1>المنح الدراسية</h1>
          <p>ابحث عن الفرصة المناسبة، واطّلع على تفاصيلها ومواعيد التقديم.</p>
        </section>

        <form className="search-form" action="/scholarships" role="search">
          <label className="sr-only" htmlFor="scholarship-search">
            ابحث باسم المنحة
          </label>
          <input
            className="search-input"
            id="scholarship-search"
            name="q"
            type="search"
            placeholder="ابحث باسم المنحة"
            defaultValue={search}
          />
          <button className="button button-secondary" type="submit">
            بحث
          </button>
        </form>

        {!config ? (
          <div className="notice" role="status">
            لم يتم ربط قاعدة البيانات بعد. انسخ <code>.env.example</code> إلى
            <code> .env.local</code>، ثم أضف عنوان Supabase ومفتاح anon لتظهر
            المنح المنشورة.
          </div>
        ) : loadError ? (
          <div className="notice notice-error" role="alert">
            تعذر تحميل المنح من Supabase. تحقق من إعداد الاتصال وسياسات RLS ثم
            أعد المحاولة.
          </div>
        ) : scholarships?.length ? (
          <section className="scholarship-grid" aria-label="المنح المنشورة">
            {scholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </section>
        ) : config ? (
          <section className="empty-state" aria-live="polite">
            <h2>{search ? "لا توجد نتائج مطابقة" : "لا توجد منح منشورة حاليًا"}</h2>
            <p>
              {search
                ? "جرّب البحث باسم مختلف، أو احذف عبارة البحث لعرض كل المنح المتاحة."
                : "ستظهر المنح هنا بعد إضافتها ونشرها من لوحة الإدارة."}
            </p>
          </section>
        ) : null}
      </main>
    </>
  );
}
