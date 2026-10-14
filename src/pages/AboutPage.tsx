import React from 'react';
import {
  ShieldCheck,
  Heart,
  CheckCircle2,
  ArrowRight,
  Truck,
  Globe,
  Award,
  Users,
  ShoppingBag,
  MessageCircle,
  FileText,
  Check,
  Clock,
  MapPin,
  Star,
  Compass
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
    <div className="py-10 sm:py-14 bg-slate-50/70 min-h-screen text-slate-800 antialiased" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Language Switcher Bar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-600">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>{t.language || 'Language'}:</span>
            <span className="text-emerald-800 font-extrabold uppercase tracking-wider text-xs">
              {language === 'ar' ? 'العربية' : language === 'ha' ? 'Harshen Hausa' : 'English Edition'}
            </span>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  language === lang.code
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Brand Hero Header: Deep Luxury Forest Green, Gold & White */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#043E2F] to-[#02281E] text-white p-8 sm:p-14 shadow-xl border border-emerald-700/60 text-center">
          {/* Subtle background luxury glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 font-black text-xs uppercase tracking-widest shadow-sm">
              <span>{settings.business_name}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.aboutTitle || `ABOUT ${settings.business_name}`}
            </h1>

            <p className="text-[15px] sm:text-base md:text-lg text-emerald-100 leading-relaxed max-w-2xl mx-auto font-normal">
              {t.aboutSubtitle || 'Dedicated to bringing you exquisite modest fashion, statement lifestyle accessories, and dependable doorstep delivery across Nigeria.'}
            </p>
          </div>
        </div>

        {/* 2. Brand Story & Prominent Official Logo Showcase */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-12 shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Prominent Official Brand Logo Frame - perfectly sized, proportional, non-distorted */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative group">
                {/* Ambient gold/emerald glow aura */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/30 via-amber-400/30 to-emerald-700/30 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Logo Frame: Luxury double border, crisp canvas */}
                <div className="relative w-[210px] sm:w-[260px] md:w-[290px] lg:w-[320px] bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-2xl flex items-center justify-center">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="HABEEBATUSSUNNAH ONLINE BUSINESS Official Logo"
                    className="w-full h-auto object-contain max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] select-none"
                    onError={e => {
                      (e.target as HTMLImageElement).src = OFFICIAL_LOGO_REMOTE;
                    }}
                  />
                </div>
              </div>

              {/* Verified Trademark Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Brand Identity</span>
              </div>
            </div>

            {/* Who We Are & Story Text */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-emerald-800 font-black text-xl sm:text-2xl">
                <Compass className="w-5 h-5 text-amber-500 shrink-0" />
                <h2>{t.whoWeAre || 'Who We Are'}</h2>
              </div>

              <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7 font-normal">
                {t.whoWeAreText}
              </p>

              {/* Trust Pillars Ribbon */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/80 px-3.5 py-2 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Quality Inspected</span>
                </div>
                <div className="flex items-center gap-2 text-amber-900 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/80 shadow-2xs">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Nigeria Express Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Premium Modest Collections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Mission & Vision Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.ourMission || 'Our Mission'}
            </h3>
            <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed md:leading-7">
              {t.ourMissionText}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 shadow-sm">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.ourVision || 'Our Vision'}
            </h3>
            <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed md:leading-7">
              {t.ourVisionText}
            </p>
          </div>
        </div>

        {/* 4. Core Values: Guiding Principles */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 block mb-1">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.ourValuesTitle || 'Our Core Values'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Award,
                title: t.valueQualityTitle || 'Authentic Quality',
                desc: t.valueQualityDesc || 'Every garment and accessory is hand-inspected before packaging.',
                accent: 'bg-emerald-50 text-emerald-800 border-emerald-200'
              },
              {
                icon: ShieldCheck,
                title: t.valueTrustTitle || 'Transparency & Trust',
                desc: t.valueTrustDesc || 'Honest pricing with straightforward bank transfer and verified confirmations.',
                accent: 'bg-amber-50 text-amber-800 border-amber-200'
              },
              {
                icon: Users,
                title: t.valueCustomerTitle || 'Customer-Centric Care',
                desc: t.valueCustomerDesc || 'Personal attention on WhatsApp (+2348034343283) and dedicated phone lines.',
                accent: 'bg-emerald-50 text-emerald-800 border-emerald-200'
              },
              {
                icon: Truck,
                title: t.valueDeliveryTitle || 'Nationwide Logistics',
                desc: t.valueDeliveryDesc || 'Dependable dispatch to every doorstep or pickup station in Nigeria.',
                accent: 'bg-amber-50 text-amber-800 border-amber-200'
              }
            ].map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all space-y-3"
                >
                  <div className={`w-11 h-11 rounded-2xl ${val.accent} border flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">{val.title}</h4>
                  <p className="text-[14px] text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Product Range Curated Catalog */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#02281E] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 border border-emerald-700/60">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 block mb-1">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t.productRangeTitle || 'Our Product Range'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 mt-2 max-w-2xl leading-relaxed">
              {t.productRangeDesc || 'A comprehensive selection of premium fashion and lifestyle essentials.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-[15px]">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3.5">
              <ShoppingBag className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black text-base mb-1">Women’s Fashion & Modesty</strong>
                <p className="text-emerald-100/90 leading-relaxed text-xs sm:text-sm">{t.productRangeWomen}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black text-base mb-1">Men’s Modern Wardrobe</strong>
                <p className="text-emerald-100/90 leading-relaxed text-xs sm:text-sm">{t.productRangeMen}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3.5">
              <Heart className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black text-base mb-1">Kids & Teen Collection</strong>
                <p className="text-emerald-100/90 leading-relaxed text-xs sm:text-sm">{t.productRangeKids}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3.5">
              <ShoppingBag className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-black text-base mb-1">Lifestyle & Home Essentials</strong>
                <p className="text-emerald-100/90 leading-relaxed text-xs sm:text-sm">{t.productRangeLifestyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Commitment to Customer Satisfaction */}
        <div className="bg-white border-2 border-emerald-800/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>Our Customer Promise</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.satisfactionTitle || 'Our Commitment to Customer Satisfaction'}
          </h3>

          <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7 max-w-3xl">
            {t.satisfactionText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {[
              t.satisfactionPledge1,
              t.satisfactionPledge2,
              t.satisfactionPledge3
            ].map((pledge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 text-xs sm:text-sm font-bold text-emerald-950"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{pledge}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={onShopNow}
              className="px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-900/20 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={onContact}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Contact Customer Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
