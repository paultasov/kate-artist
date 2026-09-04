import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, error, id, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted text-[11px] font-bold tracking-[0.15em] uppercase">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        className="bg-ink/[0.035] border-ink/20 hover:border-ink/40 focus:border-primary w-full resize-none rounded-sm border-2 px-4 py-3 text-[15px] leading-relaxed transition-[border-color,box-shadow] duration-200 outline-none focus:shadow-[3px_3px_0_var(--color-primary)]"
        {...props}
      />
      {error && <span className="text-love text-xs">{error}</span>}
    </div>
  );
});
