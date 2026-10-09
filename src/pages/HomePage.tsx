import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { HeroBottomSection } from '../components/HeroBottomSection';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Heart, MessageCircle, Truck } from 'lucide-react';
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
  const { products, settings } = useShop();

  // New arrivals (is_new_arrival = true)
  const newArrivals = products.filter(p => p.is_new_arrival && p.status === 'active').slice(0, 4);

  // Featured products (is_featured = true)
  const featuredProducts = products.filter(p => p.is_featured && p.status === 'active').slice(0, 8);

  const whatsappUrl = createGeneralWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Habeevatussunnah Online Business! I would like to inquire about placing an order.'
  );

  return (
    <div className="space-y-0">
      {/* 1. High-End Fashion Hero Section */}
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

      {/* 2. Professionally Redesigned Hero Bottom Section (White & Premium Brand Colours) */}
      <HeroBottomSection
        onScrollToCategories={() => {
          const el = document.getElementById('featured-categories');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Featured Categories Showcase */}
      <FeaturedCategories
        onSelectCategory={(catId, gender) => {
          onSelectCategory(catId, gender);
          onNavigate('products');
        }}
      />

      {/* 4. Persuasive & Stylish Promotional Spotlight Banner with SHOP NOW Button */}
      <PromotionalBanner
        onShopNow={() => onNavigate('products')}
        onExploreNewArrivals={() => onNavigate('new-arrivals')}
      />

      {/* 5. New Arrivals Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>FRESHLY CURATED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-sans">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('new-arrivals')}
              className="text-xs font-black uppercase tracking-wider text-blue-900 hover:text-blue-700 flex items-center gap-1.5 group"
            >
              <span>Explore New Releases</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Products Section (DIRECTLY BELOW NEW ARRIVALS) */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-700 block mb-1">
                TOP PICKS & BESTSELLERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-sans">
                Featured Products
              </h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-black uppercase tracking-wider text-blue-900 hover:text-blue-700 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>View Complete Store</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Promotional VIP Concierge Banner (PRIVACY COMPLIANT: NO ACCOUNT NUMBERS) */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                Personalized Service
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                Direct WhatsApp Order Fulfillment & Fast Nationwide Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Shop with confidence. Browse our boutique, select your sizes, and experience smooth bank transfer checkout with instant verification on WhatsApp. Our customer support desk is active and ready to assist you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('products')}
                className="px-7 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-sky-50 shadow-md text-center transition-all cursor-pointer"
              >
                Shop All Collections
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md text-center transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
