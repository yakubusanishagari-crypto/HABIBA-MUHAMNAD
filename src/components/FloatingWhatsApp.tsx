import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createGeneralWhatsAppUrl } from '../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useShop();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = createGeneralWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Habeevatussunnah Online Business! I have an inquiry about an order or product.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Optional Help Prompt Bubble */}
      {showTooltip && (
        <div className="bg-white border border-slate-200/90 shadow-xl rounded-2xl p-3 max-w-xs text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 relative flex items-start gap-2">
          <div className="flex-1">
            <p className="font-bold text-slate-900">Need help or want to order?</p>
            <p className="text-slate-500 mt-0.5">Chat directly with Habeevatussunnah on WhatsApp!</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            title="Dismiss message"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3.5 rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
        title="Chat on WhatsApp (+2348034343283)"
        aria-label="Open WhatsApp Chat"
      >
        <MessageCircle className="w-6 h-6 shrink-0 fill-current" />
        <span className="font-bold text-sm tracking-wide hidden sm:inline">Chat With Us</span>
      </a>
    </div>
  );
};
