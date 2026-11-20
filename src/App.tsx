import {ShieldCheck} from 'lucide-react';
import {VirtualAssistant} from './components/VirtualAssistant';
import {PixPaymentCard} from './components/PixPaymentCard';
import {PaymentSteps} from './components/PaymentSteps';
import {PIX_PAYMENT_DATA} from './constants/pixData';

export default function App() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative flex flex-col justify-between overflow-x-hidden">
      {/* Sophisticated dark fintech atmospheric lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[960px] h-[520px] rounded-full opacity-90 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.22) 0%, rgba(59, 130, 246, 0.1) 42%, transparent 72%)',
          }}
        />
        <div
          className="absolute bottom-[-180px] right-[-120px] w-[520px] h-[520px] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(124, 58, 237, 0.14) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Main Centered Bio Site Canvas */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:py-12 flex-1 flex flex-col gap-6 sm:gap-8">
        {/* Top Virtual Assistant with Automatic Audio */}
        <VirtualAssistant />

        {/* Centered Payment via Pix Card */}
        <PixPaymentCard />

        {/* Three-Step Customer Instructions */}
        <PaymentSteps />
      </main>

      {/* Clean Institutional Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.07] bg-[#0B101D]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <ShieldCheck
            className="w-4 h-4 text-indigo-400 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-slate-300">
            {PIX_PAYMENT_DATA.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
