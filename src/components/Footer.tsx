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
        <p className="text-xs text-muted-foreground">© 2026 OmniMarket. {t("footerRights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
