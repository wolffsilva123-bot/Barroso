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
  const [buttonCopied, setButtonCopied] = useState(false);
  const [copyPulseKey, setCopyPulseKey] = useState(0);
  const [showBanks, setShowBanks] = useState(false);
  const [bankNotice, setBankNotice] = useState<string | null>(null);

  const copiedTimerRef = useRef<number | null>(null);
  const buttonCopiedTimerRef = useRef<number | null>(null);
  const bankTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
      if (buttonCopiedTimerRef.current !== null) {
        window.clearTimeout(buttonCopiedTimerRef.current);
      }
      if (bankTimerRef.current !== null) {
        window.clearTimeout(bankTimerRef.current);
      }
    };
  }, []);

  const triggerCopyFeedback = () => {
    setCopied(true);
    setButtonCopied(true);
    setCopyPulseKey((k) => k + 1);

    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 6000);

    if (buttonCopiedTimerRef.current !== null) {
      window.clearTimeout(buttonCopiedTimerRef.current);
    }
    buttonCopiedTimerRef.current = window.setTimeout(() => {
      setButtonCopied(false);
    }, 2600);
  };

  const handleCopyPix = async () => {
    const ok = await copyToClipboard(PIX_PAYMENT_DATA.pixKey);
    if (ok) {
      triggerCopyFeedback();
      setShowBanks(true);
    }
  };

  const handleOpenBankApp = async (bank: BankAppOption) => {
    await copyToClipboard(PIX_PAYMENT_DATA.pixKey);
    triggerCopyFeedback();

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
    <section
      aria-labelledby="pix-payment-heading"
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_14px_40px_rgb(15,23,42,0.05)] dark:shadow-[0_14px_40px_rgb(0,0,0,0.35)] transition-colors duration-200 animate-fade-slide-up [animation-delay:140ms]"
    >
      {/* Centered Payment Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#00A88F]/10 dark:bg-[#00A88F]/15 flex items-center justify-center mb-4">
          <PixLogo className="w-7 h-7" />
        </div>

        <h1
          id="pix-payment-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight text-balance"
        >
          {PIX_PAYMENT_DATA.title}
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Transferência instantânea
          <span aria-hidden="true" className="mx-2 text-slate-300 dark:text-slate-700">
            ·
          </span>
          Disponível 24h
        </p>
      </div>

      {/* Receiver Information Ledger */}
      <div className="mt-8 border-t border-b border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Nome</span>
          <span className="text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100">
            {PIX_PAYMENT_DATA.receiverName}
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Banco recebedor
          </span>
          <span className="text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100">
            {PIX_PAYMENT_DATA.receiverBank}
          </span>
        </div>

        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Chave Pix ({PIX_PAYMENT_DATA.pixKeyType})
          </span>
          <span className="font-mono tabular-nums text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-wide select-all">
            {PIX_PAYMENT_DATA.pixKey}
          </span>
        </div>
      </div>

      {/* Dominant Primary Action Button */}
      <div className="mt-8 relative">
        {/* Expanding emerald pulse ring on click */}
        {copyPulseKey > 0 && buttonCopied && (
          <motion.span
            key={`ring-${copyPulseKey}`}
            aria-hidden="true"
            initial={{opacity: 0.55, scale: 0.98}}
            animate={{opacity: 0, scale: 1.05}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-500"
          />
        )}

        <motion.button
          type="button"
          onClick={handleCopyPix}
          whileTap={{scale: 0.965}}
          animate={
            buttonCopied
              ? {scale: [1, 1.018, 1]}
              : {scale: 1}
          }
          transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
          className={`relative w-full min-h-[60px] px-6 py-4 rounded-2xl font-display font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer ${
            buttonCopied
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 focus-visible:ring-emerald-600'
              : 'bg-[#00A88F] hover:bg-[#008F7A] text-white shadow-lg shadow-[#00A88F]/20 focus-visible:ring-[#00A88F]'
          }`}
        >
          <span className="relative flex items-center justify-center w-7 h-7 shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              {buttonCopied ? (
                <motion.span
                  key={`check-${copyPulseKey}`}
                  initial={{scale: 0.4, rotate: -20, opacity: 0}}
                  animate={{scale: 1, rotate: 0, opacity: 1}}
                  exit={{scale: 0.5, rotate: 12, opacity: 0}}
                  transition={{type: 'spring', stiffness: 520, damping: 24}}
                  className="w-7 h-7 rounded-full bg-white text-emerald-600 shadow-sm flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{pathLength: 0}}
                      animate={{pathLength: 1}}
                      transition={{duration: 0.28, delay: 0.06, ease: 'easeOut'}}
                    />
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="copy-icon"
                  initial={{scale: 0.7, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  exit={{scale: 0.6, rotate: 12, opacity: 0}}
                  transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
                  className="flex items-center justify-center"
                >
                  <Copy className="w-5 h-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          <AnimatePresence mode="wait" initial={false}>
            {buttonCopied ? (
              <motion.span
                key="label-copied"
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -4}}
                transition={{duration: 0.16}}
                className="whitespace-nowrap"
              >
                CHAVE PIX COPIADA
              </motion.span>
            ) : (
              <motion.span
                key="label-copy"
                initial={{opacity: 0, y: 4}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -4}}
                transition={{duration: 0.16}}
                className="whitespace-nowrap"
              >
                {PIX_PAYMENT_DATA.copyButtonLabel}
              </motion.span>
            )}
          </AnimatePresence>
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
              className="mt-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/70 px-4 py-3 flex items-center justify-center gap-2.5 text-emerald-800 dark:text-emerald-200"
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" aria-hidden="true" />
              <span className="text-sm font-semibold">
                {PIX_PAYMENT_DATA.copySuccessMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bank App Quick Launcher */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowBanks((prev) => !prev)}
          aria-expanded={showBanks}
          className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold flex items-center justify-between gap-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] cursor-pointer"
        >
          <span className="flex items-center gap-2.5 text-left">
            <Smartphone className="w-4 h-4 text-[#00A88F] dark:text-teal-400 shrink-0" aria-hidden="true" />
            <span>Abrir aplicativo do seu banco</span>
          </span>
          {showBanks ? (
            <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center sm:text-left">
                Selecione seu banco para copiar a chave e abrir o aplicativo no celular:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {BANK_APPS.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleOpenBankApp(bank)}
                    className="min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.98] flex items-center gap-2.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-lg text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{backgroundColor: bank.accentHex}}
                    >
                      {bank.shortLabel}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate flex-1">
                      {bank.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" aria-hidden="true" />
                  </button>
                ))}
              </div>

              {bankNotice && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5"
                >
                  {bankNotice}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
