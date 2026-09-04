import { useState, type MouseEvent } from 'react';
import { formatPrice, type Artwork } from '@/entities/artwork';
import { InquiryModal } from './InquiryModal';

interface BuyButtonProps {
  artwork: Artwork;
  className?: string;
  surface?: 'light' | 'dark';
}

export function BuyButton({ artwork, className, surface = 'light' }: BuyButtonProps) {
  const [open, setOpen] = useState(false);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  }

  const surfaceClasses =
    surface === 'dark'
      ? 'bg-gold text-gold-foreground border-gold border-2 shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_26px_-6px_rgba(201,162,39,0.6)] hover:-translate-y-0.5'
      : 'border-gold-deep text-gold-deep hover:bg-gold hover:text-gold-foreground border-2';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${surfaceClasses} font-display inline-flex items-center rounded-full px-5 py-2.5 text-[11px] leading-[1.15] tracking-widest uppercase transition-[background-color,color,box-shadow,transform] duration-200 hover:scale-[1.03] active:scale-95 ${className ?? ''}`}
      >
        Купить · {formatPrice(artwork.price)}
      </button>
      {open && <InquiryModal artwork={artwork} type="purchase" onClose={() => setOpen(false)} />}
    </>
  );
}
