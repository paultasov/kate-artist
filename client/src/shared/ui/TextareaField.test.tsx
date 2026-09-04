import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextareaField } from './TextareaField';

describe('TextareaField', () => {
  it('associates the label with the textarea via id', () => {
    render(<TextareaField id="message" label="Сообщение" />);
    expect(screen.getByLabelText('Сообщение')).toBeInTheDocument();
  });

  it('shows an error message when given one', () => {
    render(<TextareaField id="message" label="Сообщение" error="Слишком коротко" />);
    expect(screen.getByText('Слишком коротко')).toBeInTheDocument();
  });

  it('forwards native textarea props such as rows', () => {
    render(<TextareaField id="message" label="Сообщение" rows={5} />);
    expect(screen.getByLabelText('Сообщение')).toHaveAttribute('rows', '5');
  });
});
