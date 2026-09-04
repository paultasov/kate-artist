import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentItem } from './CommentItem';
import type { Comment } from '../model/types';

const comment: Comment = {
  id: 'c1',
  artworkId: 'artwork-1',
  authorName: 'Ирина',
  authorEmail: 'irina@example.com',
  text: 'Очень красивая работа!',
  createdAt: '2026-03-10T00:00:00.000Z',
};

describe('CommentItem', () => {
  it('renders the author and text', () => {
    render(<CommentItem comment={comment} />);
    expect(screen.getByText('Ирина')).toBeInTheDocument();
    expect(screen.getByText('Очень красивая работа!')).toBeInTheDocument();
  });

  it('renders a human-readable date', () => {
    render(<CommentItem comment={comment} />);
    expect(screen.getByText('10 марта 2026 г.')).toBeInTheDocument();
  });

  it('never renders the author email', () => {
    render(<CommentItem comment={comment} />);
    expect(screen.queryByText('irina@example.com')).not.toBeInTheDocument();
  });

  it("colors the avatar by the author's email, not the comment id — the same person's two comments match", () => {
    const { container: first } = render(<CommentItem comment={{ ...comment, id: 'c1' }} />);
    const { container: second } = render(<CommentItem comment={{ ...comment, id: 'c2', text: 'Другой текст' }} />);

    const firstAvatar = first.querySelector('[aria-hidden="true"]');
    const secondAvatar = second.querySelector('[aria-hidden="true"]');
    expect(firstAvatar?.className).toBe(secondAvatar?.className);
  });
});
