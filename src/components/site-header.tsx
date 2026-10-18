export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="منحتي، الصفحة الرئيسية">
        منحتي
      </a>
      <nav className="site-nav" aria-label="التنقل الرئيسي">
        <a href="/scholarships">المنح الدراسية</a>
        <a href="/admin/login">دخول الإدارة</a>
      </nav>
    </header>
  );
}
