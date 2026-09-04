import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'inverted' | 'gold';
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-ink text-canvas shadow-[0_1px_2px_rgba(32,28,23,0.08)] hover:shadow-[0_10px_24px_-6px_rgba(32,28,23,0.4)] hover:-translate-y-0.5',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-canvas hover:-translate-y-0.5',
  accent:
    'bg-acid text-acid-foreground shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_24px_-6px_rgba(41,182,232,0.5)] hover:-translate-y-0.5',
  inverted:
    'border border-ink-foreground/40 text-ink-foreground hover:bg-ink-foreground hover:text-ink hover:-translate-y-0.5',
  gold: 'bg-gold text-gold-foreground shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_24px_-6px_rgba(201,162,39,0.5)] hover:-translate-y-0.5',
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm leading-none font-semibold transition-[color,background-color,box-shadow,transform] duration-200 active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className ?? ''}`}
      {...props}
    />
  );
}
