import { describe, expect, it } from 'vitest';
import { commentFormSchema } from './schema';

describe('commentFormSchema', () => {
  it('accepts a valid name, email, and comment text', () => {
    const result = commentFormSchema.safeParse({
      name: 'Ирина',
      email: 'irina@example.com',
      text: 'Очень красивая работа',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = commentFormSchema.safeParse({ name: 'Ирина', email: 'not-an-email', text: 'Красиво' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Некорректный email');
    }
  });

  it('rejects a one-character comment', () => {
    const result = commentFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', text: '!' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Комментарий слишком короткий');
    }
  });
});
