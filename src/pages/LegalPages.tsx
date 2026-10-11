import React from 'react';
import {
  Shield,
  FileText,
  RefreshCw,
  Truck,
  CheckCircle2,
  Phone,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Language } from '../types';
import { OFFICIAL_LOGO_URL, OFFICIAL_LOGO_REMOTE } from '../utils/imageUpload';

interface LegalPagesProps {
  type: 'privacy' | 'terms' | 'returns' | 'shipping';
  onNavigate?: (view: string) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type, onNavigate }) => {
  const { settings, language, setLanguage, dir } = useShop();

  const isRtl = language === 'ar';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  const policyTabs = [
    {
      id: 'privacy',
      labelEn: 'Privacy Policy',
      labelHa: 'Ka’idojin Tsaro & Sirri',
      labelAr: 'سياسة الخصوصية',
      icon: Shield
    },
    {
      id: 'terms',
      labelEn: 'Terms & Conditions',
      labelHa: 'Sharudda & Ka’idoji',
      labelAr: 'الشروط والأحكام',
      icon: FileText
    },
    {
      id: 'shipping',
      labelEn: 'Nationwide Shipping',
      labelHa: 'Isar da Sako a Najeriya',
      labelAr: 'سياسة الشحن والتوصيل',
      icon: Truck
    },
    {
      id: 'returns',
      labelEn: 'Return & Exchange',
      labelHa: 'Mayarwa & Sauye-Sauye',
      labelAr: 'سياسة الاستبدال والاسترجاع',
      icon: RefreshCw
    }
  ];

  const getPageMeta = () => {
    switch (type) {
      case 'privacy':
        return {
          titleEn: 'Official Privacy Policy',
          titleHa: 'Cikakkun Ka’idojin Tsaro da Sirrin Bayanai',
          titleAr: 'سياسة الخصوصية وسرية البيانات الرسمية',
          subtitleEn: 'How we safeguard, process, and protect your personal shopping information across all orders.',
          subtitleHa: 'Yadda muke karewa, girmamawa, da amfani da bayanan abokan cinikinmu cikin aminci da tsaro.',
          subtitleAr: 'كيف نلتزم بحماية خصوصيتك ومعلوماتك الشخصية أثناء التسوق معنا بأعلى معايير الأمان الموثوقة.',
          icon: Shield,
          color: 'from-[#064E3B] via-[#043E2F] to-[#02281E]',
          badgeEn: 'Data Protection & Security',
          badgeHa: 'Kariyar Bayanan Abokan Ciniki',
          badgeAr: 'حماية وأمان البيانات'
        };
      case 'terms':
        return {
          titleEn: 'Terms & Conditions of Service',
          titleHa: 'Sharudda da Ka’idojin Sayayya da Aiki',
          titleAr: 'الشروط والأحكام العامة للخدمة والتسوق',
          subtitleEn: 'Rules, pricing standards, order verifications, and customer commitments governing every transaction.',
          subtitleHa: 'Ka’idojin ciniki, ingancin kayayyaki, tsarin biyan kudi, da hakkin abokin ciniki a kowace oda.',
          subtitleAr: 'القواعد المنظمة للطلب، معايير الأسعار، تأكيد الدفعات، والتزامات العملاء لضمان حقوق الجميع.',
          icon: FileText,
          color: 'from-amber-800 via-[#8A5A12] to-[#064E3B]',
          badgeEn: 'Customer Agreement',
          badgeHa: 'Yarjejeniyar Ciniki',
          badgeAr: 'اتفاقية الاستخدام المعتمدة'
        };
      case 'shipping':
        return {
          titleEn: 'Nationwide Shipping Policy',
          titleHa: 'Dokar Isar da Sakonni a Fadin Najeriya',
          titleAr: 'سياسة الشحن والتوصيل لكافة الولايات',
          subtitleEn: 'Comprehensive delivery guidelines, logistics zones across Nigeria, transit schedules, and tracking.',
          subtitleHa: 'Bayanin lokutan tura sako, jahohin da muke kai kaya a Najeriya, da bin sahun kowace oda.',
          subtitleAr: 'دليل مناطق الشحن والتوصيل في نيجيريا، فترات المعالجة والتسليم، وتتبع الشحنات حتى الاستلام.',
          icon: Truck,
          color: 'from-[#064E3B] via-emerald-900 to-teal-950',
          badgeEn: 'Logistics & Dispatch',
          badgeHa: 'Ayyukan Isar da Sako',
          badgeAr: 'الشحن والتوصيل السريع'
        };
      case 'returns':
      default:
        return {
          titleEn: 'Return & Exchange Policy',
          titleHa: 'Ka’idojin Mayar da Kaya ko Sauya Su',
          titleAr: 'سياسة الاستبدال والاسترجاع الميسرة',
          subtitleEn: 'Transparent rules for product exchanges, inspection standards, size adjustments, and customer care.',
          subtitleHa: 'Sauki wajen sauya kaya idan bukata ta taso da tsarin kula da abokan ciniki cikin gaskiya.',
          subtitleAr: 'شروط واضحة وميسرة لاستبدال المنتجات، فحص الجودة، وحل استفسارات العملاء بأقصى سرعة.',
          icon: RefreshCw,
          color: 'from-amber-900 via-[#064E3B] to-emerald-950',
          badgeEn: 'Satisfaction Guarantee',
          badgeHa: 'Gamsar da Abokin Ciniki',
          badgeAr: 'ضمان الرضا والجودة'
        };
    }
  };

  const meta = getPageMeta();
  const IconComponent = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-24" dir={dir}>
      {/* Top Breadcrumb & Language Switcher Bar */}
      <div className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'الرئيسية' : language === 'ha' ? 'Gida' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-800 font-bold">
              {language === 'ar'
                ? meta.titleAr
                : language === 'ha'
                ? meta.titleHa
                : meta.titleEn}
            </span>
          </div>

          {/* Multilingual Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
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
      </div>

      {/* Hero Header Card */}
      <div className={`bg-gradient-to-br ${meta.color} text-white py-14 sm:py-16 relative overflow-hidden`}>
        {/* Subtle decorative glow patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 font-black text-xs uppercase tracking-wider border border-white/15">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>
                  {language === 'ar'
                    ? meta.badgeAr
                    : language === 'ha'
                    ? meta.badgeHa
                    : meta.badgeEn}
                </span>
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {language === 'ar'
                  ? meta.titleAr
                  : language === 'ha'
                  ? meta.titleHa
                  : meta.titleEn}
              </h1>

              <p className="text-[15px] sm:text-base md:text-lg text-emerald-100 leading-relaxed font-normal">
                {language === 'ar'
                  ? meta.subtitleAr
                  : language === 'ha'
                  ? meta.subtitleHa
                  : meta.subtitleEn}
              </p>
            </div>

            {/* Official Logo Integration */}
            <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-2xl bg-white p-2.5 shadow-xl border-2 border-amber-400/60 items-center justify-center">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="HABEEBATUSSUNNAH Logo"
                className="w-full h-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).src = OFFICIAL_LOGO_REMOTE;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-2">
          {policyTabs.map(tab => {
            const isActive = tab.id === type;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate && onNavigate(tab.id)}
                className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span className="truncate">
                  {language === 'ar' ? tab.labelAr : language === 'ha' ? tab.labelHa : tab.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Policy Body (8 Columns on desktop) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
            {/* ============================================================= */}
            {/* 1. PRIVACY POLICY */}
            {/* ============================================================= */}
            {type === 'privacy' && (
              <div className="space-y-8">
                {language === 'ha' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Lock className="w-5 h-5 text-emerald-700" />
                        Alkawarinmu Kan Sirrinku
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        A <strong>{settings.business_name}</strong>, muna daraja mutuncin abokan cinikinmu. Dukkan bayananku ana ajiye su ne cikin aminci da tsaro domin tabbatar da cewa sayayyarku ta tafi lafiya ba tare da wani fargaba ba.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Bayanan da Muke Tarawa Yayin Sayayya
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Domin isar da odarku cikin sauki, muna bukatar cikakkun bayanan da suka hada da:
                      </p>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li><strong>Sunanku:</strong> Sunan da za a rubuta a kan sakonku da kuma shaidar oda.</li>
                        <li><strong>Lambar Waya & WhatsApp:</strong> Domin sanar da ku idan odar ta tashi ko kuma isar da sako a WhatsApp.</li>
                        <li><strong>Adireshin Isar da Sako:</strong> Garinku, jaha, da bayanin gidan da za a kai kayan a Najeriya.</li>
                        <li><strong>Bayanan Kayan da Aka Zaba:</strong> Lambar kaya (SKU), kalar kaya, da ma’aunin girma (size).</li>
                      </ul>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Yadda Muke Karewa da Amfani da Bayanai
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Bayananku ana amfani da su ne kawai don manufar kasuwanci tsakaninmu da ku:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ Biyan Bukatar Oda</strong>
                          <span className="text-slate-600 leading-relaxed">Shirya kaya da mikawa kamfanin sufuri lafiya.</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ Sadarwa ta WhatsApp</strong>
                          <span className="text-slate-600 leading-relaxed">Aiko muku lambar bin sawu da rasit din biyan kudi.</span>
                        </div>
                      </div>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Ba ma sayarwa, ba ma haya, kuma ba ma bayar da lambobin wayarku ko adireshinku ga wasu kamfanoni na daban.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Tsaron Biyan Kudi da Akawunt
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Dukkan biyan kudi na shagonmu ana yinsa ne kai tsaye ta hanyar canja kudi na banki (Bank Transfer) ko OPay zuwa ga asusun kasuwancinmu na <strong>{settings.account_name} ({settings.account_number})</strong>.
                      </p>
                      <div className="p-4.5 bg-amber-50 rounded-2xl border border-amber-200 text-sm sm:text-[15px] text-amber-900 flex items-start gap-3 leading-relaxed">
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Tabbatar da Tsaro:</strong> Ba ma rokon lambar sirri (PIN) ko bayanan katin ATM a shafinmu. Duk wata shaidar biya ana tura ta ne kai tsaye a WhatsApp ko gurin tabbatar da oda.
                        </span>
                      </div>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">4</span>
                        Hakkin Abokin Ciniki & Sauya Bayani
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Kuna da cikakken hakkin tambayar bayanan da muke da su game da ku, neman a gyara adireshi kafin a fitar da sako, ko neman a goge bayanan lambarku daga jerin sanarwarmu ta hanyar tuntubar shugabar kasuwancinmu a WhatsApp: <strong>{settings.whatsapp_number}</strong>.
                      </p>
                    </section>
                  </>
                ) : language === 'ar' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Lock className="w-5 h-5 text-emerald-700" />
                        التزامنا الصارم بحماية الخصوصية
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        في <strong>{settings.business_name}</strong>، نولي أقصى درجات العناية لحماية سرية وأمان بيانات عملائنا الكرام. نلتزم بمعايير أخلاقية وتجارية صارمة لضمان تجربة تسوق آمنة وموثوقة.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">١</span>
                        البيانات التي نقوم بجمعها
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        لتنفيذ طلباتكم وإيصالها دون تأخير، نقوم فقط بجمع المعلومات الضرورية والأساسية:
                      </p>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li><strong>الاسم الكريم:</strong> لتسجيل الفاتورة وإثبات ملكية الشحنة.</li>
                        <li><strong>رقم الهاتف وواتساب:</strong> للتواصل السريع، إرسال تفاصيل التتبع، وتأكيد موعد التسليم.</li>
                        <li><strong>عنوان التسليم بالتفصيل:</strong> المدينة، الولاية في نيجيريا، والمعالم القريبة.</li>
                        <li><strong>تفاصيل المنتجات:</strong> المقاسات المطلوبة، الألوان، ورمز المنتج لضمان دقة التجهيز.</li>
                      </ul>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">٢</span>
                        كيفية استخدام البيانات وحمايتها
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        تُستخدم هذه البيانات حصرًا للأغراض التشغيلية المرتبطة بطلبكم:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ تجهيز وشحن الطلب</strong>
                          <span className="text-slate-600 leading-relaxed">التنسيق مع شركات الشحن المعتمدة للتوصيل بأمان.</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ خدمة العملاء المباشرة</strong>
                          <span className="text-slate-600 leading-relaxed">إرسال الفواتير الإلكترونية وإشعارات وصول الطرود.</span>
                        </div>
                      </div>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        نضمن بشكل قاطع عدم بيع أو تأجير أو مشاركة بياناتكم مع أي أطراف ثالثة أو شركات تسويقية خارجية.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">٣</span>
                        أمان المعاملات المالية والدفع
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        تتم كافة عمليات الدفع عبر التحويل البنكي المباشر أو عبر مزود <strong>{settings.payment_provider}</strong> إلى الحساب الرسمي المعتمد: <strong>{settings.account_name} ({settings.account_number})</strong>.
                      </p>
                      <div className="p-4.5 bg-amber-50 rounded-2xl border border-amber-200 text-sm sm:text-[15px] text-amber-900 flex items-start gap-3 leading-relaxed">
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>تنبيه أمني:</strong> موقعنا لا يطلب أبدًا أرقام البطاقات الائتمانية السرية (CVV) أو كلمات المرور البنكية (PIN). تأكيد الدفع يتم بمطابقة إشعار التحويل البنكي فقط.
                        </span>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Lock className="w-5 h-5 text-emerald-700" />
                        Our Commitment to Your Privacy
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        At <strong>{settings.business_name}</strong>, we respect your confidentiality and are dedicated to maintaining strict security standards for all customer details collected through our online catalog and ordering system.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Information We Collect
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        To fulfill your purchases accurately and provide high-touch order fulfillment, we collect only necessary personal identifiers:
                      </p>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li><strong>Full Customer Name:</strong> For address labeling, order receipt generation, and courier handover.</li>
                        <li><strong>Phone & WhatsApp Number:</strong> For order verification, logistics updates, and customer assistance.</li>
                        <li><strong>Delivery Address:</strong> Street location, city, state, and relevant landmark descriptions in Nigeria.</li>
                        <li><strong>Purchased Item Preferences:</strong> Selected apparel sizes, colors, and specific order notes.</li>
                      </ul>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        How We Safeguard and Use Information
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Your submitted details are utilized strictly for legitimate operational purposes:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ Order Fulfillment</strong>
                          <span className="text-slate-600 leading-relaxed">Packing garments, booking couriers, and coordinating delivery.</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1 font-black">✓ Direct Communication</strong>
                          <span className="text-slate-600 leading-relaxed">Sending automated PDF receipts and shipment status notifications.</span>
                        </div>
                      </div>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        We never sell, rent, monetize, or disclose your contact credentials to third-party marketing companies.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Payment Protection & Merchant Verification
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        All financial settlements are transacted via direct electronic bank transfers or OPay transfer to our official registered account: <strong>{settings.account_name} ({settings.account_number})</strong>.
                      </p>
                      <div className="p-4.5 bg-amber-50 rounded-2xl border border-amber-200 text-sm sm:text-[15px] text-amber-900 flex items-start gap-3 leading-relaxed">
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Security Reminder:</strong> Our storefront never requests debit card PINs or CVV numbers. Payment confirmation relies exclusively on verified bank transfer transaction receipts.
                        </span>
                      </div>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">4</span>
                        Your Privacy Rights
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        You have the right to request review of your stored order records, correct delivery coordinates prior to courier dispatch, or request removal of your contact information by messaging our administration on WhatsApp: <strong>{settings.whatsapp_number}</strong>.
                      </p>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* 2. TERMS & CONDITIONS */}
            {/* ============================================================= */}
            {type === 'terms' && (
              <div className="space-y-8">
                {language === 'ha' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-amber-700" />
                        Sharuddan Ciniki & Sayayya
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        Wadannan sharudda sun shafi duk wata sayayya da aka yi a <strong>{settings.business_name}</strong>. Ta hanyar yin oda, kun amince da bin wadannan ka’idoji na kasuwanci.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Ingancin Kayan Shago da Ma’aunin Girma
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Duk kayayyakin da ke shagonmu—kamar dogayen rigunan mata (abayas), takalma, jakunkuna, da kayan ado—an nuna su da hotuna da bayanin hakikanin kayan.
                      </p>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <em>Lura:</em> Kalar kaya na iya nuna ‘yar banbanci kadan saboda hasken waya ko kwamfuta. Ana shawartar abokin ciniki ya duba ma’aunin girmansa (size) sosai kafin kammala oda.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Farashi da Biyan Kudi
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Dukkan farashi a shafinmu yana cikin kudin Najeriya ne (₦ Naira). Ana tabbatar da oda ne kawai idan aka biya kudi zuwa asusun <strong>{settings.account_name}</strong> ta hanyar {settings.payment_provider} ko banki kuma mai gudanarwa ya tabbatar.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Hakkin Abokin Ciniki Yayin Karbar Kaya
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Wajibi ne abokin ciniki ya bayar da lambar waya da ke aiki da kuma adireshin da za a iya samu cikin sauki. Idan mai kai sako ya je kuma ba a samu kowa a lambar da aka bayar ba, za a iya tsara wata ranar isarwar bayan an tattauna da mai kula da harkokin kasuwanci.
                      </p>
                    </section>
                  </>
                ) : language === 'ar' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-amber-700" />
                        الشروط والأحكام العامة للتعامل
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        تحكم هذه الشروط والأحكام كافة الطلبات والمعاملات في <strong>{settings.business_name}</strong>. يمثل إتمامك للطلب موافقة رسمية على هذه البنود الميسرة.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">١</span>
                        دقة المنتجات والمواصفات والمقاسات
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        نحرص على عرض صور واضحة وتفاصيل دقيقة لجميع تشكيلات العبايات الفاخرة، الأحذية، الحقائب، والإكسسوارات.
                      </p>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        يُرجى مراعاة أن درجات الألوان قد تختلف بشكل طفيف للغاية بحسب إعدادات شاشات العرض والإضاءة، وننصح باختيار المقاس الصحيح استنادًا إلى دليل المقاسات.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">٢</span>
                        الأسعار وتأكيد عمليات الدفع
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        كافة الأسعار المعروضة بالنايرا النيجيرية (₦). يُعتبر الطلب قيد الحجز المبدئي حتى يتم التحقق من سداد المبلغ لحسابنا الرسمي المعتمد <strong>{settings.account_name}</strong>.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-amber-700" />
                        Terms & Conditions of Service
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        These terms establish the operating agreement between you and <strong>{settings.business_name}</strong> for catalog browsing, order reservations, and delivery fulfillment.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Product Descriptions, Sizing & Imagery
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        We showcase genuine photographs, detailed product descriptions, and specifications across all product collections.
                      </p>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <em>Visual Representation Notice:</em> Minor variations in tone may occur due to photography lighting and device displays. Customers are advised to select their confirmed sizing options prior to order finalization.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Pricing, Orders & Payment Verification
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Prices are presented in Nigerian Naira (₦). An order reservation becomes finalized only upon successful bank transfer receipt reconciliation by our administrative desk.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Delivery Acceptance & Customer Responsibilities
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Customers are responsible for providing reachable phone contacts and clear delivery addresses. When couriers attempt delivery, please ensure someone is available to receive and inspect the package packaging.
                      </p>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* 3. NATIONWIDE SHIPPING POLICY */}
            {/* ============================================================= */}
            {type === 'shipping' && (
              <div className="space-y-8">
                {language === 'ha' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Truck className="w-5 h-5 text-emerald-700" />
                        Dokar Isar da Sakonni a Fadin Najeriya
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        Muna aiki da ingantattun kamfanonin sufuri domin isar da kayayyaki zuwa dukkan jahohi 36 na Najeriya da birnin tarayya Abuja cikin aminci da kulawa.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Tsarin Shirya Kaya da Fitar da Sako
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Bayan an tabbatar da biyan kudi, ana duba ingancin kaya, sanya su a cikin leda ko kwali mai kariya, tare da mikawa kamfanin sufuri a cikin sa’o’i <strong>12 zuwa 24</strong> na aiki.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Kimanin Lokutan Isar da Sako
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Cikin Gari / Kusa</strong>
                          <span className="text-emerald-700 font-bold block text-sm">Kwanaki 1 - 2</span>
                          <p className="text-slate-500 text-xs">Isarwa kai tsaye ba tare da bata lokaci ba.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Arewacin Najeriya & Abuja</strong>
                          <span className="text-emerald-700 font-bold block text-sm">Kwanaki 2 - 3</span>
                          <p className="text-slate-500 text-xs">Kano, Kaduna, Jos, Sokoto, Katsina, da sauransu.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Sauran Jihohin Najeriya</strong>
                          <span className="text-emerald-700 font-bold block text-sm">Kwanaki 3 - 5</span>
                          <p className="text-slate-500 text-xs">Lagos, Ibadan, Port Harcourt, Enugu, da sauransu.</p>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-slate-500 italic">
                        * Lura: Yanayin hanya ko sauyin yanayi na iya kawo dan jinkiri kadan; mai kula da harkokinmu zai rika sanar da ku a WhatsApp.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Kudin Isar da Sako (Delivery Fee)
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Kudin isar da sako na yau da kullum a shafinmu shine <strong>₦{settings.default_delivery_fee?.toLocaleString() || '2,500'}</strong>. Idan wurin yana da nisa sosai ko kuma kayan suna da nauyi da yawa, za a iya sanar da ku karin kudi bayan an duba da kamfanin sufuri.
                      </p>
                    </section>
                  </>
                ) : language === 'ar' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Truck className="w-5 h-5 text-emerald-700" />
                        الشحن والتوصيل لكافة الولايات النيجيرية
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        نوفر خدمات شحن آمنة وموثوقة إلى جميع الولايات الست والثلاثين في نيجيريا بالإضافة إلى العاصمة أبوجا عبر شبكة شركاء لوجستيين معتمدين.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">١</span>
                        معالجة الطلب وتجهيز الطرد
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        يتم تجهيز الشحنة وفحص جودتها وتغليفها بعناية فائقة خلال ١٢ إلى ٢٤ ساعة من تأكيد سداد قيمة الطلب.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">٢</span>
                        الفترات التقريبية لوصول الشحنات
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">داخل النطاق المحلي</strong>
                          <span className="text-emerald-700 font-bold block text-sm">١ - ٢ يوم عمل</span>
                          <p className="text-slate-500 text-xs">توصيل مباشر وميسر.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">المدن الرئيسية والوسطى</strong>
                          <span className="text-emerald-700 font-bold block text-sm">٢ - ٣ أيام عمل</span>
                          <p className="text-slate-500 text-xs">كانو، كادونا، أبوجا، والمناطق المجاورة.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">بقية الولايات</strong>
                          <span className="text-emerald-700 font-bold block text-sm">٣ - ٥ أيام عمل</span>
                          <p className="text-slate-500 text-xs">لاغوس، بورت هاركورت، وبقية المدن الجنوبية.</p>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-emerald-950 mb-2 flex items-center gap-2.5">
                        <Truck className="w-5 h-5 text-emerald-700" />
                        Nationwide Delivery Coverage in Nigeria
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-emerald-900 leading-relaxed md:leading-7">
                        We operate dependable delivery services reaching customers across all 36 Nigerian states and the Federal Capital Territory (FCT Abuja) in partnership with vetted logistics providers.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Processing & Packaging Timeline
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Orders are carefully processed, quality inspected, and packaged within 12 to 24 business hours following payment confirmation.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Estimated Transit Times by Region
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-[15px]">
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Local / Intra-State</strong>
                          <span className="text-emerald-700 font-bold block text-sm">1 - 2 Business Days</span>
                          <p className="text-slate-500 text-xs">Direct priority dispatch.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Regional & Northern Hubs</strong>
                          <span className="text-emerald-700 font-bold block text-sm">2 - 3 Business Days</span>
                          <p className="text-slate-500 text-xs">Abuja, Kano, Kaduna, Jos, Sokoto, etc.</p>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block font-black">Interstate & Southern Hubs</strong>
                          <span className="text-emerald-700 font-bold block text-sm">3 - 5 Business Days</span>
                          <p className="text-slate-500 text-xs">Lagos, Port Harcourt, Ibadan, Enugu, etc.</p>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-slate-500 italic">
                        * Note: Transit times are estimates based on standard courier logistics. Special rural locations or unexpected road conditions may alter timing slightly.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Standard Shipping Charges
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Our default standard shipping rate is <strong>₦{settings.default_delivery_fee?.toLocaleString() || '2,500'}</strong>. Any heavy multi-carton parcels or remote rural deliveries requiring special courier waybills will be communicated by our administration prior to dispatch.
                      </p>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* 4. RETURN & EXCHANGE POLICY */}
            {/* ============================================================= */}
            {type === 'returns' && (
              <div className="space-y-8">
                {language === 'ha' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <RefreshCw className="w-5 h-5 text-amber-700" />
                        Ka’idojin Mayar da Kaya ko Sauye-Sauye
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        Burinmu shine abokin ciniki ya gamsu 100% da duk kayan da ya saya. Idan akwai wata matsala game da ma’auni (size) ko kalar kaya, muna da tsari mai sauki na sauya kaya.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Lokacin Sanar da Neman Sauyi (Eligibility Window)
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Dole ne a sanar da mu bukatarku ta sauya kaya a cikin sa’o’i <strong>48 zuwa 72</strong> daga lokacin da kuka karbi sakonku a hannun mai kai kaya.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Sharuddan Karbar Kayan da Za a Sauya
                      </h3>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li>Kayan ya kasance bai samu wata illa ba, ba a wanke shi ba, kuma ba a sanya shi a waje ba.</li>
                        <li>Dukkan tambarin kaya (tags) da ledojin asali suna nan ba a yayyaga su ba.</li>
                        <li>Domin dalilai na tsafta da lafiya, ba a mayar da kayan shafa (cosmetics) da aka riga aka bude murfinsu.</li>
                      </ul>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Hanyar Neman Sauyin Kaya (Yadda Ake Yi)
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Kawai ku aiko mana da hoton kayan da lambar odarku a WhatsApp ta <strong>{settings.whatsapp_number}</strong>. Za mu duba tare da samar muku da ma’aunin da ya dace ko wani kalar kayan da kuka zaba.
                      </p>
                    </section>
                  </>
                ) : language === 'ar' ? (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <RefreshCw className="w-5 h-5 text-amber-700" />
                        سياسة الاستبدال الميسرة
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        رضاكم هو غايتنا الأولى. إذا واجهتكم أي مشكلة في مقاس المنتج أو مواصفاته، يسعدنا مساعدتكم في استبداله بكل سهولة ويسر.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">١</span>
                        المهلة الزمنية لطلب الاستبدال
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        يُرجى إشعارنا برغبتكم في الاستبدال خلال فترة تتراوح بين <strong>٤٨ إلى ٧٢ ساعة</strong> من لحظة استلام الطرد الفعلي.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">٢</span>
                        شروط قبول المنتجات المستبدلة
                      </h3>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li>أن يكون المنتج في حالته الأصلية الجديدة، غير ملبوس، وغير مغسول.</li>
                        <li>وجود البطاقات التعريفية والغلاف الأصلي للمنتج دون تلف.</li>
                        <li>لدواعي الصحة والسلامة العامة، لا تشمل سياسة الاسترجاع مستحضرات التجميل المفتوحة.</li>
                      </ul>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <h2 className="text-lg sm:text-xl font-black text-amber-950 mb-2 flex items-center gap-2.5">
                        <RefreshCw className="w-5 h-5 text-amber-700" />
                        Fair & Transparent Return & Exchange Policy
                      </h2>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-amber-900 leading-relaxed md:leading-7">
                        Your satisfaction is our primary priority. In the unlikely event that an item requires a size adjustment or variant change, we provide a structured, transparent exchange workflow.
                      </p>
                    </div>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">1</span>
                        Eligibility & Notice Window
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Exchange requests must be submitted within <strong>48 to 72 hours</strong> of verified package delivery confirmation from the courier.
                      </p>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">2</span>
                        Product Condition Requirements
                      </h3>
                      <ul className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 space-y-3 list-disc list-inside bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-100 leading-relaxed md:leading-7">
                        <li>Items must be unworn, unwashed, unaltered, and free of perfumes or marks.</li>
                        <li>Original brand packaging, tags, and accessories must remain intact.</li>
                        <li>For hygiene and sanitation reasons, opened cosmetics, skincare, or personal intimate accessories cannot be returned once unsealed.</li>
                      </ul>
                    </section>

                    <section className="space-y-3.5">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-black flex items-center justify-center shrink-0">3</span>
                        Exchange Procedure & Assistance
                      </h3>
                      <p className="text-[15px] sm:text-base md:text-[16.5px] text-slate-700 leading-relaxed md:leading-7">
                        Contact our administrative desk with your Order ID and photo of the delivered item via WhatsApp at <strong>{settings.whatsapp_number}</strong>. Our team will verify eligibility and coordinate the replacement.
                      </p>
                    </section>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Helpful Action Cards (4 Columns on desktop) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-[#064E3B] to-[#02281E] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/60 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-emerald-950 flex items-center justify-center font-bold shadow-md shadow-black/20 shrink-0">
                  <Phone className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {language === 'ar' ? 'تحتاج إلى مساعدة؟' : language === 'ha' ? 'Kuna Bukatar Taimako?' : 'Need Assistance?'}
                  </h3>
                  <span className="text-xs text-amber-300 font-bold">
                    {language === 'ar' ? 'تواصل مع الإدارة مباشرة' : language === 'ha' ? 'Tuntubi Mai Gudanarwa' : 'Direct Executive Support'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {language === 'ar'
                  ? 'فريق خدمة العملاء لدينا متاح يوميًا للرد على استفساراتكم عبر الواتساب أو الاتصال الهاتفي المباشر.'
                  : language === 'ha'
                  ? 'Muna nan a ko da yaushe domin amsa tambayoyinku ko binciken oda a WhatsApp ko kiran waya.'
                  : 'Our customer support team is on standby to assist with order verifications, custom sizing, and policy queries.'}
              </p>

              <div className="space-y-2.5 pt-1">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello HABEEBATUSSUNNAH ONLINE BUSINESS, I have a question regarding your ${meta.titleEn}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>
                    {language === 'ar' ? 'محادثة عبر واتساب' : language === 'ha' ? 'Yi Magana a WhatsApp' : 'Chat on WhatsApp'}
                  </span>
                </a>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <span>
                      {language === 'ar' ? 'صفحة التواصل الكاملة' : language === 'ha' ? 'Bude Shafin Tuntuba' : 'Visit Contact Page'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Track Order Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200/80 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {language === 'ar' ? 'تتبع طلبيتك الآن' : language === 'ha' ? 'Bi Sahun Odarku' : 'Track Your Package'}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {language === 'ar' ? 'برقم الطلب الرسمي' : language === 'ha' ? 'Da lambar odarku' : 'With your Order ID'}
                  </span>
                </div>
              </div>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'تحقق من حالة طلبك الحالية ومراحل الشحن في الوقت الفعلي.'
                  : language === 'ha'
                  ? 'Duba halin da odarku ke ciki da inda ta tsaya a halin yanzu.'
                  : 'Check the real-time fulfillment and transit milestone of your purchase.'}
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('order-lookup')}
                  className="w-full py-3 bg-slate-950 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>
                    {language === 'ar' ? 'الانتقال إلى تتبع الطلب' : language === 'ha' ? 'Bincika Halin Oda' : 'Go to Order Lookup'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Official Banking & OPay Badge */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/90 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>
                  {language === 'ar' ? 'طريقة الدفع الرسمية المعتمدة' : language === 'ha' ? 'Tabbataccen Akawunt din Kasuwanci' : 'Official Verified Merchant'}
                </span>
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p><strong>Provider:</strong> {settings.payment_provider}</p>
                <p><strong>Account Name:</strong> {settings.account_name}</p>
                <p><strong>Account Number:</strong> <span className="font-mono font-bold text-emerald-800 text-base">{settings.account_number}</span></p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
