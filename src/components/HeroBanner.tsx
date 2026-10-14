import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { HERO_BACKGROUND_CONFIGS } from '../data/heroBackgrounds';
import { HeroBackgroundOption } from '../types';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreCollection: () => void;
  onSelectCategoryChip?: (catId: string, gender?: string) => void;
  onNavigate?: (view: string) => void;
  previewBackground?: HeroBackgroundOption;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onExploreCollection,
  onSelectCategoryChip,
  onNavigate,
  previewBackground
}) => {
  const { language, dir, t, settings } = useShop();

  const activeHeroBgId = previewBackground || settings.hero_background || 'royal_emerald';
  const bgConfig = HERO_BACKGROUND_CONFIGS[activeHeroBgId] || HERO_BACKGROUND_CONFIGS.royal_emerald;

  return (
    <section className={`relative overflow-hidden ${bgConfig.gradientClass} py-14 sm:py-20 lg:py-28 border-b ${bgConfig.borderClass} text-white transition-colors duration-500`} dir={dir}>
      {/* Opulent Atmospheric Lighting & Glow Orbs */}
      <div className={`absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full ${bgConfig.orb1Class} blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-0 left-8 -mb-20 w-96 h-96 rounded-full ${bgConfig.orb2Class} blur-3xl pointer-events-none`} />
      <div className={`absolute top-1/2 left-1/3 w-72 h-72 rounded-full ${bgConfig.orb3Class} blur-3xl pointer-events-none`} />

      {/* Subtle Luxury Geometric Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT EDITORIAL COLUMN (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Prestigious Brand Kicker / Status Pill */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bgConfig.kickerBgClass} text-[10.5px] sm:text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-md`}>
              <span className="text-amber-300">HABEEVATUSSUNNAH</span>
              <span className="text-amber-500/60">|</span>
              <span className="text-white/95">
                {language === 'ha'
                  ? 'BABBAN SHAGON KASUWANCI NA NAJERIYA'
                  : language === 'ar'
                  ? 'المتجر الإلكتروني الرائد في نيجيريا'
                  : "NIGERIA'S PREMIER ONLINE BOUTIQUE"}
              </span>
            </div>

            {/* Compelling Headline with High Luxury Visual Hierarchy */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-sans">
                {language === 'ha' ? (
                  <>
                    ZABABBUN SUTURA & <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif-display italic font-semibold">
                      KAMALA MAI DOREWA.
                    </span>
                  </>
                ) : language === 'ar' ? (
                  <>
                    أزياء مختارة بعناية & <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif-display italic font-semibold">
                      أناقة راقية تدوم.
                    </span>
                  </>
                ) : (
                  <>
                    CURATED FASHION & <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-serif-display italic font-semibold">
                      TIMELESS ELEGANCE.
                    </span>
                  </>
                )}
              </h1>
              <p className={`text-sm sm:text-base lg:text-lg ${bgConfig.subtextColor} max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal pt-1`}>
                {t.heroSubhead ||
                  'Discover refined modest wear, contemporary dresses, tailored men apparel, charming kids wardrobes, luxury footwear, designer bags, and beauty essentials — delivered directly to your door across Nigeria.'}
              </p>
            </div>

            {/* CTAs: SHOP NOW & EXPLORE COLLECTION */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                type="button"
                onClick={onShopNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-emerald-950/80 hover:shadow-amber-400/30 transition-all duration-200 active:scale-[0.99] group cursor-pointer"
              >
                <span>{t.shopNow || 'SHOP NOW'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExploreCollection}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/25 hover:border-amber-300 text-white font-black text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-200 cursor-pointer"
              >
                <span>{t.exploreCollection || 'EXPLORE COLLECTION'}</span>
              </button>
            </div>

            {/* Quick Department Discovery Chips */}
            <div className="pt-2">
              <span className="text-[10.5px] font-black uppercase tracking-widest text-amber-300/90 block mb-2 text-center lg:text-left">
                {language === 'ha' ? 'Shahararrun Bangarori:' : language === 'ar' ? 'الأقسام الأكثر طلباً:' : 'Popular Departments:'}
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {[
                  { label: t.catWomen || "Women's Wear", catId: 'cat-women', gender: 'Women' },
                  { label: t.catMen || "Men's Fashion", catId: 'cat-men', gender: 'Men' },
                  { label: t.catKids || "Kids Collection", catId: 'cat-kids', gender: 'Kids' },
                  { label: t.catShoes || "Footwear & Shoes", catId: 'cat-shoes' },
                  { label: t.catBags || "Bags & Purses", catId: 'cat-bags' },
                  { label: t.catJewelry || "Jewelry & Beauty", catId: 'cat-jewelry' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onSelectCategoryChip) {
                        onSelectCategoryChip(chip.catId, chip.gender);
                      } else {
                        onShopNow();
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-400/25 text-emerald-100 hover:text-white text-xs font-bold border border-white/15 hover:border-amber-400/50 backdrop-blur-xs transition-all cursor-pointer shadow-xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Highlights Grid Beneath Copy: FULLY FUNCTIONAL BUTTONS */}
            <div className={`pt-6 border-t ${bgConfig.borderClass} grid grid-cols-2 sm:grid-cols-4 gap-3 text-center lg:text-left`}>
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('shipping');
                  else onExploreCollection();
                }}
                className={`p-3 rounded-2xl ${bgConfig.cardBgClass} hover:bg-white/20 active:scale-[0.98] transition-all space-y-1 text-center lg:text-left cursor-pointer border border-white/10 hover:border-amber-400/40`}
                title="View Nationwide Shipping Details"
              >
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-amber-400">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {language === 'ha' ? 'Najeriya' : language === 'ar' ? 'كافة الولايات' : 'Nationwide'}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">
                  {language === 'ha' ? 'Isarwa cikin sauri' : language === 'ar' ? 'توصيل سريع وموثوق' : 'Fast delivery in Nigeria'}
                </p>
              </button>

              <button
                type="button"
                onClick={onShopNow}
                className={`p-3 rounded-2xl ${bgConfig.cardBgClass} hover:bg-white/20 active:scale-[0.98] transition-all space-y-1 text-center lg:text-left cursor-pointer border border-white/10 hover:border-amber-400/40`}
                title="Browse Verified Authentic Collection"
              >
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-amber-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {language === 'ha' ? 'Inganci' : language === 'ar' ? 'الجودة' : 'Quality'}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">
                  {language === 'ha' ? 'Kayan asali 100%' : language === 'ar' ? 'أصلي ومفحوص 100%' : '100% Inspected authentic'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('terms');
                  else onShopNow();
                }}
                className={`p-3 rounded-2xl ${bgConfig.cardBgClass} hover:bg-white/20 active:scale-[0.98] transition-all space-y-1 text-center lg:text-left cursor-pointer border border-white/10 hover:border-amber-400/40`}
                title="View Bank Transfer & Payment Protection"
              >
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-amber-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {language === 'ha' ? 'Banki' : language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">
                  {language === 'ha' ? 'Biyan kudi ta OPAY' : language === 'ar' ? 'دفع ميسر عبر أوباي' : 'Smooth OPAY checkout'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('order-lookup');
                  else onShopNow();
                }}
                className={`p-3 rounded-2xl ${bgConfig.cardBgClass} hover:bg-white/20 active:scale-[0.98] transition-all space-y-1 text-center lg:text-left cursor-pointer border border-white/10 hover:border-amber-400/40`}
                title="Track Live Order Status"
              >
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-amber-400">
                  <Package className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {language === 'ha' ? 'Binciken Oda' : language === 'ar' ? 'تتبع الطلب' : 'Order Tracking'}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">
                  {language === 'ha' ? 'Duba matsayin odarka' : language === 'ar' ? 'متابعة الشحنة مباشرة' : 'Check live fulfillment'}
                </p>
              </button>
            </div>
          </div>

          {/* RIGHT EDITORIAL HERO VISUAL (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl shadow-black/80 bg-slate-900 aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
                  alt="Habeevatussunnah Luxury Modest Fashion Collection"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge on Image */}
                <div className={`absolute bottom-5 left-5 right-5 p-4 rounded-2xl ${bgConfig.cardBgClass} backdrop-blur-md border border-amber-400/50 shadow-xl flex items-center justify-between`}>
                  <div>
                    <span className="text-[9.5px] font-black uppercase tracking-widest text-amber-300 block">
                      HABEEVATUSSUNNAH 2026
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {language === 'ha' ? 'Zababbun Kayan Zamani' : language === 'ar' ? 'أفخر التشكيلات المعاصرة' : 'Ready-To-Wear Elegance'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={onShopNow}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black hover:from-amber-300 hover:to-yellow-300 transition-colors cursor-pointer shadow-md"
                    aria-label="Shop Ready To Wear"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
