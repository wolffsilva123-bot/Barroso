import {MessageCircle} from 'lucide-react';
import {PIX_PAYMENT_DATA} from '../constants/pixData';

export function WhatsAppSupportButton() {
  const sanitizedPhone = PIX_PAYMENT_DATA.whatsappPhone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(PIX_PAYMENT_DATA.whatsappPrefilledMessage);

  const whatsappHref = sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-fade-slide-up [animation-delay:380ms]">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={PIX_PAYMENT_DATA.whatsappSupportLabel}
        className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-5 py-3 rounded-2xl bg-[#12804A] hover:bg-[#0E6B3D] active:scale-[0.98] text-white font-display text-sm font-semibold shadow-lg shadow-slate-900/15 dark:shadow-black/40 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12804A] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 whitespace-nowrap"
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>{PIX_PAYMENT_DATA.whatsappSupportLabel}</span>
      </a>
    </div>
  );
}
