import {useCallback, useEffect, useRef, useState} from 'react';

export type AssistantSpeechStatus =
  | 'idle'
  | 'speaking'
  | 'waiting_gesture'
  | 'completed';

const FEMALE_VOICE_KEYWORDS = [
  'francisca',
  'luciana',
  'camila',
  'vitoria',
  'vitória',
  'fernanda',
  'maria',
  'thalita',
  'leila',
  'brenda',
  'elvira',
  'giovanna',
  'heloisa',
  'heloísa',
  'raquel',
  'leticia',
  'letícia',
  'google português do brasil',
  'google portugues do brasil',
  'female',
  'mulher',
  'natural',
];

const MALE_VOICE_KEYWORDS = [
  'daniel',
  'ricardo',
  'felipe',
  'antonio',
  'antônio',
  'julio',
  'júlio',
  'humberto',
  'nicolau',
  'valerio',
  'valério',
  'fabio',
  'fábio',
  'donato',
  'male',
  'homem',
];

function selectBrazilianFemaleVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const ptBrVoices = voices.filter((voice) => {
    const lang = voice.lang.toLowerCase().replace('_', '-');
    return lang === 'pt-br' || lang.startsWith('pt-br');
  });

  const ptAnyVoices =
    ptBrVoices.length > 0
      ? ptBrVoices
      : voices.filter((voice) => voice.lang.toLowerCase().startsWith('pt'));

  if (!ptAnyVoices.length) return null;

  const scoreVoice = (voice: SpeechSynthesisVoice): number => {
    const name = voice.name.toLowerCase();
    let score = 0;

    if (voice.lang.toLowerCase().replace('_', '-') === 'pt-br') {
      score += 50;
    }

    if (FEMALE_VOICE_KEYWORDS.some((kw) => name.includes(kw))) {
      score += 100;
    }

    if (MALE_VOICE_KEYWORDS.some((kw) => name.includes(kw))) {
      score -= 120;
    }

    if (name.includes('online') || name.includes('neural') || name.includes('enhanced')) {
      score += 25;
    }

    if (voice.localService) {
      score += 5;
    }

    return score;
  };

  return [...ptAnyVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function useSpeechAssistant(message: string) {
  const [status, setStatus] = useState<AssistantSpeechStatus>('idle');
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const isMountedRef = useRef(true);
  const autoplayAttemptedRef = useRef(false);
  const userStoppedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);
  const keepAliveTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (watchdogTimerRef.current !== null) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (keepAliveTimerRef.current !== null) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(
    (manual = true) => {
      if (manual) {
        userStoppedRef.current = true;
      }
      clearTimers();

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
          }
        } catch {
          // Ignore synthesis cancellation errors on restricted browsers
        }
      }

      if (isMountedRef.current) {
        setStatus((prev) => (prev === 'waiting_gesture' ? 'waiting_gesture' : 'completed'));
      }
    },
    [clearTimers]
  );

  const speak = useCallback(
    (isAutoplayAttempt = false) => {
      if (typeof window === 'undefined') return;
      clearTimers();

      if (!isAutoplayAttempt) {
        userStoppedRef.current = false;
      }

      const hasSpeechApi =
        'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

      if (!hasSpeechApi) {
        if (isAutoplayAttempt) {
          setStatus('waiting_gesture');
          return;
        }
        // Visual speaking fallback if the browser lacks Web Speech API
        setStatus('speaking');
        setHasPlayedOnce(true);
        fallbackTimerRef.current = window.setTimeout(() => {
          if (isMountedRef.current) {
            setStatus('completed');
          }
        }, 5500);
        return;
      }

      const synth = window.speechSynthesis;

      try {
        // Avoid unnecessary cancel() right before speak() on iOS Safari when idle
        if (synth.speaking || synth.pending) {
          synth.cancel();
        }
      } catch {
        // Ignore
      }

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.98;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      const voices = synth.getVoices();
      const chosenVoice = selectBrazilianFemaleVoice(voices);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      let started = false;

      utterance.onstart = () => {
        started = true;
        if (watchdogTimerRef.current !== null) {
          window.clearTimeout(watchdogTimerRef.current);
          watchdogTimerRef.current = null;
        }
        if (isMountedRef.current) {
          setStatus('speaking');
          setHasPlayedOnce(true);
        }

        // Guard against older mobile/desktop Chromium pausing long utterances
        keepAliveTimerRef.current = window.setInterval(() => {
          try {
            if (synth.speaking && synth.paused) {
              synth.resume();
            }
          } catch {
            // Ignore
          }
        }, 1200);
      };

      utterance.onend = () => {
        clearTimers();
        if (isMountedRef.current) {
          setStatus('completed');
        }
      };

      utterance.onerror = () => {
        clearTimers();
        if (!isMountedRef.current) return;

        if (!started && isAutoplayAttempt) {
          setStatus('waiting_gesture');
        } else if (!started && !isAutoplayAttempt) {
          // Graceful visual cadence if voice engine is unavailable after manual click
          setStatus('speaking');
          setHasPlayedOnce(true);
          fallbackTimerRef.current = window.setTimeout(() => {
            if (isMountedRef.current) {
              setStatus('completed');
            }
          }, 5500);
        } else {
          setStatus('completed');
        }
      };

      try {
        synth.speak(utterance);
      } catch {
        if (isAutoplayAttempt) {
          setStatus('waiting_gesture');
        } else {
          setStatus('speaking');
          setHasPlayedOnce(true);
          fallbackTimerRef.current = window.setTimeout(() => {
            if (isMountedRef.current) {
              setStatus('completed');
            }
          }, 5500);
        }
        return;
      }

      // Autoplay watchdog: iOS Safari & Android Chrome often block or queue speech without throwing
      watchdogTimerRef.current = window.setTimeout(() => {
        if (!started && isMountedRef.current) {
          if (isAutoplayAttempt) {
            try {
              if (synth.speaking || synth.pending) {
                synth.cancel();
              }
            } catch {
              // Ignore
            }
            setStatus('waiting_gesture');
          } else {
            // Manual tap fallback if OS has no speech voice installed
            setStatus('speaking');
            setHasPlayedOnce(true);
            fallbackTimerRef.current = window.setTimeout(() => {
              if (isMountedRef.current) {
                setStatus('completed');
              }
            }, 5500);
          }
        }
      }, isAutoplayAttempt ? 650 : 900);
    },
    [clearTimers, message]
  );

  // Attempt automatic playback when entering the page
  useEffect(() => {
    isMountedRef.current = true;
    if (typeof window === 'undefined') return;

    const triggerAutoplay = () => {
      if (autoplayAttemptedRef.current || userStoppedRef.current) return;
      autoplayAttemptedRef.current = true;
      speak(true);
    };

    const hasSpeechApi = 'speechSynthesis' in window;
    if (hasSpeechApi) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        triggerAutoplay();
      } else {
        const handleVoicesChanged = () => {
          triggerAutoplay();
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        const timer = window.setTimeout(triggerAutoplay, 250);

        return () => {
          window.clearTimeout(timer);
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
      }
    } else {
      triggerAutoplay();
    }
  }, [speak]);

  // Respect mobile autoplay restrictions: unlock immediately on user's first interaction
  useEffect(() => {
    if (status !== 'waiting_gesture' || hasPlayedOnce || userStoppedRef.current) {
      return;
    }

    const handleFirstInteraction = (event: Event) => {
      // Avoid double-triggering if the user directly tapped a dedicated assistant audio button
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-assistant-audio-control="true"]')) {
        return;
      }
      speak(false);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, {
      once: true,
      capture: true,
    });
    window.addEventListener('keydown', handleFirstInteraction, {
      once: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction, {
        capture: true,
      });
      window.removeEventListener('keydown', handleFirstInteraction, {
        capture: true,
      });
    };
  }, [status, hasPlayedOnce, speak]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      autoplayAttemptedRef.current = false;
      clearTimers();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [clearTimers]);

  return {
    status,
    isSpeaking: status === 'speaking',
    needsGesture: status === 'waiting_gesture',
    speak: () => speak(false),
    stop: () => stop(true),
  };
}
