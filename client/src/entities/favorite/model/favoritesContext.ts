import { createContext } from 'react';

export interface FavoritesContextValue {
  favoriteIds: Set<string>;
  toggleFavorite: (artworkId: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
