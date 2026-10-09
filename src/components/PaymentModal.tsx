import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, MessageCircle, AlertCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { Order, SiteSettings } from '../types';
import { copyToClipboard, createWhatsAppOrderUrl, formatPrice } from '../utils/formatters';
import { useShop } from '../context/ShopContext';

interface PaymentModalProps {
  order: Order;
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
  onViewOrderDetails: (orderId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  settings,
  isOpen,
  onClose,
  onViewOrderDetails
}) => {
  const { showToast } = useShop();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = async () => {
    const success = await copyToClipboard(settings.account_number);
    if (success) {
      setCopied(true);
      showToast('Account number copied successfully.', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappUrl = createWhatsAppOrderUrl(
    settings.whatsapp_number,
    order.id,
    order.customer.full_name,
    order.total_amount
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Success Header Banner */}
        <div className="bg-slate-950 text-white p-6 sm:p-7 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 block mb-1">
            HABEEVATUSSUNNAH ONLINE BUSINESS
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
            ORDER CONFIRMED
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Please make your transfer to finalize and confirm this order.
          </p>
        </div>

        {/* Order Metadata Overview */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] block">
                Order ID
              </span>
              <span className="text-sm font-black text-blue-950 font-mono mt-0.5 block">
                {order.id}
              </span>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] block">
                Total Amount
              </span>
              <span className="text-base font-black text-slate-950 mt-0.5 block">
                {formatPrice(order.total_amount)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] block">
                Payment Status
              </span>
              <span className="text-amber-700 font-extrabold text-xs mt-0.5 block">
                AWAITING PAYMENT CONFIRMATION
              </span>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] block">
                Order Status
              </span>
              <span className="text-blue-900 font-extrabold text-xs mt-0.5 block">
                PENDING
              </span>
            </div>
          </div>

          {/* Dedicated OPAY Payment Details Card */}
          <div className="border-2 border-sky-400/90 bg-sky-50/60 rounded-2xl p-5 relative shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-sky-700 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                  {settings.payment_provider}
                </span>
                <span className="text-xs font-black text-sky-950">Official Business Account</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-sky-700" />
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-sky-200/60">
                <span className="text-slate-500 font-medium">Bank Provider:</span>
                <strong className="text-slate-950 font-extrabold">{settings.payment_provider}</strong>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-sky-200/60">
                <span className="text-slate-500 font-medium">Account Name:</span>
                <strong className="text-slate-950 font-extrabold">{settings.account_name}</strong>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Account Number:</span>
                  <span className="text-2xl font-black text-slate-950 font-mono tracking-wider">
                    {settings.account_number}
                  </span>
                </div>

                {/* COPY ACCOUNT NUMBER BUTTON */}
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 hover:bg-blue-900 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Account number copied successfully</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY ACCOUNT NUMBER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transfer Instructions Notice */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Payment Instructions:</p>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                1. Transfer exactly <strong className="text-slate-950">{formatPrice(order.total_amount)}</strong> to the {settings.payment_provider} account above.
                <br />
                2. Tap the green <strong className="text-emerald-800">"I HAVE MADE PAYMENT"</strong> button below to automatically message Habeevatussunnah on WhatsApp with your Order ID pre-filled.
              </p>
            </div>
          </div>

          {/* "I HAVE MADE PAYMENT" WhatsApp Confirmation Button */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-emerald-600/30 transition-all text-center"
            >
              <MessageCircle className="w-5 h-5 shrink-0 fill-current" />
              <span>I HAVE MADE PAYMENT</span>
            </a>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onViewOrderDetails(order.id)}
                className="w-full sm:w-auto text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center justify-center gap-1 py-1.5"
              >
                <span>View Full Order Invoice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5"
              >
                Close & Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
