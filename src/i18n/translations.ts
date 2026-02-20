export type Language = "ka" | "en";

export const translations = {
  ka: {
    // Nav
    brand: "მარკეტი",
    explore: "აღმოაჩინე",
    realEstate: "უძრავი ქონება",
    vehicles: "ავტომობილები",
    electronics: "ელექტრონიკა",
    searchPlaceholder: "მოძებნე რაც გინდა...",
    signIn: "შესვლა",
    register: "რეგისტრაცია",
    listings: "განცხადებები",

    // Hero
    heroTitle: "აღმოაჩინე შენი",
    heroTitleHighlight: "ყველაფერი.",
    heroSubtitle: "პრემიუმ მარკეტპლეისი სადაც შეგიძლია იყიდო, გაყიდო ან იქირაო უძრავი ქონება, ავტომობილები, ელექტრონიკა და სხვა.",
    searchWhat: "რას ეძებთ?",
    locationOptional: "მდებარეობა (არჩევითი)",
    search: "ძიება",
    noHiddenFees: "დამალული საკომისიო არ არის",
    verifiedSellers: "ვერიფიცირებული გამყიდველები",

    // Categories
    categoriesTitle: "კატეგორიები",
    categoriesSubtitle: "იპოვე ზუსტად ის რაც გჭირდება ჩვენი კოლექციებიდან.",
    realEstateCategory: "უძრავი ქონება",
    vehiclesCategory: "ავტომობილები",
    electronicsCategory: "ელექტრონიკა",
    jewelryCategory: "სამკაულები",
    fashionCategory: "მოდა",
    collectiblesCategory: "კოლექციონირება",
    items: "განცხ.",

    // Featured
    featuredTitle: "გამორჩეული შეთავაზებები",
    featuredSubtitle: "ხელით შერჩეული პრემიუმ განცხადებები, ყოველდღე განახლებული.",
    viewAll: "ყველას ნახვა",
    rent: "ქირავდება",
    buy: "იყიდება",
    sell: "გაყიდვა",
    perMonth: "/თვე",

    // Auth
    loginTitle: "ანგარიშში შესვლა",
    registerTitle: "ახალი ანგარიშის შექმნა",
    email: "ელ. ფოსტა",
    password: "პაროლი",
    confirmPassword: "დაადასტურეთ პაროლი",
    fullName: "სახელი და გვარი",
    loginButton: "შესვლა",
    registerButton: "რეგისტრაცია",
    noAccount: "არ გაქვთ ანგარიში?",
    hasAccount: "უკვე გაქვთ ანგარიში?",
    orContinueWith: "ან გააგრძელეთ",

    // Listings
    listingsTitle: "ყველა განცხადება",
    listingsSubtitle: "იპოვე სასურველი პროდუქტი ან მომსახურება.",
    filterAll: "ყველა",
    filterBuy: "ყიდვა",
    filterRent: "ქირავნება",
    filterSell: "გაყიდვა",

    // Footer
    footerAbout: "პრემიუმ მარკეტპლეისი ყველაფრისთვის.",
    footerRights: "ყველა უფლება დაცულია.",
  },
  en: {
    brand: "Market",
    explore: "Explore",
    realEstate: "Real Estate",
    vehicles: "Vehicles",
    electronics: "Electronics",
    searchPlaceholder: "Search anything...",
    signIn: "Sign In",
    register: "Register",
    listings: "Listings",

    heroTitle: "Discover Your Next",
    heroTitleHighlight: "Everything.",
    heroSubtitle: "The premium marketplace to buy, sell, or rent high-end properties, luxury vehicles, professional gear, and exclusive items.",
    searchWhat: "What are you looking for?",
    locationOptional: "Location (optional)",
    search: "Search",
    noHiddenFees: "No hidden fees",
    verifiedSellers: "Verified sellers",

    categoriesTitle: "Explore Categories",
    categoriesSubtitle: "Find exactly what you need from our curated collections.",
    realEstateCategory: "Real Estate",
    vehiclesCategory: "Vehicles",
    electronicsCategory: "Electronics",
    jewelryCategory: "Jewelry",
    fashionCategory: "Fashion",
    collectiblesCategory: "Collectibles",
    items: "items",

    featuredTitle: "Featured Selections",
    featuredSubtitle: "Hand-picked premium listings updated daily.",
    viewAll: "View All",
    rent: "Rent",
    buy: "Buy",
    sell: "Sell",
    perMonth: "/mo",

    loginTitle: "Sign in to your account",
    registerTitle: "Create a new account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    loginButton: "Sign In",
    registerButton: "Register",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    orContinueWith: "Or continue with",

    listingsTitle: "All Listings",
    listingsSubtitle: "Find the product or service you need.",
    filterAll: "All",
    filterBuy: "Buy",
    filterRent: "Rent",
    filterSell: "Sell",

    footerAbout: "The premium marketplace for everything.",
    footerRights: "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof typeof translations.ka;
