import React from 'react';
import { ArrowRight, Tag, ShieldCheck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface PromotionalBannerProps {
  onShopNow: () => void;
  onExploreNewArrivals?: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  onShopNow,
  onExploreNewArrivals
}) => {
  const { language, dir, t } = useShop();

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-[#F8FAFC] to-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#07132B] via-[#0B1E45] to-[#0A2540] border border-blue-900/80 shadow-2xl text-white p-7 sm:p-10 lg:p-12">
          {/* Subtle Ambient Lighting Effects */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Promotional Copy */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10.5px] sm:text-xs font-black tracking-widest uppercase">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ha'
                    ? 'RANGWAME NA MUSAMMAN A SHAGO'
                    : language === 'ar'
                    ? 'عروض وتخفيضات حصرية لجميع الأقسام'
                    : 'EXCLUSIVE STOREWIDE PROMOTION'}
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans leading-tight">
                {language === 'ha' ? (
                  <>
                    Habbaka Kwarjininka Da{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-sky-300 font-serif-display italic font-semibold">
                      Zababbun Kayan Alfarma.
                    </span>
                  </>
                ) : language === 'ar' ? (
                  <>
                    ارتقِ بأناقتك وتميزك مع{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-sky-300 font-serif-display italic font-semibold">
                      أفخر التشكيلات المختارة.
                    </span>
                  </>
                ) : (
                  <>
                    Elevate Your Signature Style With{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-sky-300 font-serif-display italic font-semibold">
                      Handpicked Luxury.
                    </span>
                  </>
                )}
              </h3>

              {/* Persuasive copy */}
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {language === 'ha'
                  ? 'Binciki suturar kamala ta musamman, dogayen riguna, takalma masu daraja, da kayan ado na alfarma. Ji dadin isar da sako cikin hanzari zuwa dukkan jihohin Najeriya da biyan kudi cikin sauki ta OPay.'
                  : language === 'ar'
                  ? 'اكتشف أرقى الأزياء المحتشمة والفساتين الراقية، الأحذية الفاخرة، والإكسسوارات المميزة. استمتع بتوصيل سريع لجميع الولايات النيجيرية ودفع ميسر بالتحويل البنكي عبر أوباي.'
                  : 'Discover exceptional modest fashion, bespoke dresses, refined footwear, and statement accessories. Enjoy swift nationwide delivery across all Nigerian states and seamless OPay transfer checkout.'}
              </p>

              {/* Quick Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-bold text-slate-300">
                <div className="flex items-center gap-1.5 text-sky-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{language === 'ha' ? 'Isarwa Cikin Hanzari' : language === 'ar' ? 'شحن فوري' : 'Express Dispatch'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === 'ha' ? 'Kayan Asali 100%' : language === 'ar' ? 'أصلي ومفحوص 100%' : '100% Inspected Authentic'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-200">
                  <span>{language === 'ha' ? 'Sabbin Zubi na 2026' : language === 'ar' ? 'أحدث موديلات 2026' : 'New Season Drops'}</span>
                </div>
              </div>
            </div>

            {/* Right Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={onShopNow}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <span>{t.shopNow || 'SHOP NOW'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              {onExploreNewArrivals && (
                <button
                  type="button"
                  onClick={onExploreNewArrivals}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-colors cursor-pointer"
                >
                  <span>{t.navNewArrivals || 'EXPLORE NEW ARRIVALS'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
