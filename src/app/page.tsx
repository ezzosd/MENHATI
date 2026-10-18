export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="منحتي، الصفحة الرئيسية">
          منحتي
        </a>
        <nav className="site-nav" aria-label="التنقل الرئيسي">
          <a href="/scholarships">المنح الدراسية</a>
          <a href="/admin/login">دخول الإدارة</a>
        </nav>
      </header>
      <main className="page-shell home-shell">
        <section className="home-copy">
          <h1>منحتي</h1>
          <p>
            اكتشف فرصًا دراسية حول العالم، وقارن تفاصيل المنح ومواعيد التقديم
            لتجد الفرصة الأقرب إلى طموحك.
          </p>
          <div className="home-actions">
            <a className="button button-secondary" href="/scholarships">
              تصفح المنح الدراسية
            </a>
            <a className="button" href="/admin/login">
              دخول الإدارة
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
