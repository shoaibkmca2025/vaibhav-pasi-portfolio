// Small building blocks for the dashboard, in the site's visual language.
// Controls are at least 44px tall and every input has a visible label.
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-yellow text-black hover:brightness-110 disabled:brightness-75',
  secondary: 'border border-white/15 text-white hover:bg-white/[0.06] hover:border-white/30',
  ghost: 'text-gray-300 hover:text-white hover:bg-white/[0.06]',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
};

export function Button({
  variant = 'secondary',
  busy = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={`inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-full text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  aside,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-bold tracking-wider uppercase text-gray-300">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-gray-500 leading-snug">{hint}</p>
      )}
    </div>
  );
}

export const inputClass =
  'w-full min-h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-base text-white placeholder:text-gray-600 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.06] aria-[invalid=true]:border-red-400/70';

export function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-4 cursor-pointer min-h-11 py-1">
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        {description && <span className="block text-sm text-gray-500 mt-0.5">{description}</span>}
      </span>
      <span className="relative shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block w-11 h-6 rounded-full bg-white/15 transition-colors peer-checked:bg-brand-yellow peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand-yellow peer-focus-visible:outline-offset-2" />
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 peer-checked:bg-black" />
      </span>
    </label>
  );
}

export function Panel({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      {title && <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">{title}</h2>}
      {children}
    </section>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error' | 'warning'; children: ReactNode }) {
  const tones = {
    info: 'border-white/15 bg-white/[0.04] text-gray-200',
    success: 'border-green-400/30 bg-green-400/10 text-green-100',
    error: 'border-red-400/40 bg-red-400/10 text-red-100',
    warning: 'border-accent/30 bg-brand-yellow/10 text-yellow-50',
  };
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  );
}

// Confirmation for destructive actions; Escape or Cancel closes it
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-dark-gray p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold">
          {title}
        </h2>
        <div className="mt-2 text-sm text-gray-400 leading-relaxed">{message}</div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button autoFocus onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" busy={busy} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-gray-400" role="status">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
