import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Search,
  ArrowRight,
  Heart,
  ChevronRight,
  Globe,
  ShieldCheck,
  FileText,
  Truck,
  RefreshCw,
  Package,
  Layers
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createGeneralWhatsAppUrl } from '../utils/formatters';
import { Language } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setSelectedSubcategory: (subcategoryId: string) => void;
  setSelectedGender: (gender: string) => void;
  openSearch: () => void;
  openWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  setSelectedCategory,
  setSelectedSubcategory,
  setSelectedGender,
  openSearch,
  openWishlist
}) => {
  const { categories, subcategories, settings, cartItemCount, setIsCartOpen, wishlist, language, setLanguage, t, dir } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      setProductsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setProductsDropdownOpen(false);
      }, 250);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string, subId?: string, gender?: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId || '');
    if (gender) {
      setSelectedGender(gender);
    } else {
      setSelectedGender('all');
    }
    setCurrentView('products');
    setProductsDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappChatUrl = createGeneralWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Habeevatussunnah Online Business, I would like to make an inquiry.'
  );

  // Six specified categories under PRODUCT
  const productSubcategoriesList = [
    {
      id: 'cat-women',
      slug: 'women',
      label: t.catWomen || 'Women',
      gender: 'Women',
      desc: language === 'ha' ? 'Dogayen riguna, abaya, mayafai' : language === 'ar' ? 'فساتين، عبايات وأزياء محتشمة' : 'Elegant dresses, abayas & fashion'
    },
    {
      id: 'cat-men',
      slug: 'men',
      label: t.catMen || 'Men',
      gender: 'Men',
      desc: language === 'ha' ? 'Riguna, wanduna, shadda' : language === 'ar' ? 'قمصان، بناطيل وأزياء رجالية' : 'Classic shirts, trousers & native'
    },
    {
      id: 'cat-kids',
      slug: 'kids',
      label: t.catKids || 'Kids Collection',
      gender: 'Kids',
      desc: language === 'ha' ? 'Suturar yara maza da mata' : language === 'ar' ? 'ملابس وأحذية الأطفال' : 'Vibrant boys & girls outfits'
    },
    {
      id: 'cat-shoes',
      slug: 'shoes',
      label: t.catShoes || 'Shoes & Footwear',
      gender: 'all',
      desc: language === 'ha' ? 'Takalman motsi, silifas, heels' : language === 'ar' ? 'أحذية رياضية، رسمية وصنادل' : 'Sneakers, formal shoes & heels'
    },
    {
      id: 'cat-bags',
      slug: 'bags',
      label: t.catBags || 'Bags & Luggage',
      gender: 'all',
      desc: language === 'ha' ? 'Jakunkunan mata na zamani' : language === 'ar' ? 'حقائب يد، ظهر وسفر فاخرة' : 'Designer handbags & backpacks'
    },
    {
      id: 'cat-jewelry',
      slug: 'jewelry',
      label: t.catJewelry || 'Jewellery & Watches',
      gender: 'all',
      desc: language === 'ha' ? 'Agogo, awarwaro, zobuna' : language === 'ar' ? 'ساعات راقية ومجوهرات براقة' : 'Timeless watches & fine pieces'
    }
  ];

  const currentLangLabel = language === 'ha' ? 'Hausa' : language === 'ar' ? 'العربية' : 'English';

  return (
    <header className="sticky top-0 z-50 bg-[#07132B] shadow-2xl" dir={dir}>
      {/* 1. MAIN BRAND & UTILITIES BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* BRAND LOGO */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none shrink-0"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-md shadow-amber-500/20 bg-emerald-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="HABEEBATUSSUNNAH ONLINE BUSINESS Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.ibb.co/t0R6hKy/file-00000000d98082108f3f7ba387c29728.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors font-sans">
                HABEEBATUSSUNNAH
              </span>
              <span className="text-[8.5px] sm:text-[10px] font-extrabold tracking-[0.25em] text-amber-400 uppercase -mt-0.5">
                ONLINE BUSINESS
              </span>
            </div>
          </button>

          {/* ACTION UTILITIES RIGHT (LANGUAGE SELECTOR, SEARCH, WISHLIST, WHATSAPP, CART, MENU TOGGLE) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MULTILINGUAL SELECTOR DROPDOWN (DESKTOP & TABLET) */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/70 hover:border-amber-400 text-slate-200 hover:text-white transition-all text-xs font-bold cursor-pointer"
                title="Change language / Harshe / اللغة"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-extrabold text-[11px] sm:text-xs">{currentLangLabel}</span>
                <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-36 bg-[#0A1A3C] border border-blue-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-bold animate-in fade-in duration-100 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                  {[
                    { id: 'en', label: 'English', flag: '🇬🇧' },
                    { id: 'ha', label: 'Hausa', flag: '🇳🇬' },
                    { id: 'ar', label: 'العربية', flag: '🇸🇦' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setLanguage(item.id as Language);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        language === item.id
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>{item.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH ICON */}
            <button
              onClick={openSearch}
              className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title="Search store (Products, Categories, SKUs)"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-slate-200" />
            </button>

            {/* WISHLIST ICON */}
            {openWishlist && (
              <button
                onClick={openWishlist}
                className="relative p-2.5 text-slate-200 hover:text-rose-400 hover:bg-white/10 rounded-full transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                title="Saved Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-200" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* WHATSAPP ACTION BUTTON */}
            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 rounded-full transition-colors flex items-center justify-center"
              title="Direct WhatsApp (+2348034343283)"
              aria-label="WhatsApp Support"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

            {/* CART ICON WITH QUANTITY BADGE */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-white hover:text-sky-300 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title="View Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-slate-950 text-[11px] font-black h-5.5 min-w-5.5 px-1.5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-150">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="xl:hidden flex items-center gap-1.5 px-3 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors ml-1 font-bold text-xs cursor-pointer border border-blue-700/60"
              aria-label="Toggle All Categories & Pages Drawer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="text-[11px] font-black uppercase tracking-wider">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED MAIN NAVIGATION BAR WITH EXACT SPECIFIED SEQUENCE (10 ITEMS) */}
      <div className="bg-[#0A1B3B] border-t border-b border-blue-800/70 shadow-inner relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-start xl:justify-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto no-scrollbar py-2 sm:py-2.5 whitespace-nowrap text-white"
            aria-label="Main Navigation Menu"
          >
            {/* 1. HOME */}
            <button
              onClick={() => handleNavigate('home')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navHome || 'HOME'}
            </button>

            {/* 2. ABOUT */}
            <button
              onClick={() => handleNavigate('about')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'about'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navAbout || 'ABOUT'}
            </button>

            {/* 3. PRODUCT (WITH PROFESSIONAL SUBMENU CONTAINING THE 6 SUBCATEGORIES) */}
            <div
              className="relative"
              ref={dropdownContainerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedGender('all');
                    handleNavigate('products');
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-l-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                    currentView === 'products'
                      ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                      : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
                  }`}
                >
                  {t.navProducts || 'PRODUCT'}
                </button>
                <button
                  type="button"
                  onClick={() => setProductsDropdownOpen(prev => !prev)}
                  className={`px-1.5 py-1.5 rounded-r-lg text-xs transition-all cursor-pointer border-l border-blue-900/40 ${
                    currentView === 'products'
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-sky-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-expanded={productsDropdownOpen}
                  aria-label="Expand Product Submenu"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      productsDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* PRODUCT CATEGORIES DROPDOWN (6 SPECIFIED CATEGORIES) */}
              {productsDropdownOpen && (
                <div className={`absolute top-full mt-2 w-[92vw] max-w-[620px] bg-[#0A1A3C] border-2 border-blue-700/90 rounded-2xl shadow-2xl p-5 sm:p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                  {/* Submenu Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-800/80">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        {t.browseByCategory || 'Product Categories'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedGender('all');
                        handleNavigate('products');
                      }}
                      className="text-[11px] font-black text-sky-300 hover:text-white underline uppercase cursor-pointer"
                    >
                      {t.viewAllProducts || 'View All Products →'}
                    </button>
                  </div>

                  {/* The 6 Required Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productSubcategoriesList.map((cat, idx) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id, undefined, cat.gender)}
                        className="group flex items-start gap-3 p-3 rounded-xl bg-[#061229] hover:bg-blue-900/60 border border-blue-800/60 hover:border-amber-400/80 transition-all text-left cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded-lg bg-blue-950 border border-blue-700/60 text-amber-400 text-xs font-black flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-xs uppercase tracking-wide text-white group-hover:text-amber-300 transition-colors truncate">
                              {cat.label}
                            </h4>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-300 truncate mt-0.5">
                            {cat.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Fast Action Banner in Dropdown */}
                  <div className="mt-4 pt-3 border-t border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#040C1D] p-3 rounded-xl">
                    <span className="text-[11px] text-slate-300 font-medium text-center sm:text-left">
                      Looking for specific items? Enjoy rapid nationwide delivery to all Nigerian states.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('');
                        handleNavigate('products');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 shadow-xs cursor-pointer"
                    >
                      <span>Explore Store</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. NEW ARRIVAL */}
            <button
              onClick={() => handleNavigate('new-arrivals')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'new-arrivals'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <span>{t.navNewArrivals || 'NEW ARRIVAL'}</span>
            </button>

            {/* 5. PRIVACY POLICY */}
            <button
              onClick={() => handleNavigate('privacy')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'privacy'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navPrivacyPolicy || 'PRIVACY POLICY'}
            </button>

            {/* 6. TERMS & CONDITIONS */}
            <button
              onClick={() => handleNavigate('terms')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'terms'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navTermsConditions || 'TERMS & CONDITIONS'}
            </button>

            {/* 7. NATIONWIDE SHIPPING POLICY */}
            <button
              onClick={() => handleNavigate('shipping')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'shipping'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navNationwideShipping || 'NATIONWIDE SHIPPING POLICY'}
            </button>

            {/* 8. RETURN & EXCHANGE */}
            <button
              onClick={() => handleNavigate('returns')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'returns'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navReturnExchange || 'RETURN & EXCHANGE'}
            </button>

            {/* 9. TRACK ORDER / LOOKUP */}
            <button
              onClick={() => handleNavigate('order-lookup')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'order-lookup'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm font-black'
                  : 'text-emerald-300 hover:text-emerald-200 hover:bg-white/5'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.navTrackOrderLookup || 'TRACK ORDER / LOOKUP'}</span>
            </button>

            {/* 10. CONTACT US */}
            <button
              onClick={() => handleNavigate('contact')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[12.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-slate-100 hover:text-sky-300 hover:bg-white/5'
              }`}
            >
              {t.navContactUs || 'CONTACT US'}
            </button>
          </nav>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OVER DRAWER (ACCESSIBLE EXACT 10-ITEM SEQUENCE + PRODUCT SUBCATEGORIES) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative bg-[#07132B] text-white border-r border-blue-900/80 w-full max-w-sm h-full p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-emerald-950 flex items-center justify-center shrink-0">
                    <img
                      src="/logo.png"
                      alt="HABEEBATUSSUNNAH Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.ibb.co/t0R6hKy/file-00000000d98082108f3f7ba387c29728.png';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-white block">HABEEBATUSSUNNAH</span>
                    <span className="text-[9px] font-bold text-amber-400 tracking-widest block uppercase">Online Business</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Selection in Mobile Drawer */}
              <div className="p-2.5 bg-[#050D1E] rounded-xl border border-blue-900/60 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  Language / Harshe / اللغة
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold text-center">
                  {[
                    { id: 'en', label: 'English', flag: '🇬🇧' },
                    { id: 'ha', label: 'Hausa', flag: '🇳🇬' },
                    { id: 'ar', label: 'العربية', flag: '🇸🇦' }
                  ].map(lng => (
                    <button
                      key={lng.id}
                      type="button"
                      onClick={() => setLanguage(lng.id as Language)}
                      className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        language === lng.id
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm">{lng.flag}</span>
                      <span className="text-[11px]">{lng.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation List: EXACT 1-10 SEQUENCE */}
              <div className="flex flex-col space-y-1 text-xs sm:text-sm font-extrabold text-white">
                {/* 1. HOME */}
                <button
                  onClick={() => handleNavigate('home')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'home' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>1. {t.navHome || 'HOME'}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {/* 2. ABOUT */}
                <button
                  onClick={() => handleNavigate('about')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'about' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>2. {t.navAbout || 'ABOUT'}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {/* 3. PRODUCT (EXPANDABLE WITH THE 6 CATEGORIES) */}
                <div className="rounded-xl border border-blue-900/60 bg-[#061229] overflow-hidden my-0.5">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        handleNavigate('products');
                      }}
                      className="text-left font-black text-white hover:text-sky-300 cursor-pointer flex-1"
                    >
                      3. {t.navProducts || 'PRODUCT'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileCategoriesExpanded(prev => !prev)}
                      className="p-1 text-sky-400 hover:text-white cursor-pointer"
                      aria-label="Toggle Subcategories"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileCategoriesExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {mobileCategoriesExpanded && (
                    <div className="px-3 pb-2.5 pt-1 space-y-1 bg-[#040C1D] border-t border-blue-900/60">
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setSelectedGender('all');
                          handleNavigate('products');
                        }}
                        className="w-full text-left text-xs font-black text-amber-300 py-1.5 hover:underline cursor-pointer flex items-center justify-between"
                      >
                        <span>→ {t.viewAllProducts || 'View All Products'}</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>

                      {productSubcategoriesList.map((cat, idx) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id, undefined, cat.gender)}
                          className="w-full text-left text-xs font-bold text-slate-300 py-1.5 px-2 hover:bg-white/10 rounded-lg hover:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">• {cat.label}</span>
                          <span className="text-[10px] text-sky-300 font-semibold">{cat.desc.slice(0, 16)}...</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. NEW ARRIVAL */}
                <button
                  onClick={() => handleNavigate('new-arrivals')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                    currentView === 'new-arrivals' ? 'bg-amber-400 text-slate-950 font-black' : 'text-amber-300 hover:bg-white/5'
                  }`}
                >
                  <span>4. {t.navNewArrivals || 'NEW ARRIVAL'}</span>
                </button>

                {/* 5. PRIVACY POLICY */}
                <button
                  onClick={() => handleNavigate('privacy')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'privacy' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>5. {t.navPrivacyPolicy || 'PRIVACY POLICY'}</span>
                  <ShieldCheck className="w-4 h-4 opacity-50" />
                </button>

                {/* 6. TERMS & CONDITIONS */}
                <button
                  onClick={() => handleNavigate('terms')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'terms' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>6. {t.navTermsConditions || 'TERMS & CONDITIONS'}</span>
                  <FileText className="w-4 h-4 opacity-50" />
                </button>

                {/* 7. NATIONWIDE SHIPPING POLICY */}
                <button
                  onClick={() => handleNavigate('shipping')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'shipping' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>7. {t.navNationwideShipping || 'NATIONWIDE SHIPPING POLICY'}</span>
                  <Truck className="w-4 h-4 opacity-50" />
                </button>

                {/* 8. RETURN & EXCHANGE */}
                <button
                  onClick={() => handleNavigate('returns')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'returns' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>8. {t.navReturnExchange || 'RETURN & EXCHANGE'}</span>
                  <RefreshCw className="w-4 h-4 opacity-50" />
                </button>

                {/* 9. TRACK ORDER / LOOKUP */}
                <button
                  onClick={() => handleNavigate('order-lookup')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'order-lookup' ? 'bg-emerald-400 text-slate-950 font-black' : 'text-emerald-300 hover:bg-white/5'
                  }`}
                >
                  <span>9. {t.navTrackOrderLookup || 'TRACK ORDER / LOOKUP'}</span>
                  <Package className="w-4 h-4 text-emerald-400" />
                </button>

                {/* 10. CONTACT US */}
                <button
                  onClick={() => handleNavigate('contact')}
                  className={`text-left py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    currentView === 'contact' ? 'bg-sky-400 text-slate-950 font-black' : 'hover:bg-white/5 text-slate-100'
                  }`}
                >
                  <span>10. {t.navContactUs || 'CONTACT US'}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>
            </div>

            {/* Mobile Drawer Footer Support */}
            <div className="pt-5 border-t border-blue-900/60 space-y-2.5">
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp (+2348034343283)</span>
              </a>
              <div className="text-center text-[11px] text-slate-400 font-medium">
                Customer Care: {settings.phone_number} / {settings.secondary_phone}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
