import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InquiryModal } from './InquiryModal';
import { storage } from '@/shared/api/storage';
import type { Artwork } from '@/entities/artwork';
import type { Inquiry } from '@/entities/inquiry';

const artwork: Artwork = {
  id: 'artwork-1',
  title: 'Без масок',
  description: '',
  price: 21000,
  category: 'Акрил',
  imageUrl: '',
  featured: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('InquiryModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the right title and a pre-filled message per inquiry type', () => {
    render(<InquiryModal artwork={artwork} type="purchase" onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Купить работу' })).toBeInTheDocument();
    expect(screen.getByLabelText('Сообщение')).toHaveValue('Хочу купить работу «Без масок».');
  });

  it('shows validation errors and does not save when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<InquiryModal artwork={artwork} type="question" onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Введите имя')).toBeInTheDocument();
    expect(storage.get<Inquiry[]>('inquiries')).toBeNull();
  });

  it('saves a valid inquiry to storage and shows a confirmation', async () => {
    const user = userEvent.setup();
    render(<InquiryModal artwork={artwork} type="purchase" onClose={() => {}} />);

    await user.type(screen.getByLabelText('Имя'), 'Ирина');
    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => expect(screen.getByText('Заявка отправлена')).toBeInTheDocument());

    const saved = storage.get<Inquiry[]>('inquiries');
    expect(saved).toHaveLength(1);
    expect(saved?.[0]).toMatchObject({
      artworkId: 'artwork-1',
      artworkTitle: 'Без масок',
      type: 'purchase',
      name: 'Ирина',
      email: 'irina@example.com',
    });
  });
});
