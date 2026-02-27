import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <span className="text-sm font-bold text-foreground">OmniMarket</span>
          <p className="text-xs text-muted-foreground mt-0.5">{t("footerAbout")}</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:+1234567890"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            aria-label="Call OmniMarket"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.02a2 2 0 0 1-.45 2.11L8.91 10.9a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.95.4 1.97.66 3.02.78A2 2 0 0 1 22 16.92z" fill="currentColor"/>
            </svg>

            <span>+1234567890</span>
          </a>

          <p className="text-xs text-muted-foreground hidden sm:block">© 2026 OmniMarket. {t("footerRights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
