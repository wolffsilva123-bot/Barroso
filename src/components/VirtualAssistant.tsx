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
    <motion.section
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
      aria-label="Assistente virtual de pagamento"
      className="relative w-full bg-[#0E1422]/90 backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_45px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      {/* Subtle top-left electric violet/blue ambient sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Animated Avatar Container */}
        <div className="flex items-center gap-4 sm:block shrink-0">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            {/* Expanding acoustic ring while speaking */}
            {isSpeaking && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-indigo-400/60 animate-avatar-halo"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-sky-400/40 animate-avatar-halo"
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
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-800 ring-2 transition-all duration-200 ${
                isSpeaking
                  ? 'ring-indigo-400 ring-offset-2 ring-offset-[#0E1422] shadow-[0_0_24px_rgba(99,102,241,0.45)]'
                  : 'ring-white/15'
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900 text-indigo-400">
                  <User className="w-8 h-8" aria-hidden="true" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Mobile Header Title beside Avatar */}
          <div className="sm:hidden min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <p className="font-display text-base font-bold text-white tracking-tight">
                Assistente Virtual
              </p>
              {isSpeaking && <SpeakingBars />}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
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
              <p className="font-display text-base font-bold text-white tracking-tight">
                Assistente Virtual
              </p>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-xs font-medium text-slate-400">
                {isSpeaking
                  ? 'Falando agora'
                  : needsGesture
                    ? 'Áudio aguardando interação'
                    : 'Orientação por voz'}
              </span>
              {isSpeaking && <SpeakingBars />}
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-200 tracking-[0.005em]">
            “{PIX_PAYMENT_DATA.assistantMessage}”
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {needsGesture ? (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={speak}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#5B52F0] hover:to-[#4B8EF8] active:scale-[0.98] text-white text-sm font-semibold shadow-[0_0_22px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1422] whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Ouvir mensagem</span>
              </button>
            ) : isSpeaking ? (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={stop}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] active:scale-[0.98] text-slate-100 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1422] whitespace-nowrap cursor-pointer"
              >
                <VolumeX className="w-4 h-4 shrink-0 text-slate-300" aria-hidden="true" />
                <span>Silenciar áudio</span>
              </button>
            ) : (
              <button
                type="button"
                data-assistant-audio-control="true"
                onClick={speak}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] active:scale-[0.98] text-slate-100 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1422] whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>Ouvir novamente</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
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
          className="w-[3px] h-full rounded-full bg-gradient-to-t from-indigo-500 to-sky-400 animate-voice-wave"
          style={{animationDelay: delay}}
        />
      ))}
    </span>
  );
}
