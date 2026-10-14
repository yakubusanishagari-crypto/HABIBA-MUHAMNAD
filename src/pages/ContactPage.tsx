import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Mail,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createGeneralWhatsAppUrl } from '../utils/formatters';

export const ContactPage: React.FC = () => {
  const { settings, submitContactMessage, showToast, t, dir, language } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a shigar da sunanku da sakonku.'
          : language === 'ar'
          ? 'يرجى إدخال اسمكم ورسالتكم.'
          : 'Please enter your name and message.',
        'error'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim()
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      showToast(
        language === 'ha'
          ? 'An tura sakonku cikin nasara!'
          : language === 'ar'
          ? 'تم إرسال رسالتكم بنجاح!'
          : 'Message sent successfully!',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast(
        language === 'ha'
          ? 'Ba a iya tura sako ba. Da fatan a tuntube mu a WhatsApp.'
          : language === 'ar'
          ? 'تعذر إرسال الرسالة، يرجى التواصل عبر واتساب.'
          : 'Failed to send message. Please try WhatsApp.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = createGeneralWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Habeevatussunnah Online Business, I would like to make an inquiry regarding your products and delivery.'
  );

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen text-slate-800 antialiased" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            {language === 'ha'
              ? 'SADARWA DA ABOKAN CINIKI'
              : language === 'ar'
              ? 'خدمة العملاء والاستفسارات'
              : 'CLIENT SERVICES & INQUIRIES'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight font-sans">
            {t.contactTitle || 'CONTACT US'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t.contactSubtitle ||
              'Have questions about an item, delivery status, or custom orders? Reach our team directly via phone, WhatsApp, or through the message form below.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Direct Channels Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-900 pb-3.5 border-b border-slate-100 flex items-center justify-between">
                <span>
                  {language === 'ha'
                    ? 'Hanyoyin Sadarwa na Shago'
                    : language === 'ar'
                    ? 'قنوات التواصل الرسمية'
                    : 'Official Business Channels'}
                </span>
              </h3>

              {/* Phone Line 1 & 2: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-2xs">
                  <Phone className="w-5 h-5 text-emerald-800" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
                    {t.phoneLine || 'Customer Care Line'}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <a
                      href={`tel:${settings.phone_number}`}
                      className="text-base font-black text-slate-950 hover:text-emerald-700 transition-colors inline-block"
                      title="Call primary phone line"
                    >
                      {settings.phone_number}
                    </a>
                    <span className="hidden sm:inline text-slate-300">·</span>
                    <a
                      href="tel:+2348065812090"
                      className="text-sm font-bold text-emerald-800 hover:underline inline-block"
                      title="Call secondary line"
                    >
                      +2348065812090
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'ha'
                      ? 'Kira kai tsaye domin tambayoyin oda da shawara.'
                      : language === 'ar'
                      ? 'مكالمات هاتفية مباشرة للاستفسارات وتأكيد الطلبات.'
                      : 'Direct phone assistance for order inquiries & logistics.'}
                  </p>
                </div>
              </div>

              {/* WhatsApp Line: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/80 shadow-2xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
                    {t.whatsappChat || 'WhatsApp Chat'}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-black text-emerald-700 hover:underline inline-flex items-center gap-1.5"
                    title="Open WhatsApp chat"
                  >
                    <span>{settings.whatsapp_number}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'ha'
                      ? 'Tattaunawa kai tsaye a WhatsApp tare da mai kula da shago.'
                      : language === 'ar'
                      ? 'محادثة فورية مع فريق المتجر لتأكيد الدفع والتفاصيل.'
                      : 'Click to chat directly with our store administrator.'}
                  </p>
                </div>
              </div>

              {/* Email: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/80 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Imel din Kasuwanci' : language === 'ar' ? 'البريد الإلكتروني' : 'Official Customer Email'}
                  </span>
                  <a
                    href="mailto:habibamohammed02090@gmail.com"
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors break-all block"
                    title="Send customer email"
                  >
                    habibamohammed02090@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'ha'
                      ? 'Domin shawarwari da bukatar hadin gwiwa.'
                      : language === 'ar'
                      ? 'للاستفسارات الرسمية والمعاملات المعتمدة.'
                      : 'Written inquiries, order records, and formal correspondence.'}
                  </p>
                </div>
              </div>

              {/* Nationwide Coverage */}
              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Isar da Sako' : language === 'ar' ? 'نطاق التوصيل' : 'Shipping Coverage'}
                  </span>
                  <p className="text-sm font-black text-slate-900">
                    {language === 'ha'
                      ? 'Duk Fadin Najeriya (Jihohi 36 & Abuja)'
                      : language === 'ar'
                      ? 'توصيل لكافة ولايات نيجيريا والعاصمة'
                      : 'Nationwide Delivery Across All 36 States & FCT Abuja'}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'ha'
                      ? 'Isarwa har kofar gida ko tashar karba ta kusa da ku.'
                      : language === 'ar'
                      ? 'توصيل لباب المنزل ونقاط الاستلام الإقليمية.'
                      : 'Direct doorstep dispatch & regional courier stations.'}
                  </p>
                </div>
              </div>

              {/* Service Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Lokutan Aiki' : language === 'ar' ? 'أوقات العمل' : 'Service & Support Hours'}
                  </span>
                  <p className="text-sm font-black text-slate-900">
                    {language === 'ha'
                      ? 'Litinin – Asabar: 8:00 AM – 8:00 PM'
                      : language === 'ar'
                      ? 'الإثنين – السبت: 8:00 ص – 8:00 م'
                      : 'Monday – Saturday: 8:00 AM – 8:00 PM'}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'ha'
                      ? 'Ana amsa sakonni a WhatsApp cikin sauri.'
                      : language === 'ar'
                      ? 'الرد على رسائل واتساب خلال ساعات العمل.'
                      : 'WhatsApp messages answered promptly during service hours.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-800/20 transition-all text-center cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current text-amber-300" />
              <span>CHAT ON WHATSAPP (+2348034343283)</span>
            </a>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
                  {t.sendMessage || 'Send a Direct Message'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ha'
                    ? 'Aiko mana da sakon tambaya ko bayanin odar da kuke bukata.'
                    : language === 'ar'
                    ? 'أرسل لنا استفسارك وسيقوم فريق العمل بالرد عليك سريعًا.'
                    : 'Submit your order details or inquiries directly to our administrative desk.'}
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border-2 border-emerald-300 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-slate-950 font-sans">
                  {t.messageReceived || 'Message Received!'}
                </h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {t.messageReceivedText ||
                    'Thank you for contacting Habeevatussunnah Online Business. Our staff has received your inquiry and will reach back to you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-7 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  {language === 'ha'
                    ? 'Aika Wani Sakon'
                    : language === 'ar'
                    ? 'إرسال رسالة أخرى'
                    : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1.5 uppercase tracking-wider">
                    {t.fullName || 'Your Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={
                      language === 'ha'
                        ? 'Misali: Amina Bello'
                        : language === 'ar'
                        ? 'مثال: أمينة بيلو'
                        : 'e.g. Amina Bello'
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1.5 uppercase tracking-wider">
                      {t.phoneNumber || 'Phone / WhatsApp'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 08034343283"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1.5 uppercase tracking-wider">
                      {t.emailAddress || 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. amina@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1.5 uppercase tracking-wider">
                    {t.yourMessage || 'Your Message / Inquiry'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={
                      language === 'ha'
                        ? 'Da fatan a bayyana kayan da kuke so ku saya ko yin tambaya game da oda...'
                        : language === 'ar'
                        ? 'يرجى كتابة استفساركم أو المنتجات التي ترغبون في طلبها بالتفصيل...'
                        : 'Please specify which product you would like to order, required sizes, or ask any question...'
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>
                    {isSubmitting
                      ? (language === 'ha'
                          ? 'ANA TURAWA...'
                          : language === 'ar'
                          ? 'جاري الإرسال...'
                          : 'SENDING MESSAGE...')
                      : (t.submitInquiry || 'SUBMIT INQUIRY')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
