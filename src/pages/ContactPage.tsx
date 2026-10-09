import React, { useState } from 'react';
import { Phone, MessageCircle, Send, CheckCircle2, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';
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
        name,
        email,
        phone,
        message
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
    'Hello Habeevatussunnah, I would like to make an inquiry regarding your collections.'
  );

  return (
    <div className="py-14 bg-slate-50 min-h-screen text-slate-800" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-700 block mb-1">
            {language === 'ha' ? 'SADARWA DA ABOKAN CINIKI' : language === 'ar' ? 'خدمة العملاء والاستفسارات' : 'CLIENT SERVICES & INQUIRIES'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
            {t.contactTitle || 'CONTACT US'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            {t.contactSubtitle || 'Have questions about an item, delivery status, or custom orders? Reach our team directly via phone, WhatsApp, or through the message form below.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Channels Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                {language === 'ha' ? 'Hanyoyin Sadarwa na Shago' : language === 'ar' ? 'قنوات التواصل الرسمية' : 'Official Business Channels'}
              </h3>

              {/* Phone Line: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {t.phoneLine || 'Customer Care Line'}
                  </span>
                  <a
                    href={`tel:${settings.phone_number}`}
                    className="text-base font-black text-slate-950 hover:text-blue-900 transition-colors block"
                  >
                    {settings.phone_number}
                  </a>
                  <a
                    href="tel:+2348065812090"
                    className="text-xs font-bold text-sky-700 hover:underline block mt-0.5"
                  >
                    +2348065812090
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ha' ? 'Kira kai tsaye domin tambayoyi' : language === 'ar' ? 'مكالمة هاتفية مباشرة للاستفسارات' : 'Direct phone assistance for order inquiries'}
                  </p>
                </div>
              </div>

              {/* WhatsApp Line: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {t.whatsappChat || 'WhatsApp Chat'}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-black text-emerald-700 hover:underline block"
                  >
                    {settings.whatsapp_number}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ha' ? 'Tattaunawa kai tsaye a WhatsApp' : language === 'ar' ? 'محادثة فورية مع فريق المتجر' : 'Click to chat directly with our store team'}
                  </p>
                </div>
              </div>

              {/* Email: Clickable */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Imel din Kasuwanci' : language === 'ar' ? 'البريد الإلكتروني' : 'Customer Email'}
                  </span>
                  <a
                    href="mailto:habibamohammed02090@gmail.com"
                    className="text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors break-all block"
                  >
                    habibamohammed02090@gmail.com
                  </a>
                </div>
              </div>

              {/* Delivery Scope */}
              <div className="flex items-start gap-4 pt-1">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                  <MapPin className="w-5 h-5 text-blue-900" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Isar da Sako' : language === 'ar' ? 'نطاق التوصيل' : 'Shipping Coverage'}
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'ha' ? 'Duk Fadin Najeriya (Jihohi 36 & Abuja)' : language === 'ar' ? 'توصيل لكافة ولايات نيجيريا والعاصمة' : 'Nationwide Shipping Across Nigeria'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ha' ? 'Isarwa har kofar gida ko tashar karba' : language === 'ar' ? 'توصيل لباب المنزل ونقاط الاستلام' : 'Safe doorstep delivery & regional station hubs'}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-1">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                  <Clock className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    {language === 'ha' ? 'Lokutan Aiki' : language === 'ar' ? 'أوقات العمل' : 'Service Hours'}
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'ha' ? 'Litinin – Asabar: 8:00 AM – 8:00 PM' : language === 'ar' ? 'الإثنين – السبت: 8:00 ص – 8:00 م' : 'Monday – Saturday: 8:00 AM – 8:00 PM'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ha' ? 'Amsa tambayoyi cikin sauri a WhatsApp' : language === 'ar' ? 'رد سريع على محادثات واتساب' : 'WhatsApp inquiries answered promptly'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-600/20 transition-all text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>CHAT ON WHATSAPP (+2348034343283)</span>
            </a>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 mb-6">
              {t.sendMessage || 'Send a Direct Message'}
            </h3>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-950 font-sans">
                  {t.messageReceived || 'Message Received!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  {t.messageReceivedText || 'Thank you for contacting Habeevatussunnah Online Business. Our staff has received your inquiry and will reach back to you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors cursor-pointer"
                >
                  {language === 'ha' ? 'Aika Wani Sakon' : language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.fullName || 'Your Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={language === 'ha' ? 'Misali: Amina Bello' : language === 'ar' ? 'مثال: أمينة بيلو' : 'e.g. Amina Bello'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t.phoneNumber || 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t.emailAddress || 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. amina@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t.yourMessage || 'Your Message / Inquiry'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={
                      language === 'ha'
                        ? 'Da fatan a bayyana kayan da kuke so ku saya ko yin tambaya...'
                        : language === 'ar'
                        ? 'يرجى كتابة استفساركم أو المنتجات التي ترغبون في طلبها...'
                        : 'Please specify which product you would like to order or ask any question...'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-slate-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (language === 'ha' ? 'ANA TURAWA...' : language === 'ar' ? 'جاري الإرسال...' : 'SENDING MESSAGE...')
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
