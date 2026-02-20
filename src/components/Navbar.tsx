import { Search, Globe, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link to="/listings" className="transition hover:text-foreground">{t("realEstate")}</Link>
          <Link to="/listings" className="transition hover:text-foreground">{t("vehicles")}</Link>
          <Link to="/listings" className="transition hover:text-foreground">{t("electronics")}</Link>
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

          <Link
            to="/login"
            className="hidden rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary sm:inline-flex"
          >
            {t("signIn")}
          </Link>

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
            <Link to="/listings" onClick={() => setMobileOpen(false)} className="py-1">{t("realEstate")}</Link>
            <Link to="/listings" onClick={() => setMobileOpen(false)} className="py-1">{t("vehicles")}</Link>
            <Link to="/listings" onClick={() => setMobileOpen(false)} className="py-1">{t("electronics")}</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="py-1 text-primary font-semibold">{t("signIn")}</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
