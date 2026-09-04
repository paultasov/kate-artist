import { XIcon } from '@phosphor-icons/react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseButton({ onClick, className }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Закрыть"
      className={`group border-ink/20 text-ink hover:border-primary hover:bg-primary hover:text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${className ?? ''}`}
    >
      <span className="inline-flex transition-transform duration-200 group-hover:rotate-90">
        <XIcon size={16} weight="bold" />
      </span>
    </button>
  );
}
