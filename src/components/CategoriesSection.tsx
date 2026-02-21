import { Home, Car, Monitor, Gem, Shirt, Trophy } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const CategoriesSection = () => {
  const { t } = useLanguage();

  const [counts, setCounts] = useState<Record<string, number>>({});

  const categories = [
    { icon: Home, label: t("realEstateCategory"), value: 'Real Estate' },
    { icon: Car, label: t("vehiclesCategory"), value: 'Vehicles' },
    { icon: Monitor, label: t("electronicsCategory"), value: 'Electronics' },
    { icon: Gem, label: t("jewelryCategory"), value: 'Jewelry' },
    { icon: Shirt, label: t("fashionCategory"), value: 'Fashion' },
    { icon: Trophy, label: t("collectiblesCategory"), value: 'Collectibles' },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const api = await import('@/lib/api');
  const res = await api.apiFetch('/api/products/categories');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setCounts(data);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // format numbers compactly: 12500 -> 12.5k, 10000 -> 10k, 1500 -> 1.5k
  const fmt = (n?: number) => {
    if (!n) return '0';
    if (n >= 1000) {
      // keep one decimal precision but drop trailing .0 (e.g. 10.0 -> 10)
      const val = Number((n / 1000).toFixed(1));
      return `${val}k`;
    }
    return String(n);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold text-foreground">{t("categoriesTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("categoriesSubtitle")}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link key={cat.value} to={`/listings?category=${encodeURIComponent(cat.value)}`} className="category-card">
            <cat.icon className="h-7 w-7 text-foreground" />
            <span className="text-sm font-semibold text-foreground">{cat.label}</span>
            <span className="text-xs text-muted-foreground">{fmt(counts[cat.value])} {t("items")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
