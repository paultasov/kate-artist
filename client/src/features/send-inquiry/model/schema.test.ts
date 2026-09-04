import { describe, expect, it } from 'vitest';
import { inquiryFormSchema } from './schema';

describe('inquiryFormSchema', () => {
  it('accepts a valid name, email, and message', () => {
    const result = inquiryFormSchema.safeParse({
      name: 'Ирина',
      email: 'irina@example.com',
      message: 'Хочу купить эту работу',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = inquiryFormSchema.safeParse({ name: 'Ирина', email: 'not-an-email', message: 'Хочу купить' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Некорректный email');
    }
  });

  it('accepts a message at exactly the 5-character minimum', () => {
    const result = inquiryFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', message: 'Хочу!' });
    expect(result.success).toBe(true);
  });

  it('rejects a message one character short of the minimum', () => {
    const result = inquiryFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', message: 'Хочу' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Сообщение слишком короткое');
    }
  });
});
