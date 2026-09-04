import { describe, expect, it } from 'vitest';
import { placeholderGradientFor } from './placeholderGradient';

describe('placeholderGradientFor', () => {
  it('always returns the same gradient for the same id', () => {
    expect(placeholderGradientFor('artwork-1')).toBe(placeholderGradientFor('artwork-1'));
  });

  it('can return a different gradient for a different id', () => {
    expect(placeholderGradientFor('artwork-1')).not.toBe(placeholderGradientFor('artwork-2'));
  });

  it('always returns a valid CSS gradient string, never undefined, across many ids', () => {
    for (let i = 0; i < 50; i++) {
      const gradient = placeholderGradientFor(`artwork-${i}`);
      expect(typeof gradient).toBe('string');
      expect(gradient.length).toBeGreaterThan(0);
    }
  });

  it('handles an empty id without throwing', () => {
    expect(() => placeholderGradientFor('')).not.toThrow();
  });
});
