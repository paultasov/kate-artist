import { beforeEach, describe, expect, it } from 'vitest';
import { storage } from '@/shared/api/storage';
import { addComment } from './addComment';
import type { Comment } from '../model/types';

describe('addComment', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates an id and timestamp, and returns the full record', () => {
    const comment = addComment({
      artworkId: 'a1',
      authorName: 'Ирина',
      authorEmail: 'irina@example.com',
      text: 'Очень красиво',
    });

    expect(comment.id).toBeTruthy();
    expect(comment.createdAt).toBeTruthy();
    expect(comment.text).toBe('Очень красиво');
  });

  it('appends to any existing comments rather than replacing them', () => {
    storage.set('comments', [
      { id: 'x', artworkId: 'a1', authorName: 'Old', authorEmail: 'old@example.com', text: 'x', createdAt: '2020' },
    ] satisfies Comment[]);

    addComment({ artworkId: 'a1', authorName: 'Ирина', authorEmail: 'irina@example.com', text: 'Новый' });

    expect(storage.get<Comment[]>('comments')).toHaveLength(2);
  });
});
