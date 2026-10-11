import React from 'react';
import { Phone, MessageCircle, MapPin, ShieldCheck, ArrowRight, Sparkles, Package, ShoppingBag, Mail, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createGeneralWhatsAppUrl } from '../utils/formatters';

interface FooterProps {
  setCurrentView: (view: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setSelectedGender: (gender: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  setSelectedCategory,
  setSelectedGender
}) => {
  const { settings, t } = useShop();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenderNav = (view: string, gender: string) => {
    setSelectedGender(gender);
    setSelectedCategory('');
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = createGeneralWhatsAppUrl(
    '+2348034343283',
    'Hello Habeevatussunnah Online Business, I would like to inquire about your collections.'
  );

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 sm:pt-20 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter / Brand Promise Bar & Action Icons */}
        <div className="pb-12 sm:pb-14 border-b border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-7 flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-xl shadow-amber-500/10 bg-emerald-950 flex items-center justify-center shrink-0 p-1">
              <img
                src="/logo.png"
                alt="HABEEBATUSSUNNAH ONLINE BUSINESS Official Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.ibb.co/t0R6hKy/file-00000000d98082108f3f7ba387c29728.png';
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Curated Elegance & Verified Quality</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                HABEEBATUSSUNNAH ONLINE BUSINESS
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Nigeria’s distinguished destination for contemporary fashion, graceful modest wear, premium footwear, statement jewelry, beauty, and home lifestyle collections.
              </p>
            </div>
          </div>

          {/* Top-Right Compact Action Icons: TRACK ORDER, WHATSAPP, SHOP NOW */}
          <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-start lg:justify-end">
            <div className="grid grid-cols-3 sm:flex sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* 1. TRACK ORDER */}
              <button
                type="button"
                onClick={() => handleNav('order-lookup')}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-800 hover:border-sky-500/60 transition-all font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm cursor-pointer group text-center"
                aria-label="Track Your Order Status & Timeline"
                title="Track Order"
              >
                <Package className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.footerTrackOrder || 'TRACK ORDER'}</span>
              </button>

              {/* 2. WHATSAPP */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800/80 hover:border-emerald-500/70 transition-all font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm group text-center"
                aria-label="Chat with Customer Desk on WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.footerWhatsApp || 'WHATSAPP'}</span>
              </a>

              {/* 3. SHOP NOW */}
              <button
                type="button"
                onClick={() => handleNav('products')}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-white border border-blue-700/80 hover:border-sky-400 transition-all font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-sm cursor-pointer group text-center"
                aria-label="Explore Full Shopping Catalogue"
                title="Shop Now"
              >
                <ShoppingBag className="w-4 h-4 text-sky-300 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">SHOP NOW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-14 sm:py-16">
          {/* Col 1: Explore Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Collections</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleGenderNav('women', 'Women')} className="hover:text-white transition-colors">
                  Women's Fashion & Dresses
                </button>
              </li>
              <li>
                <button onClick={() => handleGenderNav('men', 'Men')} className="hover:text-white transition-colors">
                  Men's Wear & Trousers
                </button>
              </li>
              <li>
                <button onClick={() => handleGenderNav('kids', 'Kids')} className="hover:text-white transition-colors">
                  Kids & Teen Wardrobe
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('new-arrivals')} className="hover:text-white transition-colors">
                  New Season Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('products')} className="hover:text-white transition-colors">
                  All General Products
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Luxury Departments */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Departments</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => { setSelectedCategory('cat-shoes'); handleNav('products'); }} className="hover:text-white transition-colors">
                  Footwear & Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('cat-bags'); handleNav('products'); }} className="hover:text-white transition-colors">
                  Handbags & Clutches
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('cat-jewelry'); handleNav('products'); }} className="hover:text-white transition-colors">
                  Jewelry & Watches
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('cat-cosmetics'); handleNav('products'); }} className="hover:text-white transition-colors">
                  Cosmetics & Skincare
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('cat-home'); handleNav('products'); }} className="hover:text-white transition-colors">
                  Home & Kitchen Living
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('order-lookup')} className="hover:text-white transition-colors">
                  Track / Lookup Order
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shipping')} className="hover:text-white transition-colors">
                  Nationwide Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('returns')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact Support Desk
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Our Brand
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  Our Mission & Values
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-800/80">
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-amber-300 text-slate-400 font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer text-[11px]"
                  title="Authorized Store Administrators & Staff Portal"
                >
                  <Lock className="w-3 h-3 text-amber-400/90" />
                  <span>Admin / Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Dedicated Clickable Contact Details */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Contact & Support</h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 text-xs">
              {/* Phone / WhatsApp: +2348034343283 */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Phone / WhatsApp
                </span>
                <div className="space-y-1">
                  <a
                    href="tel:+2348034343283"
                    className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-bold text-xs"
                    title="Call +2348034343283"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>+2348034343283</span>
                  </a>
                  <a
                    href="https://wa.me/2348034343283?text=Hello%20Habeevatussunnah%20Online%20Business%2C%20I%20would%20like%20to%20make%20an%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold text-[11px] ml-5"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3 fill-current shrink-0" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Phone: +2348065812090 */}
              <div className="pt-2.5 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Direct Phone Line
                </span>
                <a
                  href="tel:+2348065812090"
                  className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-bold text-xs"
                  title="Call +2348065812090"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>+2348065812090</span>
                </a>
              </div>

              {/* Email: habibamohammed02090@gmail.com */}
              <div className="pt-2.5 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Customer Email
                </span>
                <a
                  href="mailto:habibamohammed02090@gmail.com"
                  className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium text-xs break-all"
                  title="Send email to habibamohammed02090@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>habibamohammed02090@gmail.com</span>
                </a>
              </div>

              <div className="pt-1 text-[10.5px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Customer Desk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="tel:+2348034343283" className="hover:text-white transition-colors">
              Phone/WhatsApp: +2348034343283
            </a>
            <span className="text-slate-700">·</span>
            <a href="tel:+2348065812090" className="hover:text-white transition-colors">
              Phone: +2348065812090
            </a>
            <span className="text-slate-700">·</span>
            <a href="mailto:habibamohammed02090@gmail.com" className="hover:text-white transition-colors">
              habibamohammed02090@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

