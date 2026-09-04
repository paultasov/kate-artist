import { describe, expect, it } from 'vitest';
import { authorAccentFor } from './authorAccent';

describe('authorAccentFor', () => {
  it('gives the same author the same color every time', () => {
    expect(authorAccentFor('irina@example.com')).toBe(authorAccentFor('irina@example.com'));
  });

  it('is case-insensitive — the same person typing their email differently still gets one color', () => {
    expect(authorAccentFor('Irina@Example.com')).toBe(authorAccentFor('irina@example.com'));
  });

  it('ignores surrounding whitespace', () => {
    expect(authorAccentFor('  irina@example.com  ')).toBe(authorAccentFor('irina@example.com'));
  });

  it('picks one of the three brand accents', () => {
    const accent = authorAccentFor('irina@example.com');
    expect(['bg-primary', 'bg-acid', 'bg-love'].some((prefix) => accent.startsWith(prefix))).toBe(true);
  });
});
