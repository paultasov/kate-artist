import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children and responds to clicks', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Отправить</Button>);
    await user.click(screen.getByRole('button', { name: 'Отправить' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('defaults to the primary variant when none is given', () => {
    render(<Button>Отправить</Button>);
    const button = screen.getByRole('button', { name: 'Отправить' });
    expect(button).toHaveClass('bg-ink', 'text-canvas');
  });

  it('applies different classes for the secondary variant', () => {
    render(<Button variant="secondary">Закрыть</Button>);
    const button = screen.getByRole('button', { name: 'Закрыть' });
    expect(button.className).toContain('border-ink');
  });

  it('applies the high-contrast acid accent for the accent variant', () => {
    render(<Button variant="accent">Войти</Button>);
    const button = screen.getByRole('button', { name: 'Войти' });
    expect(button).toHaveClass('bg-acid', 'text-acid-foreground');
  });

  it('applies the light-on-dark border for the inverted variant', () => {
    render(<Button variant="inverted">Задать вопрос</Button>);
    const button = screen.getByRole('button', { name: 'Задать вопрос' });
    expect(button).toHaveClass('border-ink-foreground/40', 'text-ink-foreground');
  });

  it('applies the gold accent for the buy-specific variant', () => {
    render(<Button variant="gold">Купить</Button>);
    const button = screen.getByRole('button', { name: 'Купить' });
    expect(button).toHaveClass('bg-gold', 'text-gold-foreground');
  });

  it('is disabled and unclickable when disabled is set', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Отправить
      </Button>
    );
    await user.click(screen.getByRole('button', { name: 'Отправить' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
