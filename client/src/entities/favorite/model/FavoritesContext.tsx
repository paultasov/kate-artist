import { useMemo, useState, type ReactNode } from 'react';
import { storage } from '@/shared/api/storage';
import { useAuth } from '@/entities/user';
import type { Favorite } from './types';
import { FavoritesContext } from './favoritesContext';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>(() => storage.get<Favorite[]>('favorites') ?? []);

  const favoriteIds = useMemo(() => {
    if (!currentUser) return new Set<string>();
    return new Set(
      favorites.filter((favorite) => favorite.userId === currentUser.id).map((favorite) => favorite.artworkId)
    );
  }, [favorites, currentUser]);

  function toggleFavorite(artworkId: string) {
    if (!currentUser) return;
    const isFavorited = favorites.some(
      (favorite) => favorite.userId === currentUser.id && favorite.artworkId === artworkId
    );
    const next = isFavorited
      ? favorites.filter((favorite) => !(favorite.userId === currentUser.id && favorite.artworkId === artworkId))
      : [...favorites, { userId: currentUser.id, artworkId }];

    storage.set('favorites', next);
    setFavorites(next);
  }

  return <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>{children}</FavoritesContext.Provider>;
}
