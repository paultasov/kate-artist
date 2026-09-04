import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCommentForm } from './AddCommentForm';
import { AuthProvider } from '@/entities/user';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Comment } from '@/entities/comment';

const loggedInUser: User = {
  id: 'user-1',
  name: 'Ирина',
  email: 'irina@example.com',
  password: 'secret123',
  isAdmin: false,
};

function renderForm(onAdded = vi.fn()) {
  const result = render(
    <AuthProvider>
      <AddCommentForm artworkId="artwork-1" onAdded={onAdded} />
    </AuthProvider>
  );
  return { onAdded, ...result };
}

describe('AddCommentForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the form to a guest without requiring login', () => {
    renderForm();
    expect(screen.getByLabelText('Имя или ник')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Комментарий')).toBeInTheDocument();
  });

  it('pre-fills name and email for a logged-in user', () => {
    storage.set('currentUser', loggedInUser);
    renderForm();
    expect(screen.getByLabelText('Имя или ник')).toHaveValue('Ирина');
    expect(screen.getByLabelText('Email')).toHaveValue('irina@example.com');
  });

  it('shows validation errors and saves nothing when required fields are missing', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: 'Отправить' }));
    expect(await screen.findByText('Введите имя или ник')).toBeInTheDocument();
    expect(storage.get('comments')).toBeNull();
  });

  it('saves the comment with the email attached but never renders the email as visible text elsewhere on the page', async () => {
    const user = userEvent.setup();
    const { onAdded } = renderForm();

    await user.type(screen.getByLabelText('Имя или ник'), 'Гость');
    await user.type(screen.getByLabelText('Email'), 'guest@example.com');
    await user.type(screen.getByLabelText('Комментарий'), 'Очень красиво!');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    const saved = storage.get<Comment[]>('comments');
    expect(saved).toHaveLength(1);
    expect(saved?.[0]).toMatchObject({
      artworkId: 'artwork-1',
      authorName: 'Гость',
      authorEmail: 'guest@example.com',
      text: 'Очень красиво!',
    });
    expect(onAdded).toHaveBeenCalledWith(expect.objectContaining({ authorEmail: 'guest@example.com' }));
  });

  it('clears only the comment text after a successful submit, keeping name and email', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Имя или ник'), 'Гость');
    await user.type(screen.getByLabelText('Email'), 'guest@example.com');
    const textarea = screen.getByLabelText('Комментарий') as HTMLTextAreaElement;
    await user.type(textarea, 'Очень красиво!');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(textarea.value).toBe('');
    expect(screen.getByLabelText('Имя или ник')).toHaveValue('Гость');
    expect(screen.getByLabelText('Email')).toHaveValue('guest@example.com');
  });
});
