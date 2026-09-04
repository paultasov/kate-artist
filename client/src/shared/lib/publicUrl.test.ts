import { describe, expect, it } from 'vitest';
import { publicUrl } from './publicUrl';

describe('publicUrl', () => {
  it('prefixes a leading-slash path with the configured base URL', () => {
    expect(publicUrl('/artworks/artwork-01.png')).toBe(`${import.meta.env.BASE_URL}artworks/artwork-01.png`);
  });

  it('works the same without a leading slash', () => {
    expect(publicUrl('artworks/artwork-01.png')).toBe(`${import.meta.env.BASE_URL}artworks/artwork-01.png`);
  });

  it('never produces a double slash between the base and the path', () => {
    expect(publicUrl('/slider/kate-01.png')).not.toMatch(/[^:]\/\//);
  });
});
