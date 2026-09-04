import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArtworkCard } from './ArtworkCard';
import type { Artwork } from '../model/types';

const baseArtwork: Artwork = {
  id: 'artwork-1',
  title: 'Без масок',
  description: '',
  price: 21000,
  category: 'Акрил',
  imageUrl: '',
  featured: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function renderCard(artwork: Artwork = baseArtwork, featured?: boolean) {
  return render(
    <MemoryRouter>
      <ArtworkCard artwork={artwork} featured={featured} />
    </MemoryRouter>
  );
}

function renderCardWithProps(props: Partial<ComponentProps<typeof ArtworkCard>> = {}) {
  return render(
    <MemoryRouter>
      <ArtworkCard artwork={baseArtwork} {...props} />
    </MemoryRouter>
  );
}

describe('ArtworkCard', () => {
  it('renders the title and formatted price', () => {
    renderCard();
    expect(screen.getByText('Без масок')).toBeInTheDocument();
    expect(screen.getByText('21 000 ₽')).toBeInTheDocument();
  });

  it('links both the image and the title to the artwork detail page', () => {
    renderCard();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/artwork/artwork-1');
    }
  });

  it('keeps buyAction outside any <a>, not nested inside the card link', () => {
    const { container } = renderCardWithProps({ buyAction: <button type="button">Купить</button> });
    const buyButton = screen.getByText('Купить');
    expect(buyButton.closest('a')).toBeNull();
    expect(container.querySelectorAll('a')).toHaveLength(2);
  });

  it("keeps buyAction outside the image's hover .group, so hovering it can't trigger the image zoom", () => {
    renderCardWithProps({ buyAction: <button type="button">Купить</button> });
    const buyButton = screen.getByText('Купить');
    expect(buyButton.closest('.group')).toBeNull();
  });

  it('renders a placeholder block when there is no image yet', () => {
    renderCard();
    expect(screen.queryByRole('img', { name: 'Без масок' })).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('renders a real image when imageUrl is set', () => {
    renderCard({ ...baseArtwork, imageUrl: '/artworks/without-masks.jpg' });
    const img = screen.getByRole('img', { name: 'Без масок' }) as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.src).toContain('/artworks/without-masks.jpg');
  });

  it('picks the same placeholder color deterministically for the same id', () => {
    const { container: a } = renderCard();
    const { container: b } = renderCard();
    const styleA = a.querySelector('[aria-label="Без масок"]')?.getAttribute('style');
    const styleB = b.querySelector('[aria-label="Без масок"]')?.getAttribute('style');
    expect(styleA).toBe(styleB);
  });

  it('shows the price by default', () => {
    renderCardWithProps();
    expect(screen.getByText('21 000 ₽')).toBeInTheDocument();
  });

  it('hides the price when showPrice is false', () => {
    renderCardWithProps({ showPrice: false });
    expect(screen.queryByText('21 000 ₽')).not.toBeInTheDocument();
  });

  it('uses the orientation-based aspect ratio by default, an override when given one', () => {
    const { container: byOrientation } = renderCard({ ...baseArtwork, orientation: 'horizontal' });
    expect(byOrientation.querySelector('a')).toHaveClass('aspect-[4/3]');

    const { container: overridden } = renderCardWithProps({ aspectClassName: 'aspect-[4/5]' });
    expect(overridden.querySelector('a')).toHaveClass('aspect-[4/5]');
    expect(overridden.querySelector('a')).not.toHaveClass('aspect-[3/4]');
  });

  it('hides the price when a buyAction is supplied, regardless of showPrice', () => {
    renderCardWithProps({ buyAction: <button type="button">Купить</button> });
    expect(screen.queryByText('21 000 ₽')).not.toBeInTheDocument();
    expect(screen.getByText('Купить')).toBeInTheDocument();
  });

  it('stacks the buy button below the title the same way regardless of title length', () => {
    for (const title of ['AB', 'Очень длинное название этой работы художника']) {
      const { getByText, unmount } = renderCardWithProps({
        artwork: { ...baseArtwork, title },
        buyAction: <button type="button">Купить</button>,
      });
      const titleLink = getByText(title).closest('a');
      const buyWrapper = getByText('Купить').parentElement;
      expect(buyWrapper).toHaveClass('mt-3');
      expect(titleLink?.nextElementSibling).toBe(buyWrapper);
      unmount();
    }
  });
});
