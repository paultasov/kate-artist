import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const LABEL_CLASSES =
  'text-ink-foreground/50 peer-focus:text-primary pointer-events-none absolute top-4 left-0 origin-left scale-100 text-base transition-all duration-300 peer-focus:top-0 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-75';

const FIELD_CLASSES =
  'peer border-ink-foreground/30 text-ink-foreground focus:border-primary w-full border-b bg-transparent pt-6 pb-2 outline-none transition-colors';

interface FloatingTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingTextField = forwardRef<HTMLInputElement, FloatingTextFieldProps>(function FloatingTextField(
  { label, error, id, className, ...props },
  ref
) {
  return (
    <div className={className}>
      <div className="relative">
        <input id={id} ref={ref} placeholder=" " className={FIELD_CLASSES} {...props} />
        <label
          htmlFor={id}
          className={LABEL_CLASSES}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        >
          {label}
        </label>
      </div>
      {error && <span className="text-love mt-1.5 block text-xs">{error}</span>}
    </div>
  );
});

interface FloatingTextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FloatingTextareaField = forwardRef<HTMLTextAreaElement, FloatingTextareaFieldProps>(
  function FloatingTextareaField({ label, error, id, className, rows = 4, ...props }, ref) {
    return (
      <div className={className}>
        <div className="relative">
          <textarea
            id={id}
            ref={ref}
            placeholder=" "
            rows={rows}
            className={`${FIELD_CLASSES} resize-none`}
            {...props}
          />
          <label
            htmlFor={id}
            className={LABEL_CLASSES}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          >
            {label}
          </label>
        </div>
        {error && <span className="text-love mt-1.5 block text-xs">{error}</span>}
      </div>
    );
  }
);
