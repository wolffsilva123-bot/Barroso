import {PAYMENT_STEPS} from '../constants/pixData';

const STEP_DELAY_CLASSES = [
  '[animation-delay:280ms]',
  '[animation-delay:340ms]',
  '[animation-delay:400ms]',
] as const;

export function PaymentSteps() {
  return (
    <section
      aria-labelledby="payment-steps-heading"
      className="w-full animate-fade-slide-up [animation-delay:260ms]"
    >
      <div className="mb-4 text-center sm:text-left">
        <h2
          id="payment-steps-heading"
          className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight"
        >
          Como realizar o pagamento
        </h2>
      </div>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PAYMENT_STEPS.map((item, idx) => (
          <li
            key={item.step}
            className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 flex md:flex-col items-start gap-3.5 md:gap-3 shadow-[0_4px_20px_rgb(15,23,42,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.25)] transition-colors duration-200 animate-fade-slide-up ${STEP_DELAY_CLASSES[idx] ?? ''}`}
          >
            <span className="font-mono tabular-nums text-sm font-semibold text-[#00A88F] dark:text-teal-400 bg-[#00A88F]/10 dark:bg-[#00A88F]/15 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              {item.step}
            </span>
            <p className="text-[15px] leading-snug font-medium text-slate-800 dark:text-slate-200 pt-1 md:pt-0">
              {item.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
