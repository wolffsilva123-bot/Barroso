import {ShieldCheck} from 'lucide-react';
import {VirtualAssistant} from './components/VirtualAssistant';
import {PixPaymentCard} from './components/PixPaymentCard';
import {ReceiptConfirmation} from './components/ReceiptConfirmation';
import {PaymentSteps} from './components/PaymentSteps';
import {SecuritySeals} from './components/SecuritySeals';
import {WhatsAppSupportButton} from './components/WhatsAppSupportButton';
import {ThemeToggle} from './components/ThemeToggle';
import {PIX_PAYMENT_DATA} from './constants/pixData';
import {useTheme} from './hooks/useTheme';

export default function App() {
  const {theme, toggleTheme} = useTheme();

  return (
    <div className="min-h-screen bg-[#F7F9FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative flex flex-col justify-between overflow-x-hidden transition-colors duration-200">
      {/* Subtle financial architectural background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full opacity-60 dark:opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0, 168, 143, 0.11) 0%, rgba(15, 23, 42, 0.02) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* Main Centered Bio Site Canvas */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10 sm:py-10 flex-1 flex flex-col gap-6 sm:gap-8">
        {/* Clean Top Utility Row with Theme Switcher */}
        <div className="flex items-center justify-between gap-4 animate-fade-slide-up">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {PIX_PAYMENT_DATA.receiverName}
            <span aria-hidden="true" className="mx-2 text-slate-300 dark:text-slate-700">
              ·
            </span>
            Recebimento via Pix
          </p>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Top Virtual Assistant with Automatic Audio */}
        <VirtualAssistant />

        {/* Centered Payment via Pix Card */}
        <PixPaymentCard />

        {/* Post-Payment Receipt & Visual Confirmation */}
        <ReceiptConfirmation />

        {/* Three-Step Customer Instructions */}
        <PaymentSteps />

        {/* Visual Trust & Security Seals */}
        <SecuritySeals />
      </main>

      {/* Clean Institutional Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-colors duration-200 animate-fade-slide-up [animation-delay:460ms]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <ShieldCheck
            className="w-4 h-4 text-[#00A88F] dark:text-teal-400 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {PIX_PAYMENT_DATA.footerText}
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <WhatsAppSupportButton />
    </div>
  );
}
