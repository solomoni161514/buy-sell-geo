import { useState } from "react";
import { Heart, Search } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import listingApartment from "@/assets/listing-apartment.jpg";
import listingCamera from "@/assets/listing-camera.jpg";
import listingCar from "@/assets/listing-car.jpg";
import listingApartment2 from "@/assets/listing-apartment2.jpg";
import listingJewelry from "@/assets/listing-jewelry.jpg";

type ListingType = "all" | "buy" | "rent" | "sell";

interface Listing {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  type: "rent" | "buy" | "sell";
  category: string;
}

const Listings = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ListingType>("all");

  const allListings: Listing[] = [
    { id: 1, image: listingApartment, title: "Luxury Penthouse Suite", location: "Tbilisi, Vake", price: "₾4,500/თვე", type: "rent", category: t("realEstateCategory") },
    { id: 2, image: listingCamera, title: "Sony Alpha A7IV", location: "Tbilisi", price: "₾6,498", type: "buy", category: t("electronicsCategory") },
    { id: 3, image: listingCar, title: "Tesla Model S Plaid", location: "Batumi", price: "₾289,000", type: "buy", category: t("vehiclesCategory") },
    { id: 4, image: listingApartment2, title: "Modern Studio Apartment", location: "Tbilisi, Saburtalo", price: "₾1,200/თვე", type: "rent", category: t("realEstateCategory") },
    { id: 5, image: listingJewelry, title: "Diamond Gold Necklace", location: "Tbilisi", price: "₾12,500", type: "sell", category: t("jewelryCategory") },
    { id: 6, image: listingCar, title: "BMW M5 Competition", location: "Kutaisi", price: "₾185,000", type: "sell", category: t("vehiclesCategory") },
  ];

  const filtered = filter === "all" ? allListings : allListings.filter((l) => l.type === filter);

  const badgeClass = (type: string) =>
    type === "rent" ? "badge-rent" : type === "buy" ? "badge-buy" : "badge-sell";
  const badgeLabel = (type: string) =>
    type === "rent" ? t("rent") : type === "buy" ? t("buy") : t("sell");

  const filters: { key: ListingType; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "buy", label: t("filterBuy") },
    { key: "rent", label: t("filterRent") },
    { key: "sell", label: t("filterSell") },
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

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="listing-card group">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
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
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Listings;
