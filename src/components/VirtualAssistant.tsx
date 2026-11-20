import {useState} from 'react';
import {motion} from 'motion/react';
import {Volume2, VolumeX, RotateCcw, User} from 'lucide-react';
import {PIX_PAYMENT_DATA} from '../constants/pixData';
import {useSpeechAssistant} from '../hooks/useSpeechAssistant';

export function VirtualAssistant() {
  const {isSpeaking, needsGesture, speak, stop} = useSpeechAssistant(
    PIX_PAYMENT_DATA.assistantMessage
  );
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <section
      aria-label="Assistente virtual de pagamento"
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-colors duration-200 animate-fade-slide-up [animation-delay:70ms]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Animated Avatar Container */}
        <div className="flex items-center gap-4 sm:block shrink-0">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            {/* Expanding acoustic ring while speaking */}
            {isSpeaking && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-[#00A88F]/50 animate-avatar-halo"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[#00A88F]/35 animate-avatar-halo"
                  style={{animationDelay: '0.6s'}}
                />
              </>
            )}

            <motion.div
              animate={
                isSpeaking
                  ? {scale: [1, 1.035, 1]}
                  : {scale: [1, 1.012, 1]}
              }
              transition={{
                duration: isSpeaking ? 1.15 : 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 transition-colors duration-200 ${
                isSpeaking
                  ? 'ring-[#00A88F] ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                  : 'ring-slate-200 dark:ring-slate-700'
              }`}
            >
              {!avatarFailed ? (
                <img
                  src={PIX_PAYMENT_DATA.assistantAvatarUrl}
                  alt="Assistente virtual de pagamentos via Pix"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 dark:from-teal-950 dark:to-slate-800 text-[#00A88F] dark:text-teal-400">
                  <User className="w-8 h-8" aria-hidden="true" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Mobile Header Title beside Avatar */}
          <div className="sm:hidden min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <p className="font-display text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Assistente Virtual
              </p>
              {isSpeaking && <SpeakingBars />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isSpeaking
                ? 'Reproduzindo orientação por voz'
                : needsGesture
                  ? 'Toque abaixo para ouvir a instrução'
                  : 'Orientação rápida para pagamento'}
            </p>
          </div>
        </div>

        {/* Speech Message & Audio Action Controls */}
        <div className="flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-between gap-4 mb-1.5">
            <div className="flex items-center gap-3">
              <p className="font-display text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Assistente Virtual
              </p>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                ·
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isSpeaking
                  ? 'Falando agora'
                  : needsGesture
                    ? 'Áudio aguardando interação'
                    : 'Orientação por voz'}
              </span>
              {isSpeaking && <SpeakingBars />}
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            “{PIX_PAYMENT_DATA.assistantMessage}”
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-3">
            {needsGesture ? (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={speak}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#00A88F] hover:bg-[#008F7A] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Ouvir mensagem</span>
              </button>
            ) : isSpeaking ? (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={stop}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-100 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap cursor-pointer"
              >
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Silenciar áudio</span>
              </button>
            ) : (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={speak}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-100 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0 text-[#00A88F] dark:text-teal-400" aria-hidden="true" />
                <span>Ouvir novamente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpeakingBars() {
  const delays = ['0ms', '140ms', '280ms', '180ms', '80ms'];

  return (
    <span
      className="inline-flex items-center gap-[3px] h-4"
      aria-hidden="true"
    >
      {delays.map((delay, idx) => (
        <span
          key={idx}
          className="w-[3px] h-full rounded-full bg-[#00A88F] animate-voice-wave"
          style={{animationDelay: delay}}
        />
      ))}
    </span>
  );
}
