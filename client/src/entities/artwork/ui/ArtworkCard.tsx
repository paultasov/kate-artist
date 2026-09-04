import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import type { Artwork, ArtworkOrientation } from '../model/types';
import { placeholderGradientFor } from '../lib/placeholderGradient';
import { formatPrice } from '../lib/formatPrice';
import { CategoryTag } from './CategoryTag';

interface ArtworkCardProps {
  artwork: Artwork;
  featured?: boolean;
  actions?: ReactNode;
  buyAction?: ReactNode;
  showPrice?: boolean;
  aspectClassName?: string;
}

const RATIO: Record<ArtworkOrientation, string> = {
  vertical: 'aspect-[3/4]',
  horizontal: 'aspect-[4/3]',
  square: 'aspect-square',
};

export function ArtworkCard({
  artwork,
  featured = false,
  actions,
  buyAction,
  showPrice = true,
  aspectClassName,
}: ArtworkCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState<CSSProperties>({});
  const reducedMotion = useReducedMotion();
  const href = `/artwork/${artwork.id}`;

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      transform: `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`,
    });
  }

  return (
    <div>
      <Link
        ref={ref}
        to={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({})}
        style={{ transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)', ...tilt }}
        className={`group relative block overflow-hidden rounded-sm ${aspectClassName ?? RATIO[artwork.orientation ?? 'vertical']}`}
      >
        {artwork.imageUrl ? (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            role="img"
            aria-label={artwork.title}
            className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ background: placeholderGradientFor(artwork.id) }}
          />
        )}
        <div className="from-ink/70 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80" />
        <CategoryTag category={artwork.category} className="absolute top-3 left-3" />
        {actions && <div className="absolute top-3 right-3">{actions}</div>}
      </Link>
      <div className="mt-5">
        <Link to={href} className="block">
          <div
            className={`font-display text-ink hover:text-primary tracking-tight uppercase transition-colors ${featured ? 'text-xl' : 'text-base'}`}
          >
            {artwork.title}
          </div>
          {showPrice && !buyAction && (
            <div className="text-muted mt-1 text-sm font-semibold tracking-wide">{formatPrice(artwork.price)}</div>
          )}
        </Link>
        {buyAction && <div className="mt-3">{buyAction}</div>}
      </div>
    </div>
  );
}
