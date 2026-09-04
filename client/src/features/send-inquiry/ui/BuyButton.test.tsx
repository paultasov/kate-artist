import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuyButton } from './BuyButton';
import type { Artwork } from '@/entities/artwork';

const artwork: Artwork = {
  id: 'artwork-1',
  title: 'Без масок',
  description: '',
  price: 21000,
  category: 'Хаос',
  imageUrl: '',
  featured: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('BuyButton', () => {
  it('shows the title and price, and opens the purchase inquiry modal on click', async () => {
    const user = userEvent.setup();
    render(<BuyButton artwork={artwork} />);

    const button = screen.getByRole('button', { name: /Купить/ });
    expect(button).toHaveTextContent('21 000 ₽');
    await user.click(button);
    expect(screen.getByRole('heading', { name: 'Купить работу' })).toBeInTheDocument();
  });

  it('is outlined (not filled) at rest, with the fill reserved for hover', () => {
    render(<BuyButton artwork={artwork} />);
    const button = screen.getByRole('button', { name: /Купить/ });
    expect(button).toHaveClass('hover:bg-gold', 'hover:text-gold-foreground');
    expect(button.className).not.toMatch(/(?<!hover:)bg-gold\b/);
  });

  it('uses the deep gold shade at rest on its default (light) surface — plain gold measures under 2.2:1 as bare text on the canvas background', () => {
    render(<BuyButton artwork={artwork} />);
    const classes = screen.getByRole('button', { name: /Купить/ }).className.split(' ');
    expect(classes).toEqual(expect.arrayContaining(['border-gold-deep', 'text-gold-deep']));
    expect(classes).not.toContain('border-gold');
    expect(classes).not.toContain('text-gold');
  });

  it('is filled at rest on a "dark" surface (the Lightbox) instead of outlined — it floats over the real photo, which can be light in exactly the spot behind it', () => {
    render(<BuyButton artwork={artwork} surface="dark" />);
    const classes = screen.getByRole('button', { name: /Купить/ }).className.split(' ');
    expect(classes).toEqual(expect.arrayContaining(['bg-gold', 'text-gold-foreground', 'border-gold']));
    expect(classes).not.toContain('border-gold-deep');
    expect(classes).not.toContain('text-gold-deep');
  });

  it('uses gold, the buy-specific accent, not primary/acid/love (all three are already spoken for elsewhere)', () => {
    render(<BuyButton artwork={artwork} />);
    const button = screen.getByRole('button', { name: /Купить/ });
    expect(button.className).not.toMatch(/-primary\b|-acid\b|-love\b/);
  });
});
