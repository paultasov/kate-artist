import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentsSection } from './CommentsSection';
import { AuthProvider } from '@/entities/user';
import { storage } from '@/shared/api/storage';
import type { Comment } from '@/entities/comment';

function makeComment(overrides: Partial<Comment>): Comment {
  return {
    id: 'c1',
    artworkId: 'artwork-1',
    authorName: 'Someone',
    authorEmail: 'someone@example.com',
    text: 'Comment text',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function renderSection(artworkId = 'artwork-1') {
  return render(
    <AuthProvider>
      <CommentsSection artworkId={artworkId} />
    </AuthProvider>
  );
}

describe('CommentsSection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows an empty state when there are no comments for this artwork', () => {
    renderSection();
    expect(screen.getByText('Пока нет комментариев. Будьте первым.')).toBeInTheDocument();
  });

  it('only shows comments belonging to the given artwork', () => {
    storage.set('comments', [
      makeComment({ id: 'c1', artworkId: 'artwork-1', text: 'For artwork 1' }),
      makeComment({ id: 'c2', artworkId: 'artwork-2', text: 'For artwork 2' }),
    ]);
    renderSection('artwork-1');
    expect(screen.getByText('For artwork 1')).toBeInTheDocument();
    expect(screen.queryByText('For artwork 2')).not.toBeInTheDocument();
  });

  it('adds a newly submitted comment to the visible list immediately, without a login step', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.type(screen.getByLabelText('Имя или ник'), 'Гость');
    await user.type(screen.getByLabelText('Email'), 'guest@example.com');
    await user.type(screen.getByLabelText('Комментарий'), 'Новый комментарий');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Новый комментарий')).toBeInTheDocument();
    expect(screen.queryByText('Пока нет комментариев. Будьте первым.')).not.toBeInTheDocument();
  });

  it('never renders the author email anywhere on the page', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.type(screen.getByLabelText('Имя или ник'), 'Гость');
    await user.type(screen.getByLabelText('Email'), 'secret-email@example.com');
    await user.type(screen.getByLabelText('Комментарий'), 'Новый комментарий');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await screen.findByText('Новый комментарий');
    expect(screen.queryByText('secret-email@example.com')).not.toBeInTheDocument();
  });
});
