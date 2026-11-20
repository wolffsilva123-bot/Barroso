import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  CheckCircle2,
  FileText,
  Paperclip,
  Trash2,
  Check,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface AttachedReceipt {
  name: string;
  sizeLabel: string;
  typeLabel: string;
  previewUrl: string | null;
}

type ProcessingPhase = 'idle' | 'processing' | 'complete';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1).replace('.', ',')} MB`;
}

function formatCurrentTime(): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  } catch {
    return '';
  }
}

export function ReceiptConfirmation() {
  const [receipt, setReceipt] = useState<AttachedReceipt | null>(null);
  const [paymentInformedAt, setPaymentInformedAt] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const clearProgressTimer = () => {
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearProgressTimer();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const startProcessingSimulation = () => {
    clearProgressTimer();
    setProcessingPhase('processing');
    setProgress(12);

    const checkpoints = [28, 46, 67, 84, 96, 100];
    let stepIndex = 0;

    progressIntervalRef.current = window.setInterval(() => {
      const nextValue = checkpoints[stepIndex];
      stepIndex += 1;

      if (nextValue === undefined || nextValue >= 100) {
        setProgress(100);
        setProcessingPhase('complete');
        clearProgressTimer();
        setPaymentInformedAt((prev) => prev || formatCurrentTime());
      } else {
        setProgress(nextValue);
      }
    }, 150);
  };

  const processSelectedFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setFileError('Selecione uma imagem (JPG, PNG) ou arquivo PDF do comprovante.');
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const previewUrl = isImage ? URL.createObjectURL(file) : null;
    if (previewUrl) {
      previewUrlRef.current = previewUrl;
    }

    setFileError(null);
    setReceipt({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      typeLabel: isImage ? 'Imagem' : 'PDF',
      previewUrl,
    });

    startProcessingSimulation();
  };

  const handleSelectFileClick = () => {
    setFileError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemoveReceipt = () => {
    clearProgressTimer();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setReceipt(null);
    setProcessingPhase('idle');
    setProgress(0);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleInformed = () => {
    if (paymentInformedAt) {
      setPaymentInformedAt(null);
    } else {
      setPaymentInformedAt(formatCurrentTime());
    }
  };

  const progressStageLabel =
    processingPhase === 'complete'
      ? 'Comprovante processado'
      : progress < 45
        ? 'Lendo arquivo selecionado...'
        : progress < 85
          ? 'Verificando formato do comprovante...'
          : 'Finalizando registro visual...';

  return (
    <section
      aria-labelledby="receipt-section-heading"
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-colors duration-200 animate-fade-slide-up [animation-delay:210ms]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h2
            id="receipt-section-heading"
            className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight"
          >
            Já realizou o pagamento?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Anexe seu comprovante para conferência visual ou confirme abaixo que já concluiu a transferência.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Selecionar arquivo do comprovante de pagamento"
      />

      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleSelectFileClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-[52px] px-5 py-3 rounded-2xl border border-dashed active:scale-[0.99] text-slate-800 dark:text-slate-100 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] cursor-pointer ${
            isDragging
              ? 'border-[#00A88F] bg-[#00A88F]/10 dark:border-teal-400 dark:bg-[#00A88F]/15'
              : 'border-slate-300 dark:border-slate-700 hover:border-[#00A88F] dark:hover:border-teal-400 hover:bg-[#00A88F]/[0.03] dark:hover:bg-[#00A88F]/10'
          }`}
        >
          {processingPhase === 'processing' ? (
            <>
              <Loader2
                className="w-4 h-4 text-[#00A88F] dark:text-teal-400 shrink-0 animate-spin"
                aria-hidden="true"
              />
              <span>Processando arquivo...</span>
            </>
          ) : (
            <>
              <Paperclip
                className="w-4 h-4 text-[#00A88F] dark:text-teal-400 shrink-0"
                aria-hidden="true"
              />
              <span>{receipt ? 'Trocar comprovante' : 'Anexar comprovante'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleToggleInformed}
          aria-pressed={Boolean(paymentInformedAt)}
          className={`min-h-[52px] px-5 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer ${
            paymentInformedAt
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 focus-visible:ring-emerald-600'
              : 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100'
          }`}
        >
          {paymentInformedAt ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" aria-hidden="true" />
              <span>Pagamento informado</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Informar que já paguei</span>
            </>
          )}
        </button>
      </div>

      {/* File Validation Error */}
      <AnimatePresence>
        {fileError && (
          <motion.p
            role="alert"
            initial={{opacity: 0, y: -4}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -4}}
            transition={{duration: 0.15}}
            className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Visual Confirmation & Progress Feedback */}
      <AnimatePresence>
        {(receipt || paymentInformedAt) && (
          <motion.div
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -4}}
            transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4"
          >
            {/* Attached Receipt Preview & Processing Progress Bar */}
            {receipt && (
              <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {receipt.previewUrl ? (
                      <img
                        src={receipt.previewUrl}
                        alt={`Pré-visualização do comprovante ${receipt.name}`}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#00A88F] dark:text-teal-400 shrink-0">
                        <FileText className="w-5 h-5" aria-hidden="true" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {receipt.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        {receipt.typeLabel}
                        <span aria-hidden="true" className="mx-1.5 text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        {receipt.sizeLabel}
                        <span aria-hidden="true" className="mx-1.5 text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        {processingPhase === 'complete'
                          ? 'Conferido na tela'
                          : 'Em processamento'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    aria-label="Remover comprovante anexado"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* File Processing Progress Bar */}
                {processingPhase !== 'idle' && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        {processingPhase === 'processing' ? (
                          <Loader2
                            className="w-3.5 h-3.5 text-[#00A88F] dark:text-teal-400 animate-spin shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span>{progressStageLabel}</span>
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200">
                        {progress}%
                      </span>
                    </div>

                    <div
                      role="progressbar"
                      aria-label="Progresso do processamento do comprovante"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                      className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden"
                    >
                      <div
                        className={`h-full w-full origin-left rounded-full transition-transform duration-150 ease-out ${
                          processingPhase === 'complete'
                            ? 'bg-emerald-600 dark:bg-emerald-500'
                            : 'bg-[#00A88F]'
                        }`}
                        style={{transform: `scaleX(${progress / 100})`}}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Feedback Message */}
            {(!receipt || processingPhase === 'complete') && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/70 px-4 py-3.5"
              >
                <div className="flex items-start sm:items-center gap-2.5 text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium leading-snug">
                    {receipt
                      ? 'Comprovante registrado visualmente com sucesso. Guarde-o caso seja solicitado no atendimento.'
                      : 'Obrigado! Pagamento marcado como realizado. Guarde seu comprovante para eventuais conferências.'}
                    {paymentInformedAt && (
                      <span className="text-emerald-700/90 dark:text-emerald-300 tabular-nums">
                        {' '}
                        ({paymentInformedAt})
                      </span>
                    )}
                  </p>
                </div>

                {paymentInformedAt && (
                  <button
                    type="button"
                    onClick={handleToggleInformed}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Desfazer</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
