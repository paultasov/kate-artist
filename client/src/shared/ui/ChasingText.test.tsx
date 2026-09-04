import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChasingText } from './ChasingText';

describe('ChasingText', () => {
  it('carries the real text in a single sr-only span for assistive tech', () => {
    render(<ChasingText text="Работы" />);
    const srOnly = screen.getByText('Работы');
    expect(srOnly).toHaveClass('sr-only');
  });

  it('renders one decorative, aria-hidden span per letter with an increasing delay', () => {
    const { container } = render(<ChasingText text="Кате" />);
    const hiddenWrapper = container.querySelector('[aria-hidden="true"]');
    expect(hiddenWrapper).not.toBeNull();

    const letters = hiddenWrapper!.querySelectorAll(':scope > span');
    expect(letters).toHaveLength(4);
    expect(letters[0]).toHaveTextContent('К');
    expect(letters[0]).toHaveStyle({ transitionDelay: '0ms' });
    expect(letters[3]).toHaveStyle({ transitionDelay: '90ms' });
  });

  it('honors a custom stepMs', () => {
    const { container } = render(<ChasingText text="AB" stepMs={100} />);
    const letters = container.querySelectorAll('[aria-hidden="true"] > span');
    expect(letters[1]).toHaveStyle({ transitionDelay: '100ms' });
  });
});
