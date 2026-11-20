import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Check,
  Copy,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import {BANK_APPS, PIX_PAYMENT_DATA, type BankAppOption} from '../constants/pixData';
import {copyToClipboard} from '../utils/clipboard';
import {PixLogo} from './PixLogo';

export function PixPaymentCard() {
  const [copied, setCopied] = useState(false);
  const [copyPulseKey, setCopyPulseKey] = useState(0);
  const [showBanks, setShowBanks] = useState(false);
  const [bankNotice, setBankNotice] = useState<string | null>(null);

  const copiedTimerRef = useRef<number | null>(null);
  const bankTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      if (bankTimerRef.current !== null) {
        window.clearTimeout(bankTimerRef.current);
      }
    };
  }, []);

  const handleCopyPix = async () => {
    const ok = await copyToClipboard(PIX_PAYMENT_DATA.pixKey);
    if (ok) {
      setCopied(true);
      setCopyPulseKey((k) => k + 1);
      setShowBanks(true);

      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 6000);
    }
  };

  const handleOpenBankApp = async (bank: BankAppOption) => {
    await copyToClipboard(PIX_PAYMENT_DATA.pixKey);
    setCopied(true);

    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 6000);

    const isMobileDevice =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobileDevice) {
      // Attempt native mobile app scheme without leaving or breaking current page
      const link = document.createElement('a');
      link.href = bank.scheme;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (bankTimerRef.current !== null) {
        window.clearTimeout(bankTimerRef.current);
      }

      bankTimerRef.current = window.setTimeout(() => {
        if (!document.hidden) {
          setBankNotice(
            `Chave copiada! Caso o aplicativo ${bank.name} não tenha aberto automaticamente, abra-o na tela inicial do seu celular e cole a chave Pix.`
          );
        }
      }, 1100);
    } else {
      setBankNotice(
        `Chave Pix copiada! Abra o aplicativo ${bank.name} no seu celular (ou internet banking) e cole a chave ${PIX_PAYMENT_DATA.pixKey}.`
      );
    }
  };

  return (
    <motion.section
      initial={{opacity: 0, y: 14}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1]}}
      aria-labelledby="pix-payment-heading"
      className="relative w-full bg-[#0E1422]/95 backdrop-blur-md border border-white/[0.09] rounded-3xl p-6 sm:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_rgba(0,0,0,0.55)] overflow-hidden"
    >
      {/* Subtle electric blue-violet top specular glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 rounded-full bg-indigo-500/[0.12] blur-3xl"
      />

      {/* Centered Payment Header */}
      <div className="relative flex flex-col items-center text-center">
        <div className="w-13 h-13 rounded-2xl bg-indigo-500/[0.12] border border-indigo-400/25 shadow-[0_0_24px_rgba(99,102,241,0.2)] flex items-center justify-center mb-4">
          <PixLogo className="w-7 h-7" />
        </div>

        <h1
          id="pix-payment-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance"
        >
          {PIX_PAYMENT_DATA.title}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Transferência instantânea
          <span aria-hidden="true" className="mx-2 text-slate-600">
            ·
          </span>
          Disponível 24h
        </p>
      </div>

      {/* Receiver Information Ledger */}
      <div className="relative mt-8 bg-[#090D18]/75 border border-white/[0.07] rounded-2xl px-5 sm:px-6 divide-y divide-white/[0.06]">
        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400">Nome</span>
          <span className="text-base sm:text-[17px] font-semibold text-white tracking-[0.01em]">
            {PIX_PAYMENT_DATA.receiverName}
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400">
            Banco recebedor
          </span>
          <span className="text-base sm:text-[17px] font-semibold text-white tracking-[0.01em]">
            {PIX_PAYMENT_DATA.receiverBank}
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400">
            Chave Pix ({PIX_PAYMENT_DATA.pixKeyType})
          </span>
          <span className="font-mono tabular-nums text-lg sm:text-xl font-semibold text-sky-300 tracking-wider select-all">
            {PIX_PAYMENT_DATA.pixKey}
          </span>
        </div>
      </div>

      {/* Dominant Primary Action Button with Subtle Luminous Glow */}
      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-300 ${
            copied
              ? 'bg-emerald-500/30 opacity-100'
              : 'bg-gradient-to-r from-indigo-600/35 via-violet-500/35 to-blue-500/35 opacity-85'
          }`}
        />

        <motion.button
          key={copyPulseKey}
          type="button"
          onClick={handleCopyPix}
          whileTap={{scale: 0.985}}
          className={`relative w-full min-h-[60px] px-6 py-4 rounded-2xl font-display font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1422] cursor-pointer ${
            copied
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_28px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:ring-emerald-400'
              : 'bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#3B82F6] hover:from-[#5B52F0] hover:via-[#7275F6] hover:to-[#4B8EF8] text-white shadow-[0_0_30px_rgba(99,102,241,0.42),inset_0_1px_0_rgba(255,255,255,0.24)] hover:shadow-[0_0_40px_rgba(99,102,241,0.58),inset_0_1px_0_rgba(255,255,255,0.3)] focus-visible:ring-indigo-400'
          }`}
        >
          {copied ? (
            <motion.span
              initial={{scale: 0.6, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{type: 'spring', stiffness: 420, damping: 24}}
              className="flex items-center gap-3"
            >
              <Check className="w-5 h-5 shrink-0 stroke-[2.5]" aria-hidden="true" />
              <span>CHAVE PIX COPIADA</span>
            </motion.span>
          ) : (
            <>
              <Copy className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{PIX_PAYMENT_DATA.copyButtonLabel}</span>
            </>
          )}
        </motion.button>

        {/* Accessible Confirmation Banner */}
        <AnimatePresence>
          {copied && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{opacity: 0, y: -6, scale: 0.98}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              className="mt-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-4 py-3 flex items-center justify-center gap-2.5 text-emerald-300"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-400 stroke-[2.5]" aria-hidden="true" />
              <span className="text-sm font-semibold">
                {PIX_PAYMENT_DATA.copySuccessMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bank App Quick Launcher */}
      <div className="relative mt-6 pt-6 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={() => setShowBanks((prev) => !prev)}
          aria-expanded={showBanks}
          className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-100 text-sm font-semibold flex items-center justify-between gap-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
        >
          <span className="flex items-center gap-2.5 text-left">
            <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>Abrir aplicativo do seu banco</span>
          </span>
          {showBanks ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {showBanks && (
            <motion.div
              initial={{opacity: 0, y: -6}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
              className="mt-4"
            >
              <p className="text-xs text-slate-400 mb-3 text-center sm:text-left">
                Selecione seu banco para copiar a chave e abrir o aplicativo no celular:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {BANK_APPS.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleOpenBankApp(bank)}
                    className="min-h-[48px] px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#141C2E]/90 hover:bg-[#1B253C] hover:border-indigo-400/35 active:scale-[0.98] flex items-center gap-2.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-lg text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm"
                      style={{backgroundColor: bank.accentHex}}
                    >
                      {bank.shortLabel}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate flex-1">
                      {bank.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 hidden sm:block" aria-hidden="true" />
                  </button>
                ))}
              </div>

              {bankNotice && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-xs leading-relaxed text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5"
                >
                  {bankNotice}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
