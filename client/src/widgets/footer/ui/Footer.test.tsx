import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

describe('Footer', () => {
  it('links to the real Instagram profile, opening in a new tab safely', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Instagram' });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/katerinka19911/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('announces the wordmark as one label, not letter-by-letter', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText(`K.A.T.U.S.H.A, ${new Date().getFullYear()}`)).toHaveClass('sr-only');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
