import React from 'react';
import { Shield, FileText, RefreshCw, Truck, Globe, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Language } from '../types';

interface LegalPagesProps {
  type: 'privacy' | 'terms' | 'returns' | 'shipping';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const { settings, language, setLanguage, dir, t } = useShop();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  // PRIVACY POLICY CONTENT
  if (type === 'privacy') {
    return (
      <div className="py-12 bg-white min-h-screen text-slate-800" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-blue-900 font-extrabold">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {language === 'ha'
                    ? 'Ka’idojin Tsaro & Sirri'
                    : language === 'ar'
                    ? 'سياسة الخصوصية وسرية البيانات'
                    : 'Privacy Policy'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ha'
                    ? 'An sabunta: Oktoba 2026'
                    : language === 'ar'
                    ? 'آخر تحديث: أكتوبر 2026'
                    : 'Last Updated: October 2026'}
                </p>
              </div>
            </div>

            {/* Language Quick Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    language === lang.code
                      ? 'bg-blue-700 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
            {language === 'ha' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  A <strong>{settings.business_name}</strong>, muna girmama sirrinku kuma mun himmatu wajen kare duk wani bayani da kuka bamu yayin sayayya a shagonmu na yanar gizo.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Bayanan da Muke Tarawa</h3>
                  <p>
                    Yayin da kuka yi oda ko kuka tuntube mu, muna tattara sunanku cikakke, lambar waya, lambar WhatsApp, adireshin imel, da adireshin isar da sako a Najeriya.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. Yadda Muke Amfani da Bayananku</h3>
                  <p>
                    Ana amfani da bayananku ne kawai domin kintsa odarku, sanar da ku halin da sakonku ke ciki a WhatsApp ko waya, da kuma isar da kayanku lafiya. Ba ma sayarwa ko bayar da bayananku ga wasu kamfanoni.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Tsaron Biyan Kudi</h3>
                  <p>
                    Dukkan biyan kudi ana yinsa ne kai tsaye ta banki ko {settings.payment_provider} zuwa tabbataccen akawunt din kasuwancinmu. Ba ma neman lambar katin bankinku (ATM) ko lambar sirri (PIN) a shafinmu.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">4. Tuntubar Mu kan Sirri</h3>
                  <p>
                    Idan kuna da wata tambaya game da tsaron bayananku, tuntube mu a {settings.phone_number} ko a WhatsApp ta {settings.whatsapp_number}.
                  </p>
                </div>
              </>
            ) : language === 'ar' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  في <strong>{settings.business_name}</strong>، نولي خصوصيتكم اهتماماً بالغاً ونلتزم بحماية كافة بياناتكم الشخصية التي تشاركونها معنا أثناء التسوق في متجرنا الإلكتروني.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. المعلومات التي نجمعها</h3>
                  <p>
                    عند إتمام الطلب أو التواصل معنا، نجمع بيانات العميل الأساسية وتشمل الاسم الكامل، رقم الهاتف، رقم الواتساب، البريد الإلكتروني، وعنوان الشحن بالتفصيل في نيجيريا.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. كيفية استخدام معلوماتكم</h3>
                  <p>
                    تُستخدم بياناتكم حصراً لمعالجة طلبكم، وتزويدكم بتحديثات الشحن عبر واتساب أو الهاتف، وتنسيق التوصيل بدقة. نحن لا نبيع أو نشارك بيانات عملائنا مع أي جهات خارجية.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. أمان الدفع والتحويل</h3>
                  <p>
                    تتم جميع المدفوعات عبر التحويل البنكي المباشر أو تحويل {settings.payment_provider} إلى حسابنا التجاري المعتمد. لا نطلب ولا نخزن أرقام البطاقات الائتمانية أو كلمات المرور المصرفية على الموقع.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">4. الاستفسار بشأن الخصوصية</h3>
                  <p>
                    إذا كان لديكم أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا على {settings.phone_number} أو عبر واتساب على {settings.whatsapp_number}.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-base text-slate-800 font-medium">
                  At <strong>{settings.business_name}</strong>, we respect your privacy and are committed to safeguarding any personal information you share with us when purchasing from our online store.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
                  <p>
                    When you place an order or contact us, we collect necessary customer details including your full name, phone number, WhatsApp contact number, email address, and shipping address in Nigeria.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. How We Use Your Information</h3>
                  <p>
                    Your information is strictly utilized to process your order, communicate dispatch updates via WhatsApp or phone, coordinate delivery, and answer your inquiries. We do not sell or rent customer data to third-party advertisers.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Payment Security</h3>
                  <p>
                    All payments are made directly via bank or {settings.payment_provider} transfer to our verified business account. We do not store or collect your debit card numbers or bank account passwords on our website.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">4. Contact For Privacy Matters</h3>
                  <p>
                    If you have any questions regarding how your data is handled, please contact us on {settings.phone_number} or via WhatsApp at {settings.whatsapp_number}.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TERMS & CONDITIONS CONTENT
  if (type === 'terms') {
    return (
      <div className="py-12 bg-white min-h-screen text-slate-800" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-blue-900 font-extrabold">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {language === 'ha'
                    ? 'Sharudda & Ka’idoji'
                    : language === 'ar'
                    ? 'الشروط والأحكام'
                    : 'Terms & Conditions'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ha'
                    ? 'An sabunta: Oktoba 2026'
                    : language === 'ar'
                    ? 'آخر تحديث: أكتوبر 2026'
                    : 'Last Updated: October 2026'}
                </p>
              </div>
            </div>

            {/* Language Quick Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    language === lang.code
                      ? 'bg-blue-700 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
            {language === 'ha' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  Barka da zuwa <strong>{settings.business_name}</strong>. Ta hanyar amfani da shafinmu, duba kayayyaki, ko tura oda, kun amince da bin wadannan sharudda da ka’idoji.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Yin Oda & Farashin Kaya</h3>
                  <p>
                    Dukkan farashin kayayyaki an bayyana su ne da kudin Najeriya (₦ Naira). Muna kokari wajen tabbatar da daidaiton kowane farashi da adadin kayan da ke akwai kafin a tura.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. Hanyar Tabbatar da Biyan Kudi</h3>
                  <p>
                    Ana tabbatar da oda ne kawai bayan mai sayayya ya tura kudi zuwa akawunt dinmu na {settings.payment_provider} da aka tanadar yayin sayayya kuma ya sanar da mu a WhatsApp. Odar da ba a biya ba har tsawon sa’o’i 48 ba tare da magana ba ana iya mayar da kayan shago.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Kamannin Kaya da Launuka</h3>
                  <p>
                    Launi da yanayin kayayyaki a hotuna na iya samun 'yar karamar bambanci dangane da hasken waya ko talabijin din mai duba. Muna ba da tabbacin cewa dukkan kaya na asali ne kuma masu inganci.
                  </p>
                </div>
              </>
            ) : language === 'ar' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  مرحباً بكم في <strong>{settings.business_name}</strong>. من خلال زيارة موقعنا وتصفح المنتجات أو إرسال الطلبات، فإنكم توافقون على الالتزام بالشروط والأحكام التالية.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. تقديم الطلب وتفاصيل الأسعار</h3>
                  <p>
                    جميع أسعار المنتجات محددة بالنايرا النيجيرية (₦). نحرص دائماً على دقة الأسعار والمخزون المتاح ونتأكد من مراجعة كل طلب قبل الشحن.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. مسار التحقق من الدفع</h3>
                  <p>
                    يتم تثبيت الطلب رسمياً بعد قيام العميل بالتحويل البنكي إلى حساب {settings.payment_provider} المعتمد لدينا وتأكيد الدفع عبر محادثة واتساب. الطلبات غير المسددة لمدة تتجاوز 48 ساعة دون تواصل قد يُلغى حجزها.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. ألوان وتفاصيل المنتجات</h3>
                  <p>
                    قد تختلف درجات الألوان المعروضة في الصور بفارق طفيف جداً وفقاً لإعدادات شاشات الأجهزة. نحن نضمن جودة الخامات وأصالة القطع كما هي معروضة.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-base text-slate-800 font-medium">
                  Welcome to <strong>{settings.business_name}</strong>. By accessing our website, browsing products, or submitting orders, you agree to comply with and be bound by the following terms.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Order Placement & Pricing</h3>
                  <p>
                    All product prices are quoted in Nigerian Naira (₦). While we endeavor to ensure all pricing and inventory details are accurate, we reserve the right to rectify any unintentional typographical errors prior to dispatch.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. Payment Verification Workflow</h3>
                  <p>
                    Orders are confirmed only after the customer transfers payment to our designated {settings.payment_provider} account during checkout and notifies our store desk through WhatsApp. Orders awaiting payment for more than 48 hours without customer communication may be released back into public stock.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Product Variation</h3>
                  <p>
                    Colors and textures shown in product photographs may vary slightly depending on monitor and screen calibrations. We guarantee genuine quality materials as described.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // NATIONWIDE SHIPPING POLICY
  if (type === 'shipping') {
    return (
      <div className="py-12 bg-white min-h-screen text-slate-800" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-blue-900 font-extrabold">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {language === 'ha'
                    ? 'Ka’idojin Isar da Sako a Duk Fadin Najeriya'
                    : language === 'ar'
                    ? 'سياسة الشحن والتوصيل لكافة الولايات'
                    : 'Nationwide Shipping Policy'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'ha'
                    ? 'An sabunta: Oktoba 2026'
                    : language === 'ar'
                    ? 'آخر تحديث: أكتوبر 2026'
                    : 'Last Updated: October 2026'}
                </p>
              </div>
            </div>

            {/* Language Quick Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    language === lang.code
                      ? 'bg-blue-700 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
            {language === 'ha' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  <strong>{settings.business_name}</strong> na samar da ingantaccen tsarin isar da kaya da sako cikin aminci zuwa dukkan jihohi 36 da babban birnin tarayya Abuja a Najeriya.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Tsawon Lokacin Isar da Sako</h3>
                  <p>
                    Ana fara kintsa kaya nan take bayan an tabbatar da biyan kudi ta WhatsApp. Sakon yana kaiwa cikin kwanaki 1 zuwa 3 a manyan birane, da kuma kwanaki 3 zuwa 5 a sauran jihohi da yankunan karkara.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. Kudin Isar da Sako</h3>
                  <p>
                    Ana lissafa daidaitaccen kudin isar da sako a lokacin biya (kudin da aka saba: ₦{settings.default_delivery_fee.toLocaleString()}). Kayan gida masu nauyi ko bukatar isarwa ta gaggawa ana iya shirya su ta hanyar magana a WhatsApp.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Bibiyar Halin da Kaya ke Ciki</h3>
                  <p>
                    Kowace oda tana da lambar musamman (Order ID). Kuna iya shigar da wannan lambar a shafinmu a sashin "Bibiyar Oda" domin ganin matakin da kayanku ya kai ko kuma ku aiko mana da lambar a WhatsApp.
                  </p>
                </div>
              </>
            ) : language === 'ar' ? (
              <>
                <p className="text-base text-slate-800 font-medium">
                  توفر مؤسسة <strong>{settings.business_name}</strong> خدمة توصيل سريعة وموثوقة تغطي جميع الولايات النيجيرية الـ 36 والعاصمة الفيدرالية أبوجا.
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. المدة الزمنية للشحن والتسليم</h3>
                  <p>
                    تتم معالجة الطلبات فور تأكيد عملية الدفع على واتساب. يستغرق التوصيل عادةً من يوم إلى 3 أيام عمل في المدن الكبرى، ومن 3 إلى 5 أيام عمل لبقية الولايات والمناطق الأخرى.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. رسوم الشحن والتوصيل</h3>
                  <p>
                    تُحسب رسوم التوصيل القياسية تلقائياً أثناء إتمام الطلب (الرسوم المعتمدة: ₦{settings.default_delivery_fee.toLocaleString()}). للشحنات الثقيلة أو الشحن السريع الاستثنائي، يرجى التواصل مع فريقنا عبر واتساب.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. تتبع الشحنة والفواتير</h3>
                  <p>
                    يُمنح كل طلب رقم تعريف فريد (Order ID). يمكنكم إدخال رقم الطلب في أي وقت في صفحة "تتبع الطلب" على موقعنا لمتابعة مسار شحنتكم خطوة بخطوة أو إرسال الرقم لفريق خدمة العملاء على واتساب.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-base text-slate-800 font-medium">
                  <strong>{settings.business_name}</strong> provides reliable nationwide delivery throughout Nigeria covering all 36 states and the Federal Capital Territory (Abuja).
                </p>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">1. Delivery Timeline</h3>
                  <p>
                    Orders are processed immediately after payment verification on WhatsApp. Standard delivery timeline is 1-3 business days within major commercial hubs and 3-5 business days for other states and nationwide locations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">2. Delivery Charges</h3>
                  <p>
                    Standard nationwide delivery is calculated during checkout (standard default: ₦{settings.default_delivery_fee.toLocaleString()}). Bulky household goods or express expedited services may be arranged by contacting our WhatsApp desk.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">3. Package Tracking</h3>
                  <p>
                    Every order is assigned a unique Order ID. You can enter your Order ID anytime on our website under the "Track / Lookup Order" section to monitor fulfillment status or message us on WhatsApp with your Order ID for real-time dispatch updates.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RETURN & EXCHANGE POLICY (Consolidated single source of truth)
  return (
    <div className="py-12 bg-white min-h-screen text-slate-800" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-wrap gap-4">
          <div className="flex items-center gap-3 text-blue-900 font-extrabold">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {language === 'ha'
                  ? 'Ka’idojin Mai da Kaya & Sauyawa'
                  : language === 'ar'
                  ? 'سياسة الإرجاع والاستبدال'
                  : 'Return & Exchange Policy'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ha'
                  ? 'An sabunta: Oktoba 2026'
                  : language === 'ar'
                  ? 'آخر تحديث: أكتوبر 2026'
                  : 'Last Updated: October 2026'}
              </p>
            </div>
          </div>

          {/* Language Quick Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {languages.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  language === lang.code
                    ? 'bg-blue-700 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
          {language === 'ha' ? (
            <>
              <p className="text-base text-slate-800 font-medium">
                Gamsar da abokin ciniki shi ne babban abin da muka sa gaba a <strong>{settings.business_name}</strong>. Da fatan za a duba ka’idojinmu na mai da kaya ko sauyawa a kasa:
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Sharuɗɗan Sauya Kaya</h3>
                <p>
                  Za a iya sanar da mu domin sauya kaya ko mayarwa a cikin sa’o’i 48 bayan karbar kaya idan an same su da lahani, barna a hanya, ko kuma an samu kuskuren lamba/girman da ba wanda aka oda ba.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. Yanayin Kayan da za a Mayar</h3>
                <p>
                  Kayan da za a mayar dole ne su kasance ba a saka su ba, ba a wanke su ba, kuma suna cikin leda ko kwalin asalinsu tare da tambarinsu. Kayan kwalliya da suturar sirri ba a mayar da su da zarar an bude su saboda tsabta da lafiya.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. Mayar da Sabo ko Mayar da Kudi</h3>
                <p>
                  Da zarar an karbi kayan da aka mayar kuma an duba su, za mu tura sabo cikin hanzari ko kuma mu mayar da kudin ta {settings.payment_provider} zuwa akawunt dinku na banki kamar yadda aka amince. Tuntube mu kai tsaye a {settings.whatsapp_number} domin tsara yadda za a yi.
                </p>
              </div>
            </>
          ) : language === 'ar' ? (
            <>
              <p className="text-base text-slate-800 font-medium">
                رضا عملائنا هو غايتنا الأولى في <strong>{settings.business_name}</strong>. نرجو الاطلاع على إرشادات وسياسة الإرجاع والاستبدال الموضحة أدناه:
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. الأهلية للاستبدال أو الإرجاع</h3>
                <p>
                  يمكن طلب الاستبدال أو الإرجاع خلال 48 ساعة من استلام الشحنة في حال وصول المنتج تالفاً، أو معيباً، أو بمقاس ومواصفات مختلفة عما تم تأكيده في الطلب.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. حالة المنتج المرتجع</h3>
                <p>
                  يجب أن تكون المنتجات المرتجعة غير مستخدمة، وغير مغسولة، وبحالتها الأصلية مع ملصقاتها وتغليفها الأصلي. لا يمكن إرجاع مستحضرات التجميل المفتوحة أو الملابس الداخلية لدواعي الصحة والسلامة.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. الاستبدال واسترداد المبلغ</h3>
                <p>
                  بمجرد استلام المنتج المرتجع وفحصه، نقوم فوراً بإرسال البديل المطابق أو تحويل المبلغ المسترد عبر {settings.payment_provider} إلى حسابكم البنكي مباشرة كما تم الاتفاق. يرجى التواصل معنا عبر واتساب على {settings.whatsapp_number} لتنسيق الإجراءات.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-slate-800 font-medium">
                Customer satisfaction is paramount at <strong>{settings.business_name}</strong>. Please review our return and exchange guidelines below:
              </p>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Eligibility for Returns & Exchanges</h3>
                <p>
                  Items may be reported for exchange or return within 48 hours of delivery if they are received damaged, defective, or in the wrong size/specification compared to your confirmed order.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. Item Condition</h3>
                <p>
                  Returned items must be unused, unwashed, and in their original packaging with tags intact. Personal cosmetics and intimate wear cannot be returned once opened for sanitary and hygiene safety.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. Resolution & Replacement</h3>
                <p>
                  Once a returned item is received and inspected, we will promptly issue a replacement or initiate an {settings.payment_provider} refund to your bank account as agreed. Contact us directly at {settings.whatsapp_number} for return coordination.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
