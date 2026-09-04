import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassPlusIcon } from '@phosphor-icons/react';
import { placeholderGradientFor, formatPrice, CategoryTag, type Artwork } from '@/entities/artwork';
import { FavoriteButton } from '@/features/toggle-favorite';
import { BuyButton } from '@/features/send-inquiry';
import { Lightbox } from '@/shared/ui/Lightbox';
import { FLOATING_CONTROL_BUTTON } from '@/shared/ui/floatingControlButton';

interface FeaturedSliderProps {
  artworks: Artwork[];
}

const EASE = [0.16, 1, 0.3, 1] as const;
const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_THRESHOLD = 80;

const TILE_COLS = 6;
const TILE_ROWS = 6;
const TILE_DURATION = 0.55;
const TILE_STAGGER = 0.035;
const TILES = Array.from({ length: TILE_COLS * TILE_ROWS }, (_, i) => ({
  row: Math.floor(i / TILE_COLS),
  col: i % TILE_COLS,
}));

export function FeaturedSlider({ artworks }: FeaturedSliderProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  if (artworks.length === 0) {
    return <p className="text-muted mt-10">Пока нет работ.</p>;
  }

  const artwork = artworks[index]!;
  const canNavigate = artworks.length > 1;

  function go(delta: number) {
    setIndex((current) => (current + delta + artworks.length) % artworks.length);
  }

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (!canNavigate) return;
    if (info.offset.x < -SWIPE_DISTANCE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      go(1);
    } else if (info.offset.x > SWIPE_DISTANCE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      go(-1);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-8">
      <div className="relative md:col-span-7">
        <div className="bg-ink relative aspect-[3/4] w-full overflow-hidden rounded-sm md:aspect-[4/5]">
          <motion.div
            className="absolute inset-0"
            drag={canNavigate && !reducedMotion ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
          >
            {artwork.imageUrl ? (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                onClick={() => setLightboxOpen(true)}
              />
            ) : (
              <div
                role="img"
                aria-label={artwork.title}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
                style={{ background: placeholderGradientFor(artwork.id) }}
                onClick={() => setLightboxOpen(true)}
              />
            )}

            {!reducedMotion && (
              <div
                key={artwork.id}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-6"
              >
                {TILES.map(({ row, col }) => (
                  <motion.div
                    key={`${row}-${col}`}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.4 }}
                    transition={{ duration: TILE_DURATION, delay: (row + col) * TILE_STAGGER, ease: EASE }}
                    className="bg-ink"
                  />
                ))}
              </div>
            )}
          </motion.div>

          <div className="absolute top-3 left-3">
            <FavoriteButton artworkId={artwork.id} surface="image" />
          </div>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Смотреть в увеличенном масштабе"
            className={`${FLOATING_CONTROL_BUTTON} pointer-events-auto absolute top-3 right-3`}
          >
            <MagnifyingGlassPlusIcon size={18} weight="bold" />
          </button>

          {canNavigate && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Предыдущая работа"
                className={`${FLOATING_CONTROL_BUTTON} pointer-events-auto absolute top-1/2 left-3 -translate-y-1/2`}
              >
                <ArrowLeftIcon size={18} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Следующая работа"
                className={`${FLOATING_CONTROL_BUTTON} pointer-events-auto absolute top-1/2 right-3 -translate-y-1/2`}
              >
                <ArrowRightIcon size={18} weight="bold" />
              </button>
            </>
          )}
        </div>

        {canNavigate && (
          <div className="mt-5 flex items-center gap-2">
            {artworks.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Работа ${i + 1}`}
                aria-current={i === index || undefined}
                className="h-[4px] flex-1"
              >
                <span
                  className={`block h-full rounded-full transition-colors duration-300 ${i === index ? 'bg-ink' : 'bg-ink/15'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={artwork.id}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <CategoryTag category={artwork.category} />
            <h3 className="font-display mt-6 text-5xl uppercase">{artwork.title}</h3>
            <p className="text-muted mt-4 max-w-md text-lg leading-relaxed">{artwork.description}</p>
            <div className="text-gold-deep mt-6 text-2xl font-semibold">{formatPrice(artwork.price)}</div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BuyButton artwork={artwork} />
              <Link
                to={`/artwork/${artwork.id}`}
                className="border-ink/20 text-ink hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] leading-none font-bold tracking-[0.2em] uppercase transition-colors"
              >
                Смотреть работу
                <ArrowRightIcon size={14} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {lightboxOpen && (
        <Lightbox
          imageUrl={artwork.imageUrl}
          placeholderGradient={placeholderGradientFor(artwork.id)}
          alt={artwork.title}
          onClose={() => setLightboxOpen(false)}
          onPrev={canNavigate ? () => go(-1) : undefined}
          onNext={canNavigate ? () => go(1) : undefined}
          buyAction={<BuyButton artwork={artwork} surface="dark" />}
        />
      )}
    </div>
  );
}
