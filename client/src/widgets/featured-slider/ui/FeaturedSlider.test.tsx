import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { FeaturedSlider } from './FeaturedSlider';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import type { Artwork } from '@/entities/artwork';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: vi.fn() };
});

import { useReducedMotion } from 'framer-motion';

function makeArtwork(overrides: Partial<Artwork>): Artwork {
  return {
    id: 'artwork-1',
    title: 'Без масок',
    description: 'Описание',
    price: 21000,
    category: 'Хаос',
    imageUrl: '',
    featured: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderSlider(artworks: Artwork[]) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <FavoritesProvider>
          <FeaturedSlider artworks={artworks} />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('FeaturedSlider', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it('shows an empty state with no artworks', () => {
    renderSlider([]);
    expect(screen.getByText('Пока нет работ.')).toBeInTheDocument();
  });

  it('shows the first artwork and a link straight to its detail page', () => {
    const artworks = [makeArtwork({ id: 'a1', title: 'Без масок' }), makeArtwork({ id: 'a2', title: 'Дикий контур' })];
    renderSlider(artworks);
    expect(screen.getByText('Без масок')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Смотреть работу/ })).toHaveAttribute('href', '/artwork/a1');
  });

  it('offers a Buy button right alongside the price, not only on the detail page', () => {
    renderSlider([makeArtwork({ id: 'a1', price: 21000 })]);
    expect(screen.getByRole('button', { name: /Купить/ })).toBeInTheDocument();
  });

  it('fills its portrait-leaning frame via object-cover (the full, uncropped image lives one tap away in the Lightbox)', () => {
    const artworks = [makeArtwork({ id: 'a1', title: 'Без масок', imageUrl: '/artworks/a1.png' })];
    renderSlider(artworks);
    const image = screen.getByRole('img', { name: 'Без масок' });
    expect(image).toHaveClass('object-cover');
  });

  it("swaps to the new artwork's own image on navigation, not just the info panel text", async () => {
    const user = userEvent.setup();
    const artworks = [
      makeArtwork({ id: 'a1', title: 'Без масок', imageUrl: '/a1.png' }),
      makeArtwork({ id: 'a2', title: 'Дикий контур', imageUrl: '/a2.png' }),
    ];
    renderSlider(artworks);

    expect(screen.getByRole('img', { name: 'Без масок' })).toHaveAttribute('src', '/a1.png');
    await user.click(screen.getByRole('button', { name: 'Следующая работа' }));
    expect(await screen.findByRole('img', { name: 'Дикий контур' })).toHaveAttribute('src', '/a2.png');
  });

  it('opens the lightbox wired with prev/next and a Buy action when there is more than one artwork', async () => {
    const user = userEvent.setup();
    const artworks = [
      makeArtwork({ id: 'a1', title: 'Без масок', price: 21000 }),
      makeArtwork({ id: 'a2', title: 'Дикий контур' }),
    ];
    renderSlider(artworks);

    await user.click(screen.getByRole('button', { name: 'Смотреть в увеличенном масштабе' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Следующая работа' }).length).toBeGreaterThan(1);
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: /Купить/ })).toBeInTheDocument();
  });

  it('hides prev/next controls and dots when there is only one artwork', () => {
    renderSlider([makeArtwork({ id: 'a1' })]);
    expect(screen.queryByRole('button', { name: 'Следующая работа' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Предыдущая работа' })).not.toBeInTheDocument();
  });

  it('advances to the next artwork on next-arrow click, wrapping past the end', async () => {
    const user = userEvent.setup();
    const artworks = [makeArtwork({ id: 'a1', title: 'Без масок' }), makeArtwork({ id: 'a2', title: 'Дикий контур' })];
    renderSlider(artworks);

    await user.click(screen.getByRole('button', { name: 'Следующая работа' }));
    expect(await screen.findByText('Дикий контур')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Следующая работа' }));
    expect(await screen.findByText('Без масок')).toBeInTheDocument();
  });

  it('goes to the previous artwork on prev-arrow click, wrapping before the start', async () => {
    const user = userEvent.setup();
    const artworks = [makeArtwork({ id: 'a1', title: 'Без масок' }), makeArtwork({ id: 'a2', title: 'Дикий контур' })];
    renderSlider(artworks);

    await user.click(screen.getByRole('button', { name: 'Предыдущая работа' }));
    expect(await screen.findByText('Дикий контур')).toBeInTheDocument();
  });

  it('jumps directly to an artwork via its dot', async () => {
    const user = userEvent.setup();
    const artworks = [
      makeArtwork({ id: 'a1', title: 'Без масок' }),
      makeArtwork({ id: 'a2', title: 'Дикий контур' }),
      makeArtwork({ id: 'a3', title: 'Громкий цвет' }),
    ];
    renderSlider(artworks);

    await user.click(screen.getByRole('button', { name: 'Работа 3' }));
    expect(await screen.findByText('Громкий цвет')).toBeInTheDocument();
  });

  it('opens the lightbox when the zoom button is clicked', async () => {
    const user = userEvent.setup();
    renderSlider([makeArtwork({ id: 'a1', title: 'Без масок' })]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Смотреть в увеличенном масштабе' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('uses the shared floating-control chip styling on its own zoom button, matching the Lightbox', () => {
    renderSlider([makeArtwork({ id: 'a1' })]);
    const zoomButton = screen.getByRole('button', { name: 'Смотреть в увеличенном масштабе' });
    expect(zoomButton).toHaveClass('bg-ink/70', 'ring-1', 'rounded-full');
  });

  it('keeps the favorite button actually clickable (no pointer-events-none ancestor)', () => {
    renderSlider([makeArtwork({ id: 'a1' })]);
    const favoriteButton = screen.getByRole('button', { name: 'Добавить в избранное' });
    expect(favoriteButton.closest('.pointer-events-none')).toBeNull();
  });

  it('covers the image with a 6x6 tile-reveal mask', () => {
    const { container } = renderSlider([makeArtwork({ id: 'a1', imageUrl: '/a1.png' })]);
    const mask = container.querySelector('.grid-cols-6');
    expect(mask).toBeInTheDocument();
    expect(mask?.children).toHaveLength(36);
  });

  it('is pointer-events-none, so it never blocks the zoom-in click on the real image underneath', () => {
    const { container } = renderSlider([makeArtwork({ id: 'a1', imageUrl: '/a1.png' })]);
    expect(container.querySelector('.grid-cols-6')).toHaveClass('pointer-events-none');
  });

  it('skips the tile mask entirely under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = renderSlider([makeArtwork({ id: 'a1', imageUrl: '/a1.png' })]);
    expect(container.querySelector('.grid-cols-6')).not.toBeInTheDocument();
  });
});
