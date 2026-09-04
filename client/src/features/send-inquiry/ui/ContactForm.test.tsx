import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';
import { storage } from '@/shared/api/storage';
import type { Inquiry } from '@/entities/inquiry';

describe('ContactForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows validation errors and saves nothing when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Введите имя')).toBeInTheDocument();
    expect(storage.get('inquiries')).toBeNull();
  });

  it('saves a general inquiry (no artwork) and shows a confirmation', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText('Имя'), 'Ирина');
    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.type(screen.getByLabelText('Сообщение'), 'Хочу узнать про сотрудничество.');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => expect(screen.getByText('Заявка отправлена')).toBeInTheDocument());

    const saved = storage.get<Inquiry[]>('inquiries');
    expect(saved).toHaveLength(1);
    expect(saved?.[0]).toMatchObject({
      type: 'general',
      name: 'Ирина',
      email: 'irina@example.com',
      message: 'Хочу узнать про сотрудничество.',
    });
    expect(saved?.[0].artworkId).toBeUndefined();
  });
});
