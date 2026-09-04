import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CloseButton } from './CloseButton';

describe('CloseButton', () => {
  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CloseButton onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('rotates the icon on hover of the button (group-hover wiring)', () => {
    const { container } = render(<CloseButton onClick={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Закрыть' });
    expect(button).toHaveClass('group');
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveClass('group-hover:rotate-90');
    expect(svg?.parentElement).toHaveClass('group-hover:rotate-90');
  });
});
