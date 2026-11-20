import {ShieldCheck, Lock, FileCheck2} from 'lucide-react';

const SECURITY_SEALS = [
  {
    id: 'safe-payment',
    title: 'Pagamento 100% Seguro',
    description: 'Transferência direta pelo app do seu banco',
    Icon: ShieldCheck,
  },
  {
    id: 'encrypted-data',
    title: 'Dados Criptografados',
    description: 'Proteção ativa durante toda a navegação',
    Icon: Lock,
  },
  {
    id: 'ssl-certificate',
    title: 'Certificado SSL',
    description: 'Conexão autenticada via protocolo HTTPS',
    Icon: FileCheck2,
  },
] as const;

export function SecuritySeals() {
  return (
    <section
      aria-label="Selos de segurança e confiança"
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-[0_4px_20px_rgb(15,23,42,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.25)] transition-colors duration-200 animate-fade-slide-up [animation-delay:340ms]"
    >
      <ul className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        {SECURITY_SEALS.map(({id, title, description, Icon}) => (
          <li
            key={id}
            className="p-5 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00A88F]/10 dark:bg-[#00A88F]/15 text-[#00A88F] dark:text-teal-400 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
