import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/entities/user';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Favorite } from './types';
import { FavoritesProvider } from './FavoritesContext';
import { useFavorites } from './useFavorites';

const loggedInUser: User = {
  id: 'user-1',
  name: 'Ирина',
  email: 'irina@example.com',
  password: 'secret123',
  isAdmin: false,
};

function Probe({ artworkId, label }: { artworkId: string; label: string }) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  return (
    <div>
      <div data-testid={`count-${label}`}>{favoriteIds.size}</div>
      <div data-testid={`has-${label}`}>{favoriteIds.has(artworkId) ? 'yes' : 'no'}</div>
      <button onClick={() => toggleFavorite(artworkId)}>toggle-{label}</button>
    </div>
  );
}

function renderWithProbes(children: ReactNode) {
  return render(
    <AuthProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AuthProvider>
  );
}

describe('FavoritesContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when logged out, and toggling does nothing without a current user', async () => {
    const user = userEvent.setup();
    renderWithProbes(<Probe artworkId="a1" label="x" />);

    expect(screen.getByTestId('count-x')).toHaveTextContent('0');
    await user.click(screen.getByText('toggle-x'));

    expect(screen.getByTestId('count-x')).toHaveTextContent('0');
    expect(storage.get('favorites')).toBeNull();
  });

  it('restores favorites from storage on mount, scoped to the current user only', () => {
    storage.set('currentUser', loggedInUser);
    storage.set('favorites', [
      { userId: 'user-1', artworkId: 'a1' },
      { userId: 'someone-else', artworkId: 'a2' },
    ] satisfies Favorite[]);

    renderWithProbes(<Probe artworkId="a1" label="x" />);

    expect(screen.getByTestId('count-x')).toHaveTextContent('1');
    expect(screen.getByTestId('has-x')).toHaveTextContent('yes');
  });

  it('keeps every consumer in sync the instant one of them toggles a favorite — the whole point of a shared store instead of each component reading storage on its own', async () => {
    storage.set('currentUser', loggedInUser);
    const user = userEvent.setup();

    renderWithProbes(
      <>
        <Probe artworkId="a1" label="left" />
        <Probe artworkId="a1" label="right" />
      </>
    );

    expect(screen.getByTestId('has-left')).toHaveTextContent('no');
    expect(screen.getByTestId('has-right')).toHaveTextContent('no');

    await user.click(screen.getByText('toggle-left'));

    expect(screen.getByTestId('has-left')).toHaveTextContent('yes');
    expect(screen.getByTestId('has-right')).toHaveTextContent('yes');
    expect(screen.getByTestId('count-right')).toHaveTextContent('1');
    expect(storage.get<Favorite[]>('favorites')).toEqual([{ userId: 'user-1', artworkId: 'a1' }]);
  });

  it('removes a favorite on a second toggle', async () => {
    storage.set('currentUser', loggedInUser);
    storage.set('favorites', [{ userId: 'user-1', artworkId: 'a1' }] satisfies Favorite[]);
    const user = userEvent.setup();

    renderWithProbes(<Probe artworkId="a1" label="x" />);
    expect(screen.getByTestId('has-x')).toHaveTextContent('yes');

    await user.click(screen.getByText('toggle-x'));

    expect(screen.getByTestId('has-x')).toHaveTextContent('no');
    expect(storage.get<Favorite[]>('favorites')).toEqual([]);
  });

  it('throws a clear error when used outside a FavoritesProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <AuthProvider>
          <Probe artworkId="a1" label="x" />
        </AuthProvider>
      )
    ).toThrow('useFavorites must be used within a FavoritesProvider');
    consoleError.mockRestore();
  });
});
