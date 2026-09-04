import { beforeEach, describe, expect, it } from 'vitest';
import { storage } from '@/shared/api/storage';
import { getArtworks } from './getArtworks';
import type { Artwork } from '../model/types';

const artwork: Artwork = {
  id: 'a1',
  title: 'Без масок',
  description: '',
  price: 21000,
  category: 'Хаос',
  imageUrl: '',
  featured: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('getArtworks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when nothing is stored yet', () => {
    expect(getArtworks()).toEqual([]);
  });

  it('returns the stored artworks', () => {
    storage.set('artworks', [artwork]);
    expect(getArtworks()).toEqual([artwork]);
  });
});
