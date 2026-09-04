import { describe, expect, it } from 'vitest';
import { relatedArtworksFor } from './relatedArtworksFor';
import type { Artwork } from '@/entities/artwork';

function makeArtwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 'x',
    title: 'x',
    description: '',
    price: 1000,
    category: 'Хаос',
    imageUrl: '',
    featured: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('relatedArtworksFor', () => {
  it('never includes the current artwork itself', () => {
    const current = makeArtwork({ id: 'a1', category: 'Хаос' });
    const all = [current, makeArtwork({ id: 'a2', category: 'Хаос' })];
    const related = relatedArtworksFor(current, all);
    expect(related.some((artwork) => artwork.id === 'a1')).toBe(false);
  });

  it('prefers same-category pieces first', () => {
    const current = makeArtwork({ id: 'a1', category: 'Хаос' });
    const all = [
      current,
      makeArtwork({ id: 'a2', category: 'Цвет' }),
      makeArtwork({ id: 'a3', category: 'Хаос' }),
      makeArtwork({ id: 'a4', category: 'Хаос' }),
    ];
    const related = relatedArtworksFor(current, all, 2);
    expect(related.map((artwork) => artwork.id).sort()).toEqual(['a3', 'a4']);
  });

  it('tops up with other categories when the same category runs out', () => {
    const current = makeArtwork({ id: 'a1', category: 'Хаос' });
    const all = [current, makeArtwork({ id: 'a2', category: 'Цвет' }), makeArtwork({ id: 'a3', category: 'Пейзаж' })];
    const related = relatedArtworksFor(current, all, 3);
    expect(related).toHaveLength(2);
    expect(related.map((artwork) => artwork.id).sort()).toEqual(['a2', 'a3']);
  });

  it('returns an empty list when there is nothing else to suggest', () => {
    const current = makeArtwork({ id: 'a1', category: 'Хаос' });
    expect(relatedArtworksFor(current, [current])).toEqual([]);
  });

  it('respects the limit', () => {
    const current = makeArtwork({ id: 'a1', category: 'Хаос' });
    const all = [
      current,
      makeArtwork({ id: 'a2', category: 'Хаос' }),
      makeArtwork({ id: 'a3', category: 'Хаос' }),
      makeArtwork({ id: 'a4', category: 'Хаос' }),
      makeArtwork({ id: 'a5', category: 'Хаос' }),
    ];
    expect(relatedArtworksFor(current, all, 3)).toHaveLength(3);
  });
});
