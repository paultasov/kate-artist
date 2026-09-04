import { storage } from '@/shared/api/storage';
import type { Inquiry } from '../model/types';

export function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt'>): Inquiry {
  const inquiry: Inquiry = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const existing = storage.get<Inquiry[]>('inquiries') ?? [];
  storage.set('inquiries', [...existing, inquiry]);
  return inquiry;
}
