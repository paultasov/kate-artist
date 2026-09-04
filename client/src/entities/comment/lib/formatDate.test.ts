import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('renders a long-form Russian date', () => {
    expect(formatDate('2026-03-10T00:00:00.000Z')).toBe('10 марта 2026 г.');
  });

  it('renders a different month correctly', () => {
    expect(formatDate('2026-12-25T00:00:00.000Z')).toBe('25 декабря 2026 г.');
  });
});
