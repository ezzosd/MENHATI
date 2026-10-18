import { SiteHeader } from "@/components/site-header";
import { formatDeadline } from "@/lib/scholarships";
import { getSupabasePublicConfig, requireAdmin } from "@/lib/supabase/server";
import { logoutAdmin } from "../login/actions";
import { createScholarship, updateScholarshipStatus } from "./actions";

export const dynamic = "force-dynamic";

const dashboardMessages: Record<string, { text: string; error?: boolean }> = {
  invalid: { text: "تحقق من الحقول المطلوبة، وصيغة الرابط والموعد." , error: true },
  save: { text: "تعذر حفظ التغييرات. تحقق من أن المعرّف المختصر غير مستخدم." , error: true },
  created: { text: "أُضيفت المنحة كمسودة. راجعها ثم غيّر حالتها إلى منشورة." },
  updated: { text: "تم تحديث حالة المنحة." },
};

type AdminDashboardProps = {
  searchParams?: { error?: string; notice?: string };
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardProps) {
  if (!getSupabasePublicConfig()) {
    return (
      <>
        <SiteHeader />
        <main className="admin-shell">
          <h1>لوحة الإدارة</h1>
          <div className="notice" role="status">
            أضف إعدادات Supabase إلى <code>.env.local</code> لتفعيل لوحة الإدارة.
          </div>
        </main>
      </>
    );
  }

  const { supabase, user } = await requireAdmin();

  const { data: scholarships, error: scholarshipsError } = await supabase
    .from("scholarships")
    .select("id, title, slug, country, status, deadline")
    .order("created_at", { ascending: false })
    .limit(50);
  const message =
    (searchParams?.error && dashboardMessages[searchParams.error]) ||
    (searchParams?.notice && dashboardMessages[searchParams.notice]);

  return (
    <>
      <SiteHeader />
      <main className="admin-shell">
        <div className="admin-heading">
          <div>
            <h1>لوحة الإدارة</h1>
            <p dir="ltr">{user.email}</p>
          </div>
          <form action={logoutAdmin}>
            <button className="button" type="submit">
              تسجيل الخروج
            </button>
          </form>
        </div>

        {message ? (
          <div
            className={`notice${message.error ? " notice-error" : ""}`}
            role={message.error ? "alert" : "status"}
          >
            {message.text}
          </div>
        ) : null}

        <section className="admin-create">
          <h2>إضافة منحة</h2>
          <p>تُحفظ المنحة الجديدة كمسودة ولا تظهر للزوار حتى تنشرها.</p>
          <form className="scholarship-form" action={createScholarship}>
            <label>
              اسم المنحة
              <input className="field" name="title" minLength={3} maxLength={200} required />
            </label>
            <label>
              المعرّف المختصر للرابط
              <input
                className="field"
                name="slug"
                dir="ltr"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="example-scholarship"
                required
              />
            </label>
            <label>
              الدولة
              <input className="field" name="country" minLength={2} maxLength={100} required />
            </label>
            <label>
              الجامعة
              <input className="field" name="university" maxLength={200} />
            </label>
            <label>
              الدرجة العلمية
              <input className="field" name="degree_level" maxLength={100} />
            </label>
            <label>
              مجال الدراسة
              <input className="field" name="field_of_study" maxLength={150} />
            </label>
            <label>
              نوع التمويل
              <input className="field" name="funding_type" maxLength={100} />
            </label>
            <label>
              آخر موعد للتقديم
              <input className="field" name="deadline" type="date" />
            </label>
            <label className="form-span">
              نبذة مختصرة
              <textarea className="field" name="summary" minLength={10} maxLength={500} rows={3} required />
            </label>
            <label className="form-span">
              تفاصيل المنحة
              <textarea className="field" name="description" minLength={10} rows={5} required />
            </label>
            <label className="form-span">
              رابط التقديم (HTTPS)
              <input className="field" name="application_url" type="url" dir="ltr" />
            </label>
            <div className="form-span">
              <button className="button button-secondary" type="submit">
                حفظ كمسودة
              </button>
            </div>
          </form>
        </section>

        {scholarshipsError ? (
          <div className="notice notice-error" role="alert">
            تعذر تحميل المنح. تحقق من سياسات RLS والاتصال بقاعدة البيانات.
          </div>
        ) : scholarships?.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">المنح الدراسية وإعدادات النشر</caption>
              <thead>
                <tr>
                  <th scope="col">اسم المنحة</th>
                  <th scope="col">الدولة</th>
                  <th scope="col">الحالة</th>
                  <th scope="col">آخر موعد</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td>
                      <a
                        className="text-link"
                        href={`/scholarships/${encodeURIComponent(scholarship.slug)}`}
                      >
                        {scholarship.title}
                      </a>
                    </td>
                    <td>{scholarship.country}</td>
                    <td>
                      <form className="status-form" action={updateScholarshipStatus}>
                        <input type="hidden" name="id" value={scholarship.id} />
                        <label className="sr-only" htmlFor={`status-${scholarship.id}`}>
                          حالة {scholarship.title}
                        </label>
                        <select
                          className="status-select"
                          id={`status-${scholarship.id}`}
                          name="status"
                          defaultValue={scholarship.status}
                        >
                          <option value="draft">مسودة</option>
                          <option value="published">منشورة</option>
                          <option value="closed">مغلقة</option>
                        </select>
                        <button className="text-link" type="submit">
                          حفظ الحالة
                        </button>
                      </form>
                      <span className="sr-only">
                        {scholarship.status === "published"
                          ? "منشورة"
                          : scholarship.status === "draft"
                            ? "مسودة"
                            : "مغلقة"}
                      </span>
                    </td>
                    <td>{formatDeadline(scholarship.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <section className="empty-state">
            <h2>لا توجد منح مضافة بعد</h2>
            <p>
              أضف المنح إلى جدول <code>scholarships</code> عبر لوحة Supabase.
              ستظهر هنا تلقائيًا، ولن تظهر للعامة حتى تصبح حالتها «منشورة».
            </p>
          </section>
        )}
      </main>
    </>
  );
}
