import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryTag } from './CategoryTag';

describe('CategoryTag', () => {
  it('renders the category prefixed with a hashtag', () => {
    render(<CategoryTag category="Хаос" />);
    expect(screen.getByText('#Хаос')).toBeInTheDocument();
  });

  it('centers its content on a flex axis instead of relying on the font line-height alone', () => {
    render(<CategoryTag category="Хаос" />);
    expect(screen.getByText('#Хаос')).toHaveClass('inline-flex', 'items-center', 'leading-none');
  });

  it('accepts extra classes for per-caller positioning (e.g. absolute placement over an image)', () => {
    render(<CategoryTag category="Хаос" className="absolute top-3 left-3" />);
    expect(screen.getByText('#Хаос')).toHaveClass('absolute', 'top-3', 'left-3');
  });
});
