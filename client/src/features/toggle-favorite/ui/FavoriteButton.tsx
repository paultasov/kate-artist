import type { MouseEvent } from 'react';
import { HeartIcon } from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useFavorites } from '@/entities/favorite';
import { useAuthGate } from '@/features/auth';

interface FavoriteButtonProps {
  artworkId: string;
  surface?: 'image' | 'page' | 'ink';
}

export function FavoriteButton({ artworkId, surface = 'page' }: FavoriteButtonProps) {
  const { currentUser } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { openAuthModal, authModalNode } = useAuthGate();

  const isFavorited = favoriteIds.has(artworkId);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      openAuthModal();
      return;
    }

    toggleFavorite(artworkId);
  }

  const surfaceClasses =
    surface === 'image'
      ? 'bg-ink/60 text-ink-foreground shadow-[0_2px_10px_rgba(32,28,23,0.25)] backdrop-blur-sm'
      : surface === 'ink'
        ? 'border-ink-foreground/20 text-ink-foreground hover:border-love hover:bg-love hover:text-love-foreground border'
        : 'bg-ink/[0.05] text-ink hover:bg-ink/10';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isFavorited}
        aria-label={isFavorited ? 'Убрать из избранного' : 'Добавить в избранное'}
        className={`group flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${surfaceClasses}`}
      >
        <HeartIcon
          size={18}
          weight={isFavorited ? 'fill' : 'regular'}
          className={
            isFavorited ? `text-love ${surface === 'ink' ? 'group-hover:text-love-foreground' : ''}` : undefined
          }
        />
      </button>
      {authModalNode}
    </>
  );
}
