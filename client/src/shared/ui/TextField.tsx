import { forwardRef, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, id, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted text-[11px] font-bold tracking-[0.15em] uppercase">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="bg-ink/[0.035] border-ink/20 hover:border-ink/40 focus:border-primary w-full rounded-sm border-2 px-4 py-3 text-[15px] transition-[border-color,box-shadow] duration-200 outline-none focus:shadow-[3px_3px_0_var(--color-primary)]"
        {...props}
      />
      {error && <span className="text-love text-xs">{error}</span>}
    </div>
  );
});
