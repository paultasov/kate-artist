import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lightbox } from './Lightbox';

describe('Lightbox', () => {
  it('renders the real image when an imageUrl is given', () => {
    render(<Lightbox imageUrl="/artworks/a.jpg" placeholderGradient="none" alt="Без масок" onClose={() => {}} />);
    const img = screen.getByRole('img', { name: 'Без масок' }) as HTMLImageElement;
    expect(img.src).toContain('/artworks/a.jpg');
  });

  it('renders a placeholder block when there is no image yet', () => {
    const { container } = render(
      <Lightbox imageUrl="" placeholderGradient="linear-gradient(red, blue)" alt="Без масок" onClose={() => {}} />
    );
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Без масок' })).toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Lightbox imageUrl="" placeholderGradient="none" alt="Без масок" onClose={onClose} />);
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Lightbox imageUrl="" placeholderGradient="none" alt="Без масок" onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows no prev/next arrows when the callbacks are not given (single-image use)', () => {
    render(<Lightbox imageUrl="" placeholderGradient="none" alt="Без масок" onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Предыдущая работа' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Следующая работа' })).not.toBeInTheDocument();
  });

  it('calls onPrev/onNext from the arrow buttons, without also closing', async () => {
    const onClose = vi.fn();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const user = userEvent.setup();
    render(
      <Lightbox
        imageUrl=""
        placeholderGradient="none"
        alt="Без масок"
        onClose={onClose}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Следующая работа' }));
    expect(onNext).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Предыдущая работа' }));
    expect(onPrev).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('navigates with the ArrowLeft/ArrowRight keys when onPrev/onNext are given', async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const user = userEvent.setup();
    render(
      <Lightbox
        imageUrl=""
        placeholderGradient="none"
        alt="Без масок"
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    await user.keyboard('{ArrowRight}');
    expect(onNext).toHaveBeenCalledOnce();
    await user.keyboard('{ArrowLeft}');
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('toggles zoom on the zoom button without closing, and resets to fit when the image changes', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Lightbox imageUrl="/artworks/a.jpg" placeholderGradient="none" alt="Работа A" onClose={onClose} />
    );

    const zoomButton = screen.getByRole('button', { name: 'Смотреть в полном разрешении' });
    await user.click(zoomButton);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    rerender(<Lightbox imageUrl="/artworks/b.jpg" placeholderGradient="none" alt="Работа B" onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Смотреть в полном разрешении' })).toBeInTheDocument();
  });

  it('clicking the zoomed image toggles zoom back off', async () => {
    const user = userEvent.setup();
    render(<Lightbox imageUrl="/artworks/a.jpg" placeholderGradient="none" alt="Работа" onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Смотреть в полном разрешении' }));
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeInTheDocument();

    await user.click(screen.getByRole('img', { name: 'Работа' }));
    expect(screen.getByRole('button', { name: 'Смотреть в полном разрешении' })).toBeInTheDocument();
  });

  it('drags the zoomed image to pan the dialog, and swallows the click that follows the drag', () => {
    const onClose = vi.fn();
    render(<Lightbox imageUrl="/artworks/a.jpg" placeholderGradient="none" alt="Работа" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Смотреть в полном разрешении' }));

    const image = screen.getByRole('img', { name: 'Работа' });
    const dialog = screen.getByRole('dialog');
    dialog.scrollLeft = 0;
    dialog.scrollTop = 0;

    fireEvent.mouseDown(image, { clientX: 100, clientY: 100 });
    fireEvent.pointerDown(image, { clientX: 100, clientY: 100, pointerType: 'mouse' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerMove(image, { clientX: 60, clientY: 70, pointerType: 'mouse' });
    expect(dialog.scrollLeft).toBe(40);
    expect(dialog.scrollTop).toBe(30);
    fireEvent.pointerUp(image, { clientX: 60, clientY: 70, pointerType: 'mouse' });

    fireEvent.click(image);
    expect(screen.getByRole('button', { name: 'Уменьшить' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders a supplied buyAction and keeps clicking it from closing the lightbox', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Lightbox
        imageUrl=""
        placeholderGradient="none"
        alt="Без масок"
        onClose={onClose}
        buyAction={<button type="button">Купить</button>}
      />
    );

    const buyButton = screen.getByRole('button', { name: 'Купить' });
    expect(buyButton).toBeInTheDocument();
    await user.click(buyButton);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('uses the shared floating-control chip styling on its zoom button, not a one-off copy', () => {
    render(<Lightbox imageUrl="" placeholderGradient="none" alt="Без масок" onClose={vi.fn()} />);
    const zoomButton = screen.getByRole('button', { name: 'Смотреть в полном разрешении' });
    expect(zoomButton).toHaveClass('bg-ink/70', 'ring-1', 'rounded-full');
  });
});
