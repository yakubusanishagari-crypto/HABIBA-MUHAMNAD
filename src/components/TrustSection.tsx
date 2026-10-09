import React from 'react';
import { ShieldCheck, CreditCard, Headphones, ShoppingCart, MessageCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: 'QUALITY PRODUCTS',
      description: 'Hand-inspected materials, authentic fabrics, and long-lasting essentials.',
      iconColor: 'text-blue-900',
      bgColor: 'bg-blue-50/80'
    },
    {
      icon: CreditCard,
      title: 'CONVENIENT PAYMENT',
      description: 'Hassle-free direct bank transfer with zero hidden charges during checkout.',
      iconColor: 'text-sky-700',
      bgColor: 'bg-sky-50/80'
    },
    {
      icon: Headphones,
      title: 'CUSTOMER SUPPORT',
      description: 'Dedicated phone line at 08034343283 ready to assist your orders.',
      iconColor: 'text-blue-800',
      bgColor: 'bg-blue-50/80'
    },
    {
      icon: ShoppingCart,
      title: 'EASY ORDERING',
      description: 'Streamlined checkout with unique invoice tracking and rapid dispatch.',
      iconColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50/80'
    },
    {
      icon: MessageCircle,
      title: 'WHATSAPP SUPPORT',
      description: 'Click-to-chat verification directly on WhatsApp (+2348034343283).',
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50/80'
    }
  ];

  return (
    <section className="py-12 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl ${item.bgColor} ${item.iconColor} flex items-center justify-center mb-3 shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-[11px] font-black tracking-wider text-slate-950 uppercase font-sans">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
