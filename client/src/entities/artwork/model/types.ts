export type ArtworkOrientation = 'vertical' | 'horizontal' | 'square';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  orientation?: ArtworkOrientation;
}
