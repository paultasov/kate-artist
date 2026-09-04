import type { Artwork } from '@/entities/artwork';

export function relatedArtworksFor(current: Artwork, all: Artwork[], limit = 3): Artwork[] {
  const others = all.filter((artwork) => artwork.id !== current.id);
  const sameCategory = others.filter((artwork) => artwork.category === current.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const rest = others.filter((artwork) => artwork.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
