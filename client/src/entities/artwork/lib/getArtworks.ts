import { storage } from '@/shared/api/storage';
import type { Artwork } from '../model/types';

export function getArtworks(): Artwork[] {
  return storage.get<Artwork[]>('artworks') ?? [];
}
