import {motion} from 'motion/react';
import {PAYMENT_STEPS} from '../constants/pixData';

export function PaymentSteps() {
  return (
    <motion.section
      initial={{opacity: 0, y: 14}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1]}}
      aria-labelledby="payment-steps-heading"
      className="w-full"
    >
      <div className="mb-4 text-center sm:text-left">
        <h2
          id="payment-steps-heading"
          className="font-display text-lg font-bold text-white tracking-tight"
        >
          Como realizar o pagamento
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PAYMENT_STEPS.map((item) => (
          <li
            key={item.step}
            className="bg-[#0E1422]/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 flex md:flex-col items-start gap-3.5 md:gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_30px_rgba(0,0,0,0.35)]"
          >
            <span className="font-mono tabular-nums text-sm font-semibold text-indigo-300 bg-indigo-500/[0.15] border border-indigo-400/25 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              {item.step}
            </span>
            <p className="text-[15px] leading-snug font-medium text-slate-200 pt-1 md:pt-0 tracking-[0.005em]">
              {item.text}
            </p>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
