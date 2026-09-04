import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SmoothScroll } from './SmoothScroll';

vi.mock('lenis/react', () => ({
  ReactLenis: ({ children }: { children: ReactNode }) => <div data-testid="lenis-root">{children}</div>,
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: vi.fn() };
});

import { useReducedMotion } from 'framer-motion';

describe('SmoothScroll', () => {
  it('wraps children in the Lenis root by default', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    render(
      <SmoothScroll>
        <p>Content</p>
      </SmoothScroll>
    );
    expect(screen.getByTestId('lenis-root')).toContainElement(screen.getByText('Content'));
  });

  it('skips the Lenis instance entirely under reduced motion', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(
      <SmoothScroll>
        <p>Content</p>
      </SmoothScroll>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByTestId('lenis-root')).not.toBeInTheDocument();
  });
});
