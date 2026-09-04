import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders its children inside a dialog', () => {
    render(
      <Modal onClose={() => {}}>
        <p>Contents</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toContainElement(screen.getByText('Contents'));
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal onClose={onClose}>
        <p>Contents</p>
      </Modal>
    );
    const backdrop = screen.getByRole('dialog').parentElement as Element;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when the dialog box itself is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal onClose={onClose}>
        <p>Contents</p>
      </Modal>
    );
    await user.click(screen.getByText('Contents'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal onClose={onClose}>
        <p>Contents</p>
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
