import { storage } from '@/shared/api/storage';
import type { Comment } from '../model/types';

export function addComment(data: Omit<Comment, 'id' | 'createdAt'>): Comment {
  const comment: Comment = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = storage.get<Comment[]>('comments') ?? [];
  storage.set('comments', [...existing, comment]);
  return comment;
}
