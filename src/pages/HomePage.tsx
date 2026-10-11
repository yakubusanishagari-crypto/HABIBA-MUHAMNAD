import React, { useRef, useState, useEffect, useMemo } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { HeroBottomSection } from '../components/HeroBottomSection';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import {
  ArrowRight,
  ShieldCheck,
  Heart,
  MessageCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';
import { createGeneralWhatsAppUrl } from '../utils/formatters';

interface HomePageProps {
  onViewProduct: (product: Product) => void;
  onNavigate: (view: string) => void;
  onSelectCategory: (categoryId: string, gender?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onViewProduct,
  onNavigate,
  onSelectCategory
}) => {
  const { products, settings, language, t } = useShop();

  // Carousel scroll ref and state for New Arrivals
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 1. New Arrivals: Active & in-stock products
  const newArrivals = useMemo(() => {
    const arrivals = products.filter(
      p => p.status === 'active' && p.stock > 0 && p.is_new_arrival
    );
    if (arrivals.length >= 3) return arrivals;
    // Fallback: Latest active in-stock products if few are explicitly flagged
    return products.filter(p => p.status === 'active' && p.stock > 0).slice(0, 10);
  }, [products]);

  // 2. Featured Products: Currently genuinely available products only (status === 'active' && stock > 0)
  const availableFeaturedProducts = useMemo(() => {
    const featured = products.filter(
      p => p.status === 'active' && p.stock > 0 && p.is_featured
    );
    if (featured.length > 0) return featured.slice(0, 8);
    // If none flagged as featured, show available active in-stock items
    return products.filter(p => p.status === 'active' && p.stock > 0).slice(0, 8);
  }, [products]);

  // Check scroll positions with requestAnimationFrame throttle to avoid re-render storms
  const isUpdatingRef = useRef(false);
  const updateScrollButtons = () => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    requestAnimationFrame(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
      isUpdatingRef.current = false;
    });
  };

  useEffect(() => {
    updateScrollButtons();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons, { passive: true });
      return () => {
        el.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [newArrivals]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const whatsappUrl = createGeneralWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Habeevatussunnah Online Business! I would like to inquire about placing an order.'
  );

  return (
    <div className="space-y-0 antialiased transform-gpu">
      {/* 1. High-End Fashion Hero Section */}
      <div className="relative transform-gpu">
        <HeroBanner
          onShopNow={() => onNavigate('products')}
          onExploreCollection={() => {
            const el = document.getElementById('featured-categories');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectCategoryChip={(catId, gender) => {
            onSelectCategory(catId, gender);
            onNavigate('products');
          }}
        />
      </div>

      {/* 2. Professionally Redesigned Hero Bottom Section (White & Premium Brand Colours) */}
      <div className="relative transform-gpu">
        <HeroBottomSection
          onScrollToCategories={() => {
            const el = document.getElementById('featured-categories');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* 3. Featured Categories Showcase */}
      <div className="relative transform-gpu">
        <FeaturedCategories
          onSelectCategory={(catId, gender) => {
            onSelectCategory(catId, gender);
            onNavigate('products');
          }}
        />
      </div>

      {/* 4. Persuasive & Stylish Promotional Spotlight Banner with SHOP NOW Button */}
      <div className="relative transform-gpu">
        <PromotionalBanner
          onShopNow={() => onNavigate('products')}
          onExploreNewArrivals={() => onNavigate('new-arrivals')}
        />
      </div>

      {/* 5. New Arrivals Section: HORIZONTALLY SCROLLABLE CAROUSEL */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Carousel Arrow Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-800 mb-1.5">
                <span>
                  {language === 'ha'
                    ? 'SABBIN KAYAYYAKI'
                    : language === 'ar'
                    ? 'وصل حديثاً'
                    : 'FRESHLY CURATED'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-sans">
                {t.navNewArrivals || 'New Arrivals'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
                {language === 'ha'
                  ? 'Kayan da suka shigo shagonmu a wannan mako. Zaku iya tura gefe domin ganin sauran.'
                  : language === 'ar'
                  ? 'أحدث التشكيلات الحصرية الواصلة إلى متجرنا. اسحب أفقيًا لاستكشاف المزيد.'
                  : 'Swipe or use the arrows to explore the latest modest fashion, shoes, bags & lifestyle releases.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Carousel Previous / Next Controls on Desktop & Mobile */}
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Scroll New Arrivals left"
                title="Previous products"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shadow-xs cursor-pointer"
                aria-label="Scroll New Arrivals right"
                title="Next products"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('new-arrivals')}
                className="ml-2 text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-700 flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-emerald-50 transition-colors group cursor-pointer"
              >
                <span className="hidden sm:inline">
                  {language === 'ha'
                    ? 'Duba Duka'
                    : language === 'ar'
                    ? 'عرض الكل'
                    : 'Explore All'}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Carousel */}
          {newArrivals.length > 0 ? (
            <div
              ref={carouselRef}
              className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-4 sm:gap-6 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newArrivals.map(product => (
                <div
                  key={product.id}
                  className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
                >
                  <ProductCard
                    product={product}
                    onViewProduct={onViewProduct}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-6 text-center bg-slate-50 rounded-3xl border border-slate-200 max-w-md mx-auto space-y-3">
              <Package className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900">New Collections In Transit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our latest seasonal pieces are being cataloged. Explore our full catalog to discover available modest fashion.
              </p>
              <button
                onClick={() => onNavigate('products')}
                className="mt-2 px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Browse Available Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Featured Products Section: SHOWING AVAILABLE PRODUCTS ONLY */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 block mb-1">
                {language === 'ha'
                  ? 'ZABBABBU & MASU YAYI'
                  : language === 'ar'
                  ? 'المنتجات المختارة والأكثر طلبًا'
                  : 'AVAILABLE BESTSELLERS & TOP PICKS'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-sans">
                {t.featuredProductsTitle || 'Featured Products'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'ha'
                  ? 'Kayan da ake da su a rumbun ajiya a halin yanzu domin isarwa nan take.'
                  : language === 'ar'
                  ? 'المنتجات المتوفرة حالياً في المخزون والجاهزة للشحن الفوري.'
                  : 'Currently available in-stock items ready for immediate order confirmation & dispatch.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-700 flex items-center gap-1.5 group cursor-pointer py-2 px-3 rounded-xl hover:bg-emerald-100/50 transition-colors"
            >
              <span>{t.viewAllProducts || 'View Complete Store'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {availableFeaturedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {availableFeaturedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={onViewProduct}
                />
              ))}
            </div>
          ) : (
            /* Professional Empty State when no products match available criteria */
            <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/90 max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 font-sans">
                {language === 'ha'
                  ? 'Ana Sabunta Kayayyakin Shago'
                  : language === 'ar'
                  ? 'جاري تحديث قائمة المنتجات المتوفرة'
                  : 'Inventory Refreshing'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {language === 'ha'
                  ? 'Dukkan zabbabbun kayan an kusa cika su da sabbin kayayyaki. Kuna iya duba duka kayan shagonmu ko tuntubarmu a WhatsApp.'
                  : language === 'ar'
                  ? 'يتم حالياً إعادة تجهيز التشكيلات المختارة. يرجى تصفح المتجر الكامل أو التواصل المباشر عبر واتساب.'
                  : 'All featured items are currently in high demand and being restocked. Browse our complete catalogue or contact our team directly for custom orders.'}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Explore All Collections
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp Inquiries</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. Promotional VIP Concierge Banner */}
      <section className="py-16 bg-gradient-to-br from-[#064E3B] via-[#043327] to-[#021F17] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                Personalized Service & Trust
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Direct WhatsApp Order Fulfillment & Fast Nationwide Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                Shop with confidence. Browse our boutique, select your sizes, and experience smooth bank transfer checkout with instant verification on WhatsApp. Our customer support desk is active and ready to assist you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('products')}
                className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-50 shadow-md text-center transition-all cursor-pointer"
              >
                Shop All Collections
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-md text-center transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current text-amber-300" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
