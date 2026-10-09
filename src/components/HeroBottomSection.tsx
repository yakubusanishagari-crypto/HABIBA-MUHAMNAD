import React from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';

interface HeroBottomSectionProps {
  onScrollToCategories?: () => void;
}

export const HeroBottomSection: React.FC<HeroBottomSectionProps> = ({
  onScrollToCategories
}) => {
  const brandPillars = [
    {
      icon: ShieldCheck,
      badge: 'VERIFIED QUALITY',
      title: 'Hand-Inspected Excellence',
      description: 'Every garment, footwear piece, and accessory undergoes rigorous hand-inspection for authentic craftsmanship and flawless finishing before dispatch.',
      accentColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconBoxBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      pillBorder: 'group-hover:border-emerald-300'
    },
    {
      icon: Truck,
      badge: 'ALL 36 STATES & FCT',
      title: 'Express Nationwide Logistics',
      description: 'Fast, secure doorstep delivery across Lagos, Abuja, Kano, Port Harcourt, and every state in Nigeria with comprehensive stage-by-stage order tracking.',
      accentColor: 'text-blue-800',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      iconBoxBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      pillBorder: 'group-hover:border-blue-300'
    },
    {
      icon: CreditCard,
      badge: 'SECURE CHECKOUT',
      title: 'Seamless OPay & Bank Transfer',
      description: 'Enjoy effortless payment via verified bank transfers with zero hidden surcharges and instant downloadable PDF invoice receipts for every confirmed order.',
      accentColor: 'text-amber-800',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
      iconBoxBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      pillBorder: 'group-hover:border-amber-300'
    },
    {
      icon: MessageCircle,
      badge: 'VIP CONCIERGE',
      title: 'Direct WhatsApp Order Desk',
      description: 'Personalized customer care, sizing assistance, and instant order verification directly with Habeevatussunnah support on WhatsApp (+2348034343283).',
      accentColor: 'text-teal-800',
      badgeBg: 'bg-teal-50 text-teal-900 border-teal-200/80',
      iconBoxBg: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      pillBorder: 'group-hover:border-teal-300'
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] py-14 sm:py-20 border-b border-slate-200/80 overflow-hidden">
      {/* Subtle ambient decorative accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-900/20 to-transparent" />
      <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Elegant White & Brand Colours Composition */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] font-black uppercase tracking-widest text-[#07132B]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>The Habeevatussunnah Standard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
            Curated For Distinction,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-800 to-emerald-700">
              Delivered With Care
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover Nigeria’s refined online boutique experience. We combine hand-selected fashion, modest luxury, verified transfer payments, and responsive customer support.
          </p>
        </div>

        {/* 4 Pillars Grid: Crisp White Cards with High-End Detailing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {brandPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(7,19,43,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(7,19,43,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBoxBg} flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[9.5px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans mb-2 group-hover:text-blue-950 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Trust Micro-Detail */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Guaranteed by Habeevatussunnah</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Polished Visual Bridge connecting naturally to Featured Categories */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 block font-sans">
                SIGNATURE DEPARTMENTS & WARDROBE ESSENTIALS
              </span>
              <span className="text-xs text-slate-500">
                Browse our curated catalogue crafted for women, men, and children.
              </span>
            </div>
          </div>

          {onScrollToCategories && (
            <button
              onClick={onScrollToCategories}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer group shrink-0"
            >
              <span>Explore Categories Below</span>
              <ArrowDown className="w-3.5 h-3.5 text-sky-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
