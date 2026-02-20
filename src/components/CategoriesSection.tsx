import { Home, Car, Monitor, Gem, Shirt, Trophy } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";

const CategoriesSection = () => {
  const { t } = useLanguage();

  const categories = [
    { icon: Home, label: t("realEstateCategory"), count: "12.5k" },
    { icon: Car, label: t("vehiclesCategory"), count: "8.2k" },
    { icon: Monitor, label: t("electronicsCategory"), count: "24k" },
    { icon: Gem, label: t("jewelryCategory"), count: "3.3k" },
    { icon: Shirt, label: t("fashionCategory"), count: "19k" },
    { icon: Trophy, label: t("collectiblesCategory"), count: "5.4k" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold text-foreground">{t("categoriesTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("categoriesSubtitle")}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link to="/listings" key={cat.label} className="category-card">
            <cat.icon className="h-7 w-7 text-foreground" />
            <span className="text-sm font-semibold text-foreground">{cat.label}</span>
            <span className="text-xs text-muted-foreground">{cat.count} {t("items")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
