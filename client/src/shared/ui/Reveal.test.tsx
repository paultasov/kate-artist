import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: vi.fn() };
});

import { useReducedMotion } from 'framer-motion';

describe('Reveal', () => {
  it('renders its children and forwards the className', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(
      <Reveal className="custom">
        <p>Content</p>
      </Reveal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom');
  });

  it('still renders its children (as a plain, un-animated wrapper) under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(
      <Reveal className="custom">
        <p>Content</p>
      </Reveal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom');
  });
});
