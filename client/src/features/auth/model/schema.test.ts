import { describe, expect, it } from 'vitest';
import { loginFormSchema, registerFormSchema } from './schema';

describe('loginFormSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    const result = loginFormSchema.safeParse({ email: 'irina@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = loginFormSchema.safeParse({ email: 'not-an-email', password: 'secret' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Некорректный email');
    }
  });

  it('rejects an empty password', () => {
    const result = loginFormSchema.safeParse({ email: 'irina@example.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Введите пароль');
    }
  });
});

describe('registerFormSchema', () => {
  it('accepts a valid name, email, and 6+ character password', () => {
    const result = registerFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', password: 'secret1' });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email', () => {
    const result = registerFormSchema.safeParse({ name: 'Ирина', email: 'not-an-email', password: 'secret1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Некорректный email');
    }
  });

  it('accepts a password at exactly the 6-character minimum', () => {
    const result = registerFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects a password one character short of the minimum', () => {
    const result = registerFormSchema.safeParse({ name: 'Ирина', email: 'irina@example.com', password: '12345' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Минимум 6 символов');
    }
  });

  it('rejects a one-character name', () => {
    const result = registerFormSchema.safeParse({ name: 'И', email: 'irina@example.com', password: 'secret1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Введите имя');
    }
  });
});
