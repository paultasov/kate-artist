import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { WorksPage } from './WorksPage';
import { storage } from '@/shared/api/storage';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import type { Artwork } from '@/entities/artwork';

function makeArtwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 'artwork-1',
    title: 'Без масок',
    description: '',
    price: 21000,
    category: 'Хаос',
    imageUrl: '',
    featured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderWorksPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>
          <WorksPage />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('WorksPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders every artwork by default', () => {
    storage.set('artworks', [
      makeArtwork({ id: 'a1', title: 'Без масок', category: 'Хаос' }),
      makeArtwork({ id: 'a2', title: 'Дикий контур', category: 'Цвет' }),
    ]);
    renderWorksPage();
    expect(screen.getByText('Без масок')).toBeInTheDocument();
    expect(screen.getByText('Дикий контур')).toBeInTheDocument();
  });

  it('filters by category when a filter pill is clicked', async () => {
    const user = userEvent.setup();
    storage.set('artworks', [
      makeArtwork({ id: 'a1', title: 'Без масок', category: 'Хаос' }),
      makeArtwork({ id: 'a2', title: 'Дикий контур', category: 'Цвет' }),
    ]);
    renderWorksPage();

    await user.click(screen.getByRole('button', { name: 'Цвет' }));
    expect(screen.getByText('Дикий контур')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Без масок')).not.toBeInTheDocument());
  });

  it('shows an empty-state message when a category has no work', () => {
    storage.set('artworks', []);
    renderWorksPage();
    expect(screen.getByText('Работ в этой категории пока нет.')).toBeInTheDocument();
  });

  it('shows an illustrated placeholder, not just text, when the favorites filter is empty', async () => {
    const user = userEvent.setup();
    storage.set('artworks', [makeArtwork({})]);
    renderWorksPage();

    await user.click(screen.getByRole('button', { name: /Избранное/ }));
    const message = screen.getByText(/Пока пусто/);
    expect(message.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('ends with a closing CTA to /contact, not a dead stop after the grid', () => {
    storage.set('artworks', [makeArtwork({})]);
    renderWorksPage();
    expect(screen.getByRole('link', { name: 'Заказать картину' })).toHaveAttribute('href', '/contact');
  });
});
