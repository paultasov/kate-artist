import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates the label with the input via id', () => {
    render(<TextField id="email" label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows an error message when given one', () => {
    render(<TextField id="email" label="Email" error="Некорректный email" />);
    expect(screen.getByText('Некорректный email')).toBeInTheDocument();
  });

  it('renders no error text when none is given', () => {
    render(<TextField id="email" label="Email" />);
    expect(screen.queryByText(/./, { selector: 'span' })).not.toBeInTheDocument();
  });

  it('forwards native input props such as type and placeholder', () => {
    render(<TextField id="password" label="Пароль" type="password" placeholder="secret" />);
    const input = screen.getByLabelText('Пароль') as HTMLInputElement;
    expect(input.type).toBe('password');
    expect(input.placeholder).toBe('secret');
  });
});
