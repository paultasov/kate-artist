import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { storage } from '@/shared/api/storage';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import type { Artwork } from '@/entities/artwork';
import HomePage from './HomePage';

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

function renderHomePage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>
          <HomePage />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('greets the visitor and shows the gallery empty state when there is no data', () => {
    renderHomePage();
    expect(screen.getByRole('heading', { name: 'KATE' })).toBeInTheDocument();
    expect(screen.getByText('Пока нет работ.')).toBeInTheDocument();
  });

  it('renders artworks from storage', () => {
    storage.set('artworks', [makeArtwork({ id: 'a1', title: 'Без масок' })]);
    renderHomePage();
    expect(screen.getByText('Без масок')).toBeInTheDocument();
  });
});
