import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarqueeBanner } from './MarqueeBanner';

describe('MarqueeBanner', () => {
  it('renders each tag as a hashtag', () => {
    render(<MarqueeBanner items={['ЯРКО', 'ДЕРЗКО', 'ХАРАКТЕР']} />);
    expect(screen.getAllByText('#ЯРКО').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#ДЕРЗКО').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#ХАРАКТЕР').length).toBeGreaterThan(0);
  });

  it('gives each tag its own gradient background', () => {
    render(<MarqueeBanner items={['ЯРКО', 'ДЕРЗКО']} />);
    const first = screen.getAllByText('#ЯРКО')[0];
    const second = screen.getAllByText('#ДЕРЗКО')[0];
    expect(first.getAttribute('style')).not.toEqual(second.getAttribute('style'));
  });

  it('duplicates the tag list for a seamless loop, hiding the copy from assistive tech', () => {
    render(<MarqueeBanner items={['ЯРКО']} />);
    expect(screen.getAllByText('#ЯРКО')).toHaveLength(2);
    const hiddenGroup = document.querySelector('[aria-hidden="true"]');
    expect(hiddenGroup?.textContent).toBe('#ЯРКО');
  });
});
