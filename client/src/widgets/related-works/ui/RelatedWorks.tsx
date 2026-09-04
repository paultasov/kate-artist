import { ArtworkCard, type Artwork } from '@/entities/artwork';
import { FavoriteButton } from '@/features/toggle-favorite';
import { BuyButton } from '@/features/send-inquiry';
import { Reveal } from '@/shared/ui/Reveal';
import { relatedArtworksFor } from '../lib/relatedArtworksFor';

interface RelatedWorksProps {
  current: Artwork;
  allArtworks: Artwork[];
}

export function RelatedWorks({ current, allArtworks }: RelatedWorksProps) {
  const related = relatedArtworksFor(current, allArtworks);
  if (related.length === 0) return null;

  return (
    <section className="border-hairline border-t px-5 py-16 md:px-16">
      <Reveal>
        <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] uppercase">Из той же палитры</h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        {related.map((artwork, index) => (
          <Reveal key={artwork.id} delay={index * 0.08}>
            <ArtworkCard
              artwork={artwork}
              aspectClassName="aspect-[4/5]"
              actions={<FavoriteButton artworkId={artwork.id} surface="image" />}
              buyAction={<BuyButton artwork={artwork} />}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
