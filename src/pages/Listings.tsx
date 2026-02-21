import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Heart, Search } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const PLACEHOLDER = '/placeholder.svg';

type ListingType = "all" | "buy" | "rent" | "sell";

interface Listing {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  type: "rent" | "buy" | "sell";
  category: string;
}

interface ServerProduct {
  _id: string;
  images?: string[];
  title?: string;
  name?: string;
  location?: string;
  price?: number | string;
  type?: string;
  category?: string;
  brand?: string;
}

const Listings = () => {
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [filter, setFilter] = useState<ListingType>("all");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryQuery = params.get('category') || undefined;
  const qParam = params.get('q') || undefined;
  const locParam = params.get('loc') || undefined;
  const [brandFilter, setBrandFilter] = useState<string | undefined>(undefined);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    // determine admin status from localStorage (keeps UI in sync)
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setIsAdmin(u && u.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      setIsAdmin(false);
    }

    let mounted = true;
    console.debug('Listings: categoryQuery=', categoryQuery);
    // reset the local type filter when category changes so users see all items in the category
    setFilter('all');
    (async () => {
      try {
  let url = categoryQuery ? `/api/products?category=${encodeURIComponent(categoryQuery)}` : '/api/products';
  if (qParam) url += `${url.includes('?') ? '&' : '?'}q=${encodeURIComponent(qParam)}`;
  if (locParam) url += `${url.includes('?') ? '&' : '?'}loc=${encodeURIComponent(locParam)}`;
  if (brandFilter) url += `&brand=${encodeURIComponent(brandFilter)}`;
  if (priceMin) url += `&priceMin=${encodeURIComponent(priceMin)}`;
  if (priceMax) url += `&priceMax=${encodeURIComponent(priceMax)}`;
  console.debug('Listings: fetch url', url);
  const api = await import('@/lib/api');
  const res = await api.apiFetch(url.replace(/^\//, ''));
        if (!res.ok) return;
        const data = await res.json();
        console.debug('Listings: fetched count', Array.isArray(data) ? data.length : 0);
        if (!mounted) return;
        // map server products to Listing type minimally
        const mapped = data.map((p: ServerProduct) => ({
          id: p._id,
          image: p.images && p.images[0] ? p.images[0] : PLACEHOLDER,
          title: p.title || p.name || 'No title',
          location: p.location || 'Unknown',
          price: typeof p.price === 'number' ? `₾${p.price}` : p.price || 'N/A',
          type: (p.type as ListingType) || 'sell',
          category: p.category || 'General'
        }));
  setAllListings(mapped);
  const brands = Array.from(new Set((data || []).map((p: ServerProduct) => p.brand).filter(Boolean)));
  setAvailableBrands(brands as string[]);
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryQuery, brandFilter, priceMin, priceMax, qParam, locParam]);

  // If user is not admin and current filter is 'sell', reset it to 'all'
  useEffect(() => {
    if (!isAdmin && filter === 'sell') {
      setFilter('all');
    }
  }, [isAdmin, filter]);

  const filtered = filter === "all" ? allListings : allListings.filter((l) => l.type === filter);

  const badgeClass = (type: string) =>
    type === "rent" ? "badge-rent" : type === "buy" ? "badge-buy" : "badge-sell";
  const badgeLabel = (type: string) =>
    type === "rent" ? t("rent") : type === "buy" ? t("buy") : t("sell");

  const filters: { key: ListingType; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "buy", label: t("filterBuy") },
    { key: "rent", label: t("filterRent") },
    // only show sell filter to admins
    ...(isAdmin ? [{ key: "sell" as ListingType, label: t("filterSell") }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">{t("listingsTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("listingsSubtitle")}</p>

        {/* Filters */}
        <div className="mt-6 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Two-column layout: sidebar + grid */}
        <div className="mt-8 grid gap-5 grid-cols-1 lg:grid-cols-4">
          <aside className="order-1 lg:order-none lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-card p-4 rounded border border-border">
                <div className="text-sm font-medium mb-2">Category</div>
                <div className="text-sm text-foreground">{categoryQuery || 'All'}</div>
              </div>

              <div className="bg-card p-4 rounded border border-border">
                <div className="text-sm font-medium mb-2">Brand</div>
                <select value={brandFilter || ''} onChange={(e) => setBrandFilter(e.target.value || undefined)} className="w-full rounded border border-input px-3 py-2">
                  <option value="">All</option>
                  {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="bg-card p-4 rounded border border-border">
                <div className="text-sm font-medium mb-2">Price</div>
                <div className="flex gap-2">
                  <input placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-1/2 rounded border border-input px-3 py-2" />
                  <input placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-1/2 rounded border border-input px-3 py-2" />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { /* triggers useEffect via state */ }} className="flex-1 rounded bg-primary px-3 py-2 text-primary-foreground">Apply</button>
                <button onClick={() => { setBrandFilter(undefined); setPriceMin(''); setPriceMax(''); }} className="flex-1 rounded border border-border px-3 py-2">Reset</button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((item) => (
                    <Link to={`/product/${item.id}`} key={item.id} className="listing-card group block">
              <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image || PLACEHOLDER}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={badgeClass(item.type)}>{badgeLabel(item.type)}</span>
                  <span className="badge-category">{item.category}</span>
                </div>
                <button className="absolute top-3 right-3 rounded-full bg-background/30 p-1.5 backdrop-blur-sm text-background transition hover:bg-background/50">
                  <Heart className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-background">{item.title}</h3>
                    <p className="text-xs text-background/70">{item.location}</p>
                  </div>
                  <span className="text-sm font-bold text-background">{item.price}</span>
                </div>
              </div>
            </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Listings;
