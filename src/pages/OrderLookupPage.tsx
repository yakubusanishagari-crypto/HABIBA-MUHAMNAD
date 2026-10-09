import React, { useState } from 'react';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Truck,
  Box,
  Send,
  Home,
  Lock,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice, copyToClipboard, createWhatsAppOrderUrl } from '../utils/formatters';
import { downloadOrderReceiptPDF } from '../utils/pdfReceipt';
import { TrackingStage } from '../types';

interface OrderLookupPageProps {
  initialOrderId?: string;
  onNavigateHome: () => void;
}

const TIMELINE_STAGES: { stage: TrackingStage; key: string; icon: any }[] = [
  { stage: 'SELLER CONFIRMED', key: 'stageSellerConfirmed', icon: CheckCircle2 },
  { stage: 'PACKAGING', key: 'stagePackaging', icon: Box },
  { stage: 'HANDED TO LOGISTICS', key: 'stageHandedToLogistics', icon: Package },
  { stage: 'IN TRANSIT', key: 'stageInTransit', icon: Truck },
  { stage: 'OUT FOR DELIVERY', key: 'stageOutForDelivery', icon: Send },
  { stage: 'DELIVERED', key: 'stageDelivered', icon: Home }
];

export const OrderLookupPage: React.FC<OrderLookupPageProps> = ({
  initialOrderId = '',
  onNavigateHome
}) => {
  const { getOrderById, settings, showToast, t, language, dir } = useShop();

  const [searchId, setSearchId] = useState(initialOrderId);
  const [securityPhone, setSecurityPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(() => (initialOrderId ? getOrderById(initialOrderId) : undefined));
  const [hasSearched, setHasSearched] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // If initialOrderId is passed and matched, check if customer was active
  React.useEffect(() => {
    if (initialOrderId) {
      const order = getOrderById(initialOrderId);
      if (order) {
        // If arrived directly from checkout flow, prefill phone for seamless UX
        setSecurityPhone(order.customer.phone_number || order.customer.whatsapp_number || '');
        setSearchedOrder(order);
        setHasSearched(true);
      }
    }
  }, [initialOrderId, getOrderById]);

  // Clean phone string helper
  const normalizeContact = (str: string) => {
    return str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const cleanOrderId = searchId.trim();
    if (!cleanOrderId) {
      showToast('Please enter an Order ID', 'error');
      return;
    }

    const order = getOrderById(cleanOrderId);
    if (!order) {
      setSearchedOrder(undefined);
      setHasSearched(true);
      return;
    }

    // Secure verification check:
    // User must verify either phone, whatsapp, or email to prevent exposing other customers' data
    const contactInput = normalizeContact(securityPhone);
    const orderPhone = normalizeContact(order.customer.phone_number || '');
    const orderWhatsapp = normalizeContact(order.customer.whatsapp_number || '');
    const orderEmail = normalizeContact(order.customer.email || '');

    const isMatch =
      contactInput.length >= 4 &&
      (orderPhone.includes(contactInput) ||
        contactInput.includes(orderPhone) ||
        orderWhatsapp.includes(contactInput) ||
        contactInput.includes(orderWhatsapp) ||
        (orderEmail && (orderEmail.includes(contactInput) || contactInput.includes(orderEmail))));

    if (!isMatch) {
      setVerificationError(
        t.verificationError ||
          'Security Notice: The phone number or email entered does not match this order. Please verify your details or contact customer care.'
      );
      setSearchedOrder(undefined);
      setHasSearched(true);
      return;
    }

    setSearchedOrder(order);
    setHasSearched(true);
  };

  const handleCopyAccount = async () => {
    const success = await copyToClipboard(settings.account_number);
    if (success) {
      setCopied(true);
      showToast(t.copiedSuccess || 'Account number copied successfully.', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!searchedOrder) return;
    setIsGeneratingPdf(true);
    try {
      await downloadOrderReceiptPDF(searchedOrder, settings);
      showToast('Receipt downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF error', err);
      showToast('Could not generate PDF receipt. Please try again.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Determine stage progress
  const currentStage = searchedOrder?.tracking_stage || 'SELLER CONFIRMED';
  const currentStageIndex = TIMELINE_STAGES.findIndex(s => s.stage === currentStage);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-slate-800" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>{t.secureVerificationTitle || 'Secure Order Tracking & Receipts'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.trackOrderTitle || 'Order Status & Tracking Timeline'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto">
            {t.secureVerificationDesc ||
              'For customer privacy, enter your unique Order ID and the Phone/WhatsApp number provided during checkout.'}
          </p>
        </div>

        {/* Secure Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.orderIdInputLabel || 'Order ID (e.g. ORD-20261008-XXXX)'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="e.g. ORD-20261008-7492"
                className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 uppercase font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{t.phoneOrWhatsappLabel || 'Customer Phone or WhatsApp Number'}</span>
              <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Verification & Privacy</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={securityPhone}
              onChange={e => setSecurityPhone(e.target.value)}
              placeholder="e.g. 08034343283"
              className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{t.trackButton || 'Track Order & Access Timeline'}</span>
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {verificationError ? (
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center max-w-md mx-auto space-y-2">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-sm font-bold text-rose-900">Verification Failed</h3>
                <p className="text-xs text-rose-700 leading-relaxed">{verificationError}</p>
              </div>
            ) : !searchedOrder ? (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {t.noOrderFound || 'No order found with this ID'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t.noOrderFoundDesc ||
                    'Please verify your Order ID from your confirmation message or contact customer support on WhatsApp.'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-0">
                {/* Header status bar */}
                <div className="bg-[#07132B] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-sky-400 font-extrabold px-2 py-0.5 rounded-md bg-blue-900/60 border border-blue-700/50">
                        {t.verifiedCustomerBadge || 'Verified Order Access'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black font-mono mt-1 text-white">{searchedOrder.id}</h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Placed on {new Date(searchedOrder.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <span className="text-xs text-slate-300 uppercase font-semibold">Payment Status:</span>
                    <span
                      className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 ${
                        searchedOrder.payment_status === 'Confirmed'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-amber-400 text-slate-950 font-black'
                      }`}
                    >
                      {searchedOrder.payment_status === 'Confirmed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{searchedOrder.payment_status}</span>
                    </span>
                  </div>
                </div>

                {/* 1. STEP-BY-STEP ORDER TRACKING TIMELINE */}
                <div className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-700" />
                        <span>{t.trackingTimelineTitle || 'Order Tracking Timeline'}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Current Milestone:{' '}
                        <strong className="text-blue-900 uppercase">{currentStage}</strong>
                      </p>
                    </div>

                    {searchedOrder.tracking_updated_at && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Updated: {new Date(searchedOrder.tracking_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Desktop / Tablet Timeline Stepper */}
                  <div className="hidden md:grid grid-cols-6 gap-2 relative">
                    {TIMELINE_STAGES.map((step, idx) => {
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.stage} className="flex flex-col items-center text-center relative group">
                          {/* Connecting Line */}
                          {idx > 0 && (
                            <div
                              className={`absolute top-4 -left-1/2 w-full h-1 -z-0 transition-colors ${
                                idx <= activeIndex ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            />
                          )}

                          {/* Node Icon */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black z-10 transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                                : 'bg-white text-slate-400 border-2 border-slate-300'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[3]" />
                            ) : (
                              <Icon className="w-4 h-4 text-slate-400" />
                            )}
                          </div>

                          {/* Label */}
                          <span
                            className={`text-[11px] font-black uppercase mt-2 leading-tight ${
                              isCurrent
                                ? 'text-blue-900 font-black underline underline-offset-2'
                                : isCompleted
                                ? 'text-emerald-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {t[step.key as keyof typeof t] || step.stage}
                          </span>

                          {/* Completed tick badge text */}
                          {isCompleted && (
                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                              <span>✓ Done</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Timeline */}
                  <div className="md:hidden space-y-3">
                    {TIMELINE_STAGES.map((step, idx) => {
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.stage}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-blue-50 border-blue-300 shadow-xs'
                              : isCompleted
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-white border-slate-200 opacity-60'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <Icon className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <div className="flex-1">
                            <span
                              className={`text-xs font-bold uppercase block ${
                                isCurrent
                                  ? 'text-blue-900 font-black'
                                  : isCompleted
                                  ? 'text-emerald-900'
                                  : 'text-slate-500'
                              }`}
                            >
                              {t[step.key as keyof typeof t] || step.stage}
                            </span>
                          </div>

                          {isCompleted && (
                            <span className="text-[10px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded-md">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. OFFICIAL PDF RECEIPT DOWNLOAD BANNER (AFTER PAYMENT CONFIRMED) */}
                {searchedOrder.payment_status === 'Confirmed' ? (
                  <div className="p-6 bg-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="text-sm font-extrabold text-emerald-950 block">
                          Official Verified Payment Receipt Ready
                        </strong>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          {t.receiptReadyNotice ||
                            'Payment has been verified and confirmed by seller! Your official PDF receipt is available for download.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadReceipt}
                      disabled={isGeneratingPdf}
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.downloadReceiptPdf || 'DOWNLOAD OFFICIAL RECEIPT (PDF)'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>
                        Payment confirmation in progress. Once confirmed by Habeevatussunnah, your official PDF receipt will become available here.
                      </span>
                    </div>

                    <a
                      href={createWhatsAppOrderUrl(
                        settings.whatsapp_number,
                        searchedOrder.id,
                        searchedOrder.customer.full_name,
                        searchedOrder.total_amount
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Verify on WhatsApp</span>
                    </a>
                  </div>
                )}

                {/* 3. DETAILS BODY */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Fulfillment Summary Bar */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Tracking Stage</span>
                      <strong className="text-blue-900 text-xs font-black">{currentStage}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Payment Method</span>
                      <strong className="text-slate-900 font-bold">{settings.payment_provider} Bank Transfer</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Customer Name</span>
                      <strong className="text-slate-900 font-bold">{searchedOrder.customer.full_name}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Delivery Area</span>
                      <strong className="text-slate-900 font-bold">
                        {searchedOrder.customer.city}, {searchedOrder.customer.state}
                      </strong>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                      Ordered Products ({searchedOrder.items.length})
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {searchedOrder.items.map(item => (
                        <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 text-xs bg-white">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product_image}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{item.product_name}</p>
                              <p className="text-slate-500 text-[11px]">
                                Qty: {item.quantity}{' '}
                                {item.selected_size && `· Size: ${item.selected_size}`}{' '}
                                {item.selected_color && `· Color: ${item.selected_color}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right font-black text-slate-900">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-slate-800 font-semibold">{formatPrice(searchedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Nationwide Delivery Fee</span>
                      <span className="text-slate-800 font-semibold">{formatPrice(searchedOrder.delivery_fee)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Amount</span>
                      <span className="text-blue-900">{formatPrice(searchedOrder.total_amount)}</span>
                    </div>
                  </div>

                  {/* Bank transfer verification action if awaiting payment */}
                  {searchedOrder.payment_status !== 'Confirmed' && (
                    <div className="p-5 bg-sky-50 rounded-2xl border border-sky-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                          Official Bank Details
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy Account'}</span>
                        </button>
                      </div>

                      <div className="text-xs text-sky-900 space-y-1">
                        <p>Bank: <strong>{settings.payment_provider}</strong></p>
                        <p>Account Name: <strong>{settings.account_name}</strong></p>
                        <p>
                          Account Number:{' '}
                          <strong className="text-blue-950 text-sm font-mono font-bold">
                            {settings.account_number}
                          </strong>
                        </p>
                      </div>

                      <a
                        href={createWhatsAppOrderUrl(
                          settings.whatsapp_number,
                          searchedOrder.id,
                          searchedOrder.customer.full_name,
                          searchedOrder.total_amount
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>I HAVE MADE PAYMENT (OPEN WHATSAPP)</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
