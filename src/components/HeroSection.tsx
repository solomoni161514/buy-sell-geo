import { Search, MapPin, ShieldCheck, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 py-24 sm:py-32 text-center overflow-hidden"
      style={{ background: `url(${heroBg}) center/cover no-repeat` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-tight">
          {t("heroTitle")}{" "}
          <span className="text-primary">{t("heroTitleHighlight")}</span>
        </h1>

        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          {t("heroSubtitle")}
        </p>

        {/* Search Bar */}
        <div className="hero-search-bar w-full max-w-xl mt-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={t("searchWhat")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="hidden sm:flex items-center gap-1 border-l border-border pl-3 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <input
              type="text"
              placeholder={t("locationOptional")}
              className="bg-transparent text-sm placeholder:text-muted-foreground outline-none w-32"
            />
          </div>
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            {t("search")}
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("noHiddenFees")}
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("verifiedSellers")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
