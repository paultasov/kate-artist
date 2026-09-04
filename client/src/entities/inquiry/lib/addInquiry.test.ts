import { beforeEach, describe, expect, it } from 'vitest';
import { storage } from '@/shared/api/storage';
import { addInquiry } from './addInquiry';
import type { Inquiry } from '../model/types';

describe('addInquiry', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates an id and timestamp, and returns the full record', () => {
    const inquiry = addInquiry({ type: 'general', name: 'Ирина', email: 'irina@example.com', message: 'Привет' });

    expect(inquiry.id).toBeTruthy();
    expect(inquiry.createdAt).toBeTruthy();
    expect(inquiry.type).toBe('general');
  });

  it('appends to any existing inquiries rather than replacing them', () => {
    storage.set('inquiries', [
      { id: 'x', type: 'general', name: 'Old', email: 'old@example.com', message: 'x', createdAt: '2020-01-01' },
    ] satisfies Inquiry[]);

    addInquiry({ type: 'purchase', artworkId: 'a1', name: 'Ирина', email: 'irina@example.com', message: 'Хочу' });

    expect(storage.get<Inquiry[]>('inquiries')).toHaveLength(2);
  });
});
