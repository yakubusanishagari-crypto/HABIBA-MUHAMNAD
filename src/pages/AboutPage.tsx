import React from 'react';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Truck,
  Globe,
  Award,
  Users,
  ShoppingBag,
  MessageCircle,
  FileText,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Language } from '../types';
import { OFFICIAL_LOGO_URL, OFFICIAL_LOGO_REMOTE } from '../utils/imageUpload';

interface AboutPageProps {
  onShopNow: () => void;
  onContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onShopNow, onContact }) => {
  const { settings, t, language, setLanguage, dir } = useShop();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="py-12 bg-white min-h-screen text-slate-800" dir={dir}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Language Switcher Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Globe className="w-4 h-4 text-blue-700" />
            <span>{t.language || 'Language'}:</span>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  language === lang.code
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Brand Hero Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-100 inline-block">
            {settings.business_name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {t.aboutTitle || `ABOUT ${settings.business_name}`}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.aboutSubtitle}
          </p>
        </div>

        {/* 2. Who We Are & Official Brand Showcase */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Prominent Official Logo - 250-350px on desktop, 180-250px on mobile */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative group">
                {/* Subtle ambient luxury gold/emerald aura */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/20 via-amber-400/25 to-emerald-700/20 rounded-3xl blur-lg opacity-85 group-hover:opacity-100 transition-opacity" />

                {/* Logo Frame: Pristine white canvas with gold & emerald border, preserving proportions */}
                <div className="relative w-[190px] sm:w-[230px] md:w-[280px] lg:w-[320px] bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-400/70 shadow-xl flex items-center justify-center">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="HABEEBATUSSUNNAH ONLINE BUSINESS Official Logo"
                    className="w-full h-auto object-contain max-h-[250px] sm:max-h-[290px] lg:max-h-[330px] drop-shadow-sm select-none"
                    onError={e => {
                      (e.target as HTMLImageElement).src = OFFICIAL_LOGO_REMOTE;
                    }}
                  />
                </div>
              </div>

              {/* Verified Trademark Badge */}
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Official Brand Trademark</span>
              </div>
            </div>

            {/* Description Text Column */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-900 font-black text-xl">
                <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
                <h2>{t.whoWeAre || 'Who We Are'}</h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {t.whoWeAreText}
              </p>

              {/* Trust Pillars */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Quality Inspected</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-100">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Nigeria Express Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-100">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Premium Modest Collections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {t.ourMission || 'Our Mission'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.ourMissionText}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {t.ourVision || 'Our Vision'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.ourVisionText}
            </p>
          </div>
        </div>

        {/* 4. Core Values */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {t.ourValuesTitle || 'Our Core Values'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Award,
                title: t.valueQualityTitle || 'Authentic Quality',
                desc: t.valueQualityDesc || 'Every garment and accessory is hand-inspected before packaging.'
              },
              {
                icon: ShieldCheck,
                title: t.valueTrustTitle || 'Transparency & Trust',
                desc: t.valueTrustDesc || 'Honest pricing with straightforward bank transfer and verified confirmations.'
              },
              {
                icon: Users,
                title: t.valueCustomerTitle || 'Customer-Centric Care',
                desc: t.valueCustomerDesc || 'Personal attention on WhatsApp (+2348034343283) and dedicated phone lines.'
              },
              {
                icon: Truck,
                title: t.valueDeliveryTitle || 'Nationwide Logistics',
                desc: t.valueDeliveryDesc || 'Dependable dispatch to every doorstep or pickup station in Nigeria.'
              }
            ].map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{val.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Product Range */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-1">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.productRangeTitle || 'Our Product Range'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t.productRangeDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-1">Women’s Fashion & Modesty</strong>
                <p className="text-slate-300 leading-relaxed">{t.productRangeWomen}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-1">Men’s Modern Wardrobe</strong>
                <p className="text-slate-300 leading-relaxed">{t.productRangeMen}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-1">Kids & Teen Collection</strong>
                <p className="text-slate-300 leading-relaxed">{t.productRangeKids}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold mb-1">Lifestyle & Home Essentials</strong>
                <p className="text-slate-300 leading-relaxed">{t.productRangeLifestyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Commitment to Customer Satisfaction */}
        <div className="bg-blue-900 text-white p-8 sm:p-10 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-sky-300 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Our Customer Promise</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black">
            {t.satisfactionTitle || 'Our Commitment to Customer Satisfaction'}
          </h3>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-3xl">
            {t.satisfactionText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              t.satisfactionPledge1,
              t.satisfactionPledge2,
              t.satisfactionPledge3
            ].map((pledge, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-700/50 flex items-center gap-2.5 text-xs font-bold text-sky-200"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{pledge}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={onShopNow}
              className="px-7 py-3.5 rounded-xl bg-white text-blue-950 font-black text-xs uppercase tracking-wider hover:bg-sky-50 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onContact}
              className="px-7 py-3.5 rounded-xl bg-blue-800/80 text-white border border-blue-600 font-extrabold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Contact Customer Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
