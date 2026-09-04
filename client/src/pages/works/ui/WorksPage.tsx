import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HeartIcon } from '@phosphor-icons/react';
import { ArtworkCard, getArtworks } from '@/entities/artwork';
import { FavoriteButton } from '@/features/toggle-favorite';
import { BuyButton } from '@/features/send-inquiry';
import { Reveal } from '@/shared/ui/Reveal';
import { Magnetic } from '@/shared/ui/Magnetic';
import { useFavorites } from '@/entities/favorite';

const ALL = 'все';

export function WorksPage() {
  const artworks = getArtworks();
  const { favoriteIds } = useFavorites();
  const [params, setParams] = useSearchParams();
  const [tag, setTag] = useState<string>(ALL);
  const reducedMotion = useReducedMotion();

  const favOnly = params.get('fav') === 'true';
  const categories = [ALL, ...new Set(artworks.map((artwork) => artwork.category))];

  let list = tag === ALL ? artworks : artworks.filter((artwork) => artwork.category === tag);
  if (favOnly) list = list.filter((artwork) => favoriteIds.has(artwork.id));

  return (
    <>
      <div className="grain px-5 pt-32 pb-24 md:px-16 md:pt-40">
        <Reveal>
          <p className="text-muted text-xs font-semibold tracking-[0.3em] uppercase">
            {artworks.length} работ в наличии
          </p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] uppercase">
            Все <span className="text-primary">работы</span>
          </h1>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setTag(category)}
              className={`rounded-full border px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                tag === category ? 'bg-ink text-canvas border-transparent' : 'border-hairline text-muted hover:text-ink'
              }`}
            >
              {category}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setParams(favOnly ? {} : { fav: 'true' })}
            className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
              favOnly ? 'bg-acid text-acid-foreground border-transparent' : 'border-hairline text-muted hover:text-ink'
            }`}
          >
            <HeartIcon size={13} weight={favOnly ? 'fill' : 'regular'} />
            Избранное ({favoriteIds.size})
          </button>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                layout={!reducedMotion}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
              >
                <ArtworkCard
                  artwork={artwork}
                  aspectClassName="aspect-[4/5]"
                  actions={<FavoriteButton artworkId={artwork.id} surface="image" />}
                  buyAction={<BuyButton artwork={artwork} />}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {list.length === 0 &&
          (favOnly ? (
            <div className="mt-16 flex flex-col items-center py-8 text-center">
              <div className="bg-acid/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
                <HeartIcon size={40} weight="duotone" className="text-acid" />
              </div>
              <p className="text-muted max-w-xs text-base">
                Пока пусто. Нажмите сердечко на понравившейся работе — она появится здесь.
              </p>
            </div>
          ) : (
            <p className="text-muted mt-16">Работ в этой категории пока нет.</p>
          ))}
      </div>

      <section className="section-ink grain flex flex-col items-start gap-8 px-5 py-24 md:flex-row md:items-center md:justify-between md:px-16">
        <Reveal>
          <h2 className="max-w-xl text-[clamp(2rem,5vw,3.5rem)] uppercase">
            Не нашли <span className="text-acid">то, что искали?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Magnetic>
            <Link
              to="/contact"
              className="bg-primary text-primary-foreground font-display inline-flex shrink-0 items-center rounded-full px-8 py-4 text-sm leading-[1.15] uppercase transition-transform duration-200 active:scale-95"
            >
              Заказать картину
            </Link>
          </Magnetic>
        </Reveal>
      </section>
    </>
  );
}
