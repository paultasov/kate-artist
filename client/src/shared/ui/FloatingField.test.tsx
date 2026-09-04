import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingTextField, FloatingTextareaField } from './FloatingField';

describe('FloatingTextField', () => {
  it('renders the label and links it to the input', () => {
    render(<FloatingTextField id="name" label="Имя" />);
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });

  it('shows no error message by default', () => {
    const { container } = render(<FloatingTextField id="name" label="Имя" />);
    expect(container.querySelector('.text-love')).toBeNull();
  });

  it('shows the error message in the love (violet) color, matching every other form on the site', () => {
    render(<FloatingTextField id="email" label="Email" error="Некорректный email" />);
    const error = screen.getByText('Некорректный email');
    expect(error).toHaveClass('text-love');
  });
});

describe('FloatingTextareaField', () => {
  it('renders the label and links it to the textarea', () => {
    render(<FloatingTextareaField id="message" label="Сообщение" />);
    expect(screen.getByLabelText('Сообщение')).toBeInTheDocument();
  });

  it('shows the error message in the love (violet) color', () => {
    render(<FloatingTextareaField id="message" label="Сообщение" error="Слишком короткое" />);
    const error = screen.getByText('Слишком короткое');
    expect(error).toHaveClass('text-love');
  });
});
