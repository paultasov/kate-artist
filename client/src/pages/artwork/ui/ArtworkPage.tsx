import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { placeholderGradientFor, formatPrice, CategoryTag, getArtworks } from '@/entities/artwork';
import { InquiryModal, type ArtworkInquiryType } from '@/features/send-inquiry';
import { FavoriteButton } from '@/features/toggle-favorite';
import { CommentsSection } from '@/widgets/comments';
import { RelatedWorks } from '@/widgets/related-works';
import { Lightbox } from '@/shared/ui/Lightbox';
import { Button } from '@/shared/ui/Button';
import { Reveal } from '@/shared/ui/Reveal';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-ink-foreground/15 flex justify-between gap-6 border-b pb-2">
      <dt className="text-ink-foreground/50">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

export default function ArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const artworks = getArtworks();
  const artwork = artworks.find((item) => item.id === id);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<ArtworkInquiryType | null>(null);

  if (!artwork) {
    return (
      <div className="px-5 pt-40 pb-24 text-center md:px-16">
        <h1 className="text-3xl uppercase">Работа не найдена</h1>
        <Link to="/" className="border-ink mt-6 inline-block border-b-2 pb-1 text-sm font-semibold">
          К списку работ →
        </Link>
      </div>
    );
  }

  const placeholder = placeholderGradientFor(artwork.id);
  const year = new Date(artwork.createdAt).getFullYear();

  return (
    <>
      <section className="section-ink grain px-5 pt-32 pb-16 md:px-16 md:pt-40">
        <Link
          to="/works"
          className="text-ink-foreground/60 hover:text-acid text-xs tracking-[0.3em] uppercase transition-colors"
        >
          ← Все работы
        </Link>

        <div className="mx-auto mt-8 flex max-w-[1200px] flex-col gap-12 lg:flex-row">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-sm lg:max-w-[560px]"
            aria-label="Смотреть в увеличенном масштабе"
          >
            {artwork.imageUrl ? (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            ) : (
              <div
                role="img"
                aria-label={artwork.title}
                className="h-full w-full"
                style={{ background: placeholder }}
              />
            )}
          </button>

          <div className="flex-1">
            <CategoryTag category={artwork.category} />
            <h1 className="font-display mt-5 text-4xl uppercase">{artwork.title}</h1>
            <div className="text-gold mt-4 text-2xl font-semibold">{formatPrice(artwork.price)}</div>
            <p className="text-ink-foreground/70 mt-6 max-w-md text-base leading-relaxed">{artwork.description}</p>

            <dl className="mt-8 max-w-sm space-y-3 text-sm">
              <Row label="Категория" value={artwork.category} />
              <Row label="Год" value={String(year)} />
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="button" variant="gold" onClick={() => setInquiryType('purchase')}>
                Купить
              </Button>
              <Button type="button" variant="inverted" onClick={() => setInquiryType('question')}>
                Задать вопрос
              </Button>
              <FavoriteButton artworkId={artwork.id} surface="ink" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-16">
        <Reveal>
          <CommentsSection artworkId={artwork.id} />
        </Reveal>
      </div>

      <RelatedWorks current={artwork} allArtworks={artworks} />

      {lightboxOpen && (
        <Lightbox
          imageUrl={artwork.imageUrl}
          placeholderGradient={placeholder}
          alt={artwork.title}
          onClose={() => setLightboxOpen(false)}
          buyAction={
            <Button
              type="button"
              variant="gold"
              onClick={() => {
                setLightboxOpen(false);
                setInquiryType('purchase');
              }}
            >
              Купить · {formatPrice(artwork.price)}
            </Button>
          }
        />
      )}

      {inquiryType && <InquiryModal artwork={artwork} type={inquiryType} onClose={() => setInquiryType(null)} />}
    </>
  );
}
