import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Artwork } from '@/entities/artwork';
import type { Favorite } from '@/entities/favorite';

const loggedInUser: User = {
  id: 'user-1',
  name: 'Ирина',
  email: 'irina@example.com',
  password: 'secret123',
  isAdmin: false,
};

function makeArtwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 'artwork-1',
    title: 'Work',
    description: '',
    price: 1000,
    category: 'x',
    imageUrl: '',
    featured: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderProfile() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>
          <ProfilePage />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('asks a guest to log in', () => {
    renderProfile();
    expect(screen.getByText('Войдите, чтобы увидеть сохранённые работы.')).toBeInTheDocument();
  });

  it('shows an empty state for a logged-in user with no favorites', () => {
    storage.set('currentUser', loggedInUser);
    renderProfile();
    expect(
      screen.getByText('Пока ничего не добавлено. Нажмите на сердечко у понравившейся работы.')
    ).toBeInTheDocument();
  });

  it("renders only the current user's favorited artworks", () => {
    storage.set('currentUser', loggedInUser);
    storage.set('artworks', [
      makeArtwork({ id: 'a1', title: 'Любимая работа' }),
      makeArtwork({ id: 'a2', title: 'Не в избранном' }),
    ]);
    const favorites: Favorite[] = [
      { userId: 'user-1', artworkId: 'a1' },
      { userId: 'someone-else', artworkId: 'a2' },
    ];
    storage.set('favorites', favorites);

    renderProfile();

    expect(screen.getByText('Любимая работа')).toBeInTheDocument();
    expect(screen.queryByText('Не в избранном')).not.toBeInTheDocument();
  });

  it('gives every card the same aspect ratio regardless of orientation, so the grid stays aligned as more favorites are added', () => {
    storage.set('currentUser', loggedInUser);
    storage.set('artworks', [
      makeArtwork({ id: 'a1', title: 'Портрет', orientation: 'vertical' }),
      makeArtwork({ id: 'a2', title: 'Пейзаж', orientation: 'horizontal' }),
      makeArtwork({ id: 'a3', title: 'Квадрат', orientation: 'square' }),
    ]);
    storage.set('favorites', [
      { userId: 'user-1', artworkId: 'a1' },
      { userId: 'user-1', artworkId: 'a2' },
      { userId: 'user-1', artworkId: 'a3' },
    ] satisfies Favorite[]);

    renderProfile();

    for (const title of ['Портрет', 'Пейзаж', 'Квадрат']) {
      const frame = screen.getByRole('img', { name: title }).closest('a');
      expect(frame).toHaveClass('aspect-[4/5]');
    }
  });
});
