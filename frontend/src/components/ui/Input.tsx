import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

/* ── Shared label ─────────────────────────────────────────────────── */
interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}
export const Label = ({ htmlFor, required, children, className }: LabelProps) => (
  <label
    htmlFor={htmlFor}
    className={clsx('block text-sm font-medium text-gray-700 mb-1.5', className)}
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

/* ── Error message ────────────────────────────────────────────────── */
export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

/* ── Base input classes ───────────────────────────────────────────── */
const inputBase = clsx(
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900',
  'placeholder:text-gray-400 transition-colors duration-150',
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
);

/* ── Input ────────────────────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, rightAddon, className, id, required, ...props }, ref) => {
    const fieldId = id ?? `field-${props.name}`;
    return (
      <div>
        {label && <Label htmlFor={fieldId} required={required}>{label}</Label>}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3.5 text-gray-400">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={clsx(
              inputBase,
              error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
              leftAddon && 'pl-10',
              rightAddon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3.5 text-gray-400">{rightAddon}</span>
          )}
        </div>
        <FieldError message={error} />
      </div>
    );
  },
);
Input.displayName = 'Input';

/* ── Textarea ─────────────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const fieldId = id ?? `field-${props.name}`;
    return (
      <div>
        {label && <Label htmlFor={fieldId} required={required}>{label}</Label>}
        <textarea
          ref={ref}
          id={fieldId}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={clsx(
            inputBase,
            'resize-none leading-relaxed',
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className,
          )}
          {...props}
        />
        <FieldError message={error} />
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
