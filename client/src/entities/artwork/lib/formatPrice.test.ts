import { describe, expect, it } from 'vitest';
import { formatPrice } from './formatPrice';

const NBSP = String.fromCharCode(160);

describe('formatPrice', () => {
  it('groups thousands and appends the ruble sign', () => {
    expect(formatPrice(21000)).toBe(`21${NBSP}000 ₽`);
  });

  it('handles amounts under a thousand without a separator', () => {
    expect(formatPrice(500)).toBe('500 ₽');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('0 ₽');
  });
});
