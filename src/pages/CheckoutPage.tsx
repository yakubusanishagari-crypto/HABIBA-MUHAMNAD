import React, { useState } from 'react';
import { CustomerInfo, Order } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice, copyToClipboard } from '../utils/formatters';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCart,
  onOrderCompleted
}) => {
  const { cart, cartSubtotal, deliveryFee, cartTotal, createOrder, settings, showToast } = useShop();

  const [formData, setFormData] = useState<CustomerInfo>({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    email: '',
    delivery_address: '',
    city: '',
    state: '',
    additional_notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);

  const handleCopyAccount = async () => {
    const success = await copyToClipboard(settings.account_number);
    if (success) {
      setAccountCopied(true);
      showToast('Account number copied successfully.', 'success');
      setTimeout(() => setAccountCopied(false), 3000);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.whatsapp_number.trim()) newErrors.whatsapp_number = 'WhatsApp number is required for payment verification';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!formData.delivery_address.trim()) newErrors.delivery_address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your shopping cart is empty.', 'error');
      return;
    }

    if (!validate()) {
      showToast('Please fill out all required customer information fields.', 'error');
      return;
    }

    if (isSubmitting) return; // Anti-duplication lock

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder(formData);
      onOrderCompleted(newOrder);
    } catch (err) {
      console.error('Order creation error:', err);
      showToast('An error occurred while creating your order. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToCart}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank Transfer Protected Checkout</span>
          </div>
        </div>

        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-700 block">
            HABEEVATUSSUNNAH ONLINE BUSINESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-sans mt-0.5">
            Checkout & Bank Transfer
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: CUSTOMER INFORMATION */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span>1. CUSTOMER INFORMATION</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Fatima Abubakar"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.full_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.full_name && <p className="text-[11px] text-rose-600 mt-1">{errors.full_name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="e.g. 08034343283"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        errors.phone_number ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.phone_number && <p className="text-[11px] text-rose-600 mt-1">{errors.phone_number}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp_number}
                      onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                      placeholder="e.g. +2348034343283"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        errors.whatsapp_number ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.whatsapp_number && <p className="text-[11px] text-rose-600 mt-1">{errors.whatsapp_number}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* SECTION 2: DELIVERY ADDRESS */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span>2. DELIVERY ADDRESS (NIGERIA)</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_address}
                    onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                    placeholder="House number, Street name, Landmark"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.delivery_address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.delivery_address && <p className="text-[11px] text-rose-600 mt-1">{errors.delivery_address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      City / Town <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Abuja, Kano, Lagos, Kaduna"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. FCT, Kano, Lagos, Kaduna"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        errors.state ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                    {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additional_notes}
                    onChange={e => setFormData({ ...formData, additional_notes: e.target.value })}
                    placeholder="Closest landmark, preferred delivery time, or color specification..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* SECTION 3: PAYMENT SECTION (ONLY HERE DISPLAY OPAY ACCOUNT DETAILS) */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-sky-400/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                      <CreditCard className="w-5 h-5" />
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                      3. PAY WITH OPAY (BANK TRANSFER)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-sky-700 text-white text-[10px] font-black rounded uppercase">
                    {settings.payment_provider}
                  </span>
                </div>

                <div className="p-5 bg-sky-50/70 rounded-2xl border border-sky-200/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Payment Provider
                      </span>
                      <strong className="text-slate-900 text-sm">{settings.payment_provider}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Account Name
                      </span>
                      <strong className="text-slate-900 text-sm">{settings.account_name}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Account Number
                      </span>
                      <span className="text-2xl font-black text-slate-950 font-mono tracking-wider">
                        {settings.account_number}
                      </span>
                    </div>

                    {/* COPY ACCOUNT NUMBER BUTTON */}
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
                        accountCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 hover:bg-blue-900 text-white'
                      }`}
                    >
                      {accountCopied ? (
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

                <p className="text-xs text-slate-500 leading-relaxed">
                  Make your transfer to the verified account above. After clicking "Place Order", your unique Order ID will be generated, and you can tap "I Have Made Payment" to verify your order instantly on WhatsApp.
                </p>
              </div>
            </div>

            {/* ORDER SUMMARY (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 pb-3 border-b border-slate-100">
                ORDER SUMMARY ({cart.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                    <img
                      src={item.product.main_image}
                      alt={item.product.name}
                      className="w-14 h-16 rounded-xl object-contain p-0.5 bg-slate-50 shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Qty: {item.quantity} {item.selected_size && `· ${item.selected_size}`} {item.selected_color && `· ${item.selected_color}`}
                      </div>
                      <div className="font-black text-slate-950 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Nationwide Delivery Fee</span>
                  <span className="font-bold text-slate-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-blue-950 text-xl font-mono">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || cart.length === 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-slate-950 hover:bg-blue-900 active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <span>CONFIRMING ORDER...</span>
                  ) : (
                    <>
                      <span>CONFIRM & PLACE ORDER</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center space-y-1">
                <p>Transfer via OPAY directly to {settings.account_name}. Safe, verified fulfillment.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
