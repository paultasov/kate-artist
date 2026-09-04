import { beforeEach, describe, expect, it } from 'vitest';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Artwork } from '@/entities/artwork';
import { seedIfEmpty } from './seed';

describe('seedIfEmpty', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('populates users and artworks on first run', () => {
    seedIfEmpty();
    expect(storage.get<User[]>('users')).not.toBeNull();
    expect(storage.get<Artwork[]>('artworks')?.length).toBeGreaterThan(0);
  });

  it('does not overwrite existing data on subsequent runs', () => {
    const existingArtworks: Artwork[] = [
      {
        id: 'custom-1',
        title: 'My own work',
        description: '',
        price: 1,
        category: 'x',
        imageUrl: '',
        featured: false,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    storage.set('artworks', existingArtworks);

    seedIfEmpty();

    expect(storage.get<Artwork[]>('artworks')).toEqual(existingArtworks);
  });
});
