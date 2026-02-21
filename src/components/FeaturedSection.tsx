import { Heart, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import listingApartment from '@/assets/listing-apartment.jpg';
import listingApartment2 from '@/assets/listing-apartment2.jpg';
import listingCamera from '@/assets/listing-camera.jpg';
import listingCar from '@/assets/listing-car.jpg';
import listingJewelry from '@/assets/listing-jewelry.jpg';
const PLACEHOLDER = '/placeholder.svg';

interface Listing {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  type: "rent" | "buy" | "sell";
  category: string;
  large?: boolean;
}

interface ProductData {
  _id?: string;
  images?: string[];
  title?: string;
  location?: string;
  price?: number | string;
  type?: string;
  category?: string;
}

const FeaturedSection = () => {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const res = await import('@/lib/api').then(m => m.apiFetch('/api/products'));
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const mapped = (data || [])
          .slice(0, 6)
          .map((p: ProductData, idx: number) => {
            const imgs = p.images && p.images.length ? p.images[0] : [listingApartment, listingCamera, listingCar, listingApartment2, listingJewelry][idx % 5];
            const rawType = p.type === 'rent' ? 'rent' : p.type === 'buy' ? 'buy' : 'sell';
            return {
              id: p._id || String(idx),
              image: imgs,
              title: p.title || 'No title',
              location: p.location || 'Unknown',
              price: typeof p.price === 'number' ? `₾${p.price}` : (p.price ? String(p.price) : 'N/A'),
              type: rawType as Listing['type'],
              category: p.category || t('realEstateCategory'),
              large: idx === 0,
            } as Listing;
          });
        setListings(mapped);
      } catch (err) {
        // ignore - keep empty
      }
    })();
    return () => { mounted = false; };
  }, [t]);

  const badgeClass = (type: string) =>
    type === "rent" ? "badge-rent" : type === "buy" ? "badge-buy" : "badge-sell";

  const badgeLabel = (type: string) =>
    type === "rent" ? t("rent") : type === "buy" ? t("buy") : t("sell");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("featuredTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("featuredSubtitle")}</p>
        </div>
        <Link to="/listings" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {t("viewAll")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 ? (
          <div className="text-sm text-muted-foreground">No featured listings yet.</div>
        ) : (
          listings.map((item) => (
          <Link
            to={`/product/${item.id}`}
            key={item.id}
            className={`listing-card group ${item.large ? "sm:col-span-1 lg:row-span-2" : ""}`}
            aria-label={`View ${item.title}`}
          >
            <div className={`relative overflow-hidden ${item.large ? "h-72 lg:h-full" : "h-52"}`}>
              <img
                src={item.image || PLACEHOLDER}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className={badgeClass(item.type)}>{badgeLabel(item.type)}</span>
                <span className="badge-category">{item.category}</span>
              </div>

              {/* Heart */}
              <button className="absolute top-3 right-3 rounded-full bg-background/30 p-1.5 backdrop-blur-sm text-background transition hover:bg-background/50">
                <Heart className="h-4 w-4" />
              </button>

              {/* Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-background">{item.title}</h3>
                  <p className="text-xs text-background/70">{item.location}</p>
                </div>
                <span className="text-sm font-bold text-background">{item.price}</span>
              </div>
            </div>
          </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
