import { Search, Globe, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string, role?: string } | null>(null);
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    try {
      const raw = localStorage.getItem('theme');
      return raw === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
      else setUser(null);
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // apply theme class to document
    try {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const setThemeServer = async (t: 'light'|'dark') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  const api = await import('@/lib/api');
  await api.apiFetch('/api/users/theme', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ theme: t }) });
      // update local user copy
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          u.theme = t;
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
        }
      } catch (e) {
        // ignore localStorage parse errors
      }
    } catch (e) {
      // ignore
    }
  };

  const applyThemeWithTransition = (next: 'light'|'dark') => {
    try {
      const el = document.documentElement;
      el.classList.add('theme-transition');
  // Force reflow so transition class takes effect
  void el.offsetWidth;
      setTheme(next);
      setTimeout(() => el.classList.remove('theme-transition'), 300);
    } catch (e) {
      setTheme(next);
    }
  };

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight text-foreground">
          Omni<span className="text-primary">Market</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/" className="transition hover:text-foreground">{t("explore")}</Link>
          <Link to={`/listings?category=${encodeURIComponent('Real Estate')}`} className="transition hover:text-foreground">{t("realEstate")}</Link>
          <Link to={`/listings?category=${encodeURIComponent('Vehicles')}`} className="transition hover:text-foreground">{t("vehicles")}</Link>
          <Link to={`/listings?category=${encodeURIComponent('Electronics')}`} className="transition hover:text-foreground">{t("electronics")}</Link>
          {user && user.role === 'admin' && (
            <Link to="/add-product" className="transition hover:text-foreground">{t('addProduct') || 'Add Product'}</Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "ka" ? "en" : "ka")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === "ka" ? "EN" : "ქარ"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; applyThemeWithTransition(next); setThemeServer(next); }}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {theme === 'dark' ? '🌙 Dark' : '🔆 Light'}
          </button>

          {!user ? (
            <Link
              to="/login"
              className="hidden rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary sm:inline-flex"
            >
              {t("signIn")}
            </Link>
          ) : (
            <div className="hidden items-center gap-3 sm:inline-flex">
              <span className="text-sm font-medium">{user.name || 'Account'}</span>
              <button onClick={handleLogout} className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary">
                {t('signOut') || 'Sign Out'}
              </button>
            </div>
          )}

          {/* Mobile menu */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-1">{t("explore")}</Link>
            <Link to={`/listings?category=${encodeURIComponent('Real Estate')}`} onClick={() => setMobileOpen(false)} className="py-1">{t("realEstate")}</Link>
            <Link to={`/listings?category=${encodeURIComponent('Vehicles')}`} onClick={() => setMobileOpen(false)} className="py-1">{t("vehicles")}</Link>
            <Link to={`/listings?category=${encodeURIComponent('Electronics')}`} onClick={() => setMobileOpen(false)} className="py-1">{t("electronics")}</Link>
            {user && user.role === 'admin' && (
              <Link to="/add-product" onClick={() => setMobileOpen(false)} className="py-1">{t('addProduct') || 'Add Product'}</Link>
            )}
            {!user ? (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="py-1 text-primary font-semibold">{t("signIn")}</Link>
            ) : (
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="py-1 text-primary font-semibold">{t('signOut') || 'Sign Out'}</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
