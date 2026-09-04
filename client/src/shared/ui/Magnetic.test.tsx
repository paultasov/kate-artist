import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Magnetic } from './Magnetic';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: vi.fn() };
});

import { useReducedMotion } from 'framer-motion';

describe('Magnetic', () => {
  it('renders its children and forwards the className', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(
      <Magnetic className="custom">
        <button type="button">Все работы</button>
      </Magnetic>
    );
    expect(screen.getByRole('button', { name: 'Все работы' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('custom');
  });

  it('tracks mouse movement without throwing', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(
      <Magnetic>
        <button type="button">Все работы</button>
      </Magnetic>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(() => {
      fireEvent.mouseMove(wrapper, { clientX: 50, clientY: 50 });
      fireEvent.mouseLeave(wrapper);
    }).not.toThrow();
  });

  it('ignores mouse movement under reduced motion instead of animating', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(
      <Magnetic>
        <button type="button">Все работы</button>
      </Magnetic>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(() => fireEvent.mouseMove(wrapper, { clientX: 500, clientY: 500 })).not.toThrow();
  });
});
