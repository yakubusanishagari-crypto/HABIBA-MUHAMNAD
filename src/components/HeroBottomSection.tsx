import React from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Package,
  Phone,
  FileText
} from 'lucide-react';

interface HeroBottomSectionProps {
  onScrollToCategories?: () => void;
  onNavigate?: (view: string) => void;
  onSelectCategory?: (categoryId: string, gender?: string) => void;
}

export const HeroBottomSection: React.FC<HeroBottomSectionProps> = ({
  onScrollToCategories,
  onNavigate,
  onSelectCategory
}) => {
  const brandPillars = [
    {
      icon: ShieldCheck,
      badge: 'VERIFIED QUALITY',
      title: 'Hand-Inspected Excellence',
      description: 'Every garment, footwear piece, and accessory undergoes rigorous inspection for authentic fabrics, stitching, and finishing before dispatch.',
      accentColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconBoxBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      primaryActionLabel: 'Explore Quality Collection',
      onPrimaryAction: () => (onNavigate ? onNavigate('products') : onScrollToCategories?.()),
      secondaryActionLabel: 'About Standards',
      onSecondaryAction: () => onNavigate && onNavigate('about')
    },
    {
      icon: Truck,
      badge: 'ALL 36 STATES & FCT',
      title: 'Express Nationwide Logistics',
      description: 'Fast, secure doorstep delivery across Lagos, Abuja, Kano, Port Harcourt, and every state in Nigeria with stage-by-stage fulfillment.',
      accentColor: 'text-blue-800',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      iconBoxBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      primaryActionLabel: 'Track Your Order',
      onPrimaryAction: () => onNavigate && onNavigate('order-lookup'),
      secondaryActionLabel: 'Shipping Rates & Time',
      onSecondaryAction: () => onNavigate && onNavigate('shipping')
    },
    {
      icon: CreditCard,
      badge: 'SECURE CHECKOUT',
      title: 'Seamless OPay & Bank Transfer',
      description: 'Enjoy effortless payment via verified bank transfer with zero hidden surcharges and instant downloadable PDF invoice receipts for every confirmed order.',
      accentColor: 'text-amber-800',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
      iconBoxBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      primaryActionLabel: 'Payment & Transfer Terms',
      onPrimaryAction: () => onNavigate && onNavigate('terms'),
      secondaryActionLabel: 'Browse All Products',
      onSecondaryAction: () => onNavigate && onNavigate('products')
    },
    {
      icon: Headphones,
      badge: 'CUSTOMER CARE',
      title: 'Direct Order Desk & Inquiries',
      description: 'Personalized customer care, sizing assistance, and order verification directly with Habeevatussunnah support on our dedicated line (08034343283).',
      accentColor: 'text-teal-800',
      badgeBg: 'bg-teal-50 text-teal-900 border-teal-200/80',
      iconBoxBg: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      primaryActionLabel: 'Contact Support Desk',
      onPrimaryAction: () => onNavigate && onNavigate('contact'),
      secondaryActionLabel: 'Direct Call: 08034343283',
      isPhoneCall: true
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] py-14 sm:py-20 border-b border-slate-200/80 overflow-hidden">
      {/* Subtle ambient decorative accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-900/20 to-transparent" />
      <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('about')}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-800 shadow-xs text-[11px] font-black uppercase tracking-widest text-[#07132B] transition-colors cursor-pointer"
            title="Learn about our brand standards"
          >
            <span>The Habeevatussunnah Standard</span>
          </button>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
            Curated For Distinction,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600">
              Delivered With Care
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover Nigeria’s refined online boutique experience. We combine hand-selected fashion, modest luxury, verified transfer payments, and responsive customer support.
          </p>
        </div>

        {/* 4 Pillars Grid: Crisp White Cards with FULLY FUNCTIONAL ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {brandPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(7,19,43,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(7,19,43,0.12)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <button
                      type="button"
                      onClick={item.onPrimaryAction}
                      className={`w-12 h-12 rounded-xl ${item.iconBoxBg} flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105 cursor-pointer`}
                      title={`Open ${item.title}`}
                      aria-label={`Open ${item.title}`}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={item.onPrimaryAction}
                      className={`text-[9.5px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${item.badgeBg} hover:opacity-80 transition-opacity cursor-pointer`}
                      title={`Go to ${item.title}`}
                    >
                      {item.badge}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={item.onPrimaryAction}
                    className="text-left w-full cursor-pointer focus:outline-none group/title"
                  >
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans mb-2 group-hover/title:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                  </button>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Action Area: REAL FUNCTIONAL BUTTONS */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={item.onPrimaryAction}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-between transition-colors shadow-xs group/btn cursor-pointer"
                  >
                    <span>{item.primaryActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>

                  {item.isPhoneCall ? (
                    <a
                      href="tel:+2348034343283"
                      className="w-full py-1.5 px-3 rounded-lg text-slate-600 hover:text-emerald-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{item.secondaryActionLabel}</span>
                    </a>
                  ) : item.secondaryActionLabel && item.onSecondaryAction ? (
                    <button
                      type="button"
                      onClick={item.onSecondaryAction}
                      className="w-full py-1.5 px-3 rounded-lg text-slate-600 hover:text-blue-900 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{item.secondaryActionLabel}</span>
                    </button>
                  ) : null}

                  {/* Trust Micro-Detail */}
                  <button
                    type="button"
                    onClick={item.onPrimaryAction}
                    className="pt-2 flex items-center gap-1.5 text-[10.5px] font-medium text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer text-left w-full"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Guaranteed by Habeevatussunnah</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Polished Visual Bridge connecting naturally to Featured Categories with Working Department Buttons */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-slate-200/80 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 block font-sans">
                  SIGNATURE DEPARTMENTS & WARDROBE ESSENTIALS
                </span>
                <span className="text-xs text-slate-500">
                  Select a category directly or explore our full collection below.
                </span>
              </div>
            </div>

            {onScrollToCategories && (
              <button
                type="button"
                onClick={onScrollToCategories}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer group shrink-0"
              >
                <span>Explore Categories Below</span>
                <ArrowDown className="w-3.5 h-3.5 text-sky-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Quick Clickable Department Filters */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            {[
              { label: "Women's Collection", catId: 'cat-women', gender: 'Women' },
              { label: "Men's Fashion", catId: 'cat-men', gender: 'Men' },
              { label: "Kids Wardrobe", catId: 'cat-kids', gender: 'Kids' },
              { label: "Footwear & Shoes", catId: 'cat-shoes', gender: 'all' },
              { label: "Bags & Luggage", catId: 'cat-bags', gender: 'all' },
              { label: "Jewelry & Beauty", catId: 'cat-jewelry', gender: 'all' },
              { label: "Home Essentials", catId: 'cat-home', gender: 'all' }
            ].map((dept, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(dept.catId, dept.gender);
                  }
                  if (onNavigate) {
                    onNavigate('products');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-700 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {dept.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory('', 'all');
                }
                if (onNavigate) {
                  onNavigate('products');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>View All Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
