import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteButton } from './FavoriteButton';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Favorite } from '@/entities/favorite';

function renderButton(artworkId = 'artwork-1', surface?: 'image' | 'page' | 'ink') {
  return render(
    <AuthProvider>
      <FavoritesProvider>
        <FavoriteButton artworkId={artworkId} surface={surface} />
      </FavoritesProvider>
    </AuthProvider>
  );
}

const loggedInUser: User = {
  id: 'user-1',
  name: 'Ирина',
  email: 'irina@example.com',
  password: 'secret123',
  isAdmin: false,
};

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('prompts to log in when a guest clicks it, without saving a favorite', async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }));

    expect(screen.getByRole('heading', { name: 'Войти' })).toBeInTheDocument();
    expect(storage.get('favorites')).toBeNull();
  });

  it('adds a favorite for the logged-in user on click', async () => {
    storage.set('currentUser', loggedInUser);
    const user = userEvent.setup();
    renderButton('artwork-1');

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }));

    expect(storage.get<Favorite[]>('favorites')).toEqual([{ userId: 'user-1', artworkId: 'artwork-1' }]);
    expect(screen.getByRole('button', { name: 'Убрать из избранного' })).toBeInTheDocument();
  });

  it('removes an existing favorite on a second click', async () => {
    storage.set('currentUser', loggedInUser);
    storage.set('favorites', [{ userId: 'user-1', artworkId: 'artwork-1' }]);
    const user = userEvent.setup();
    renderButton('artwork-1');

    await user.click(screen.getByRole('button', { name: 'Убрать из избранного' }));

    expect(storage.get<Favorite[]>('favorites')).toEqual([]);
  });

  it('uses a solid, blurred dark chip on the "image" surface, so it reads over any photo regardless of its own colors', () => {
    renderButton('artwork-1', 'image');
    const button = screen.getByRole('button', { name: 'Добавить в избранное' });
    expect(button).toHaveClass('bg-ink/60', 'backdrop-blur-sm');
  });

  it('borders instead of filling on a dark "ink" surface — the "image" chip would be near-invisible with no photo behind it', () => {
    renderButton('artwork-1', 'ink');
    const button = screen.getByRole('button', { name: 'Добавить в избранное' });
    expect(button).toHaveClass('border', 'border-ink-foreground/20', 'text-ink-foreground');
    expect(button.className).not.toMatch(/\bbg-ink\/60\b/);
  });

  it('swaps the favorited icon to the hover fill color only on "ink", where hovering fills the button that same violet', () => {
    storage.set('currentUser', loggedInUser);
    storage.set('favorites', [{ userId: 'user-1', artworkId: 'artwork-1' }]);

    const { rerender } = render(
      <AuthProvider>
        <FavoritesProvider>
          <FavoriteButton artworkId="artwork-1" surface="ink" />
        </FavoritesProvider>
      </AuthProvider>
    );
    let icon = screen.getByRole('button', { name: 'Убрать из избранного' }).querySelector('svg');
    expect(icon).toHaveClass('text-love', 'group-hover:text-love-foreground');

    rerender(
      <AuthProvider>
        <FavoritesProvider>
          <FavoriteButton artworkId="artwork-1" surface="page" />
        </FavoritesProvider>
      </AuthProvider>
    );
    icon = screen.getByRole('button', { name: 'Убрать из избранного' }).querySelector('svg');
    expect(icon).toHaveClass('text-love');
    expect(icon).not.toHaveClass('group-hover:text-love-foreground');
  });
});
