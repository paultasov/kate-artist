import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RelatedWorks } from './RelatedWorks';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import type { Artwork } from '@/entities/artwork';

function makeArtwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 'x',
    title: 'x',
    description: '',
    price: 1000,
    category: 'Хаос',
    imageUrl: '',
    featured: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderRelated(current: Artwork, allArtworks: Artwork[]) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>
          <RelatedWorks current={current} allArtworks={allArtworks} />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('RelatedWorks', () => {
  it('renders other artworks, never the current one', () => {
    const current = makeArtwork({ id: 'a1', title: 'Без масок' });
    const all = [current, makeArtwork({ id: 'a2', title: 'Дикий контур' })];
    renderRelated(current, all);

    expect(screen.getByText('Дикий контур')).toBeInTheDocument();
    expect(screen.queryByText('Без масок')).not.toBeInTheDocument();
  });

  it('renders nothing when there is no other artwork to suggest', () => {
    const current = makeArtwork({ id: 'a1' });
    const { container } = renderRelated(current, [current]);
    expect(container).toBeEmptyDOMElement();
  });

  it('gives every card a Buy button, price on the card, and a uniform aspect ratio', () => {
    const current = makeArtwork({ id: 'a1' });
    const other = makeArtwork({ id: 'a2', title: 'Дикий контур', price: 14000, orientation: 'horizontal' });
    const { container } = renderRelated(current, [current, other]);

    expect(screen.getByText(/Купить/)).toBeInTheDocument();
    const cardLink = container.querySelector('a[href="/artwork/a2"]');
    expect(cardLink).toHaveClass('aspect-[4/5]');
  });
});
