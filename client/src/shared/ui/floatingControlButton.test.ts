import { describe, expect, it } from 'vitest';
import { FLOATING_CONTROL_BUTTON } from './floatingControlButton';

describe('FLOATING_CONTROL_BUTTON', () => {
  it('is opaque enough and ringed, not the old bare bg-ink/60 with no defining edge', () => {
    expect(FLOATING_CONTROL_BUTTON).toContain('bg-ink/70');
    expect(FLOATING_CONTROL_BUTTON).toContain('ring-1');
    expect(FLOATING_CONTROL_BUTTON).not.toMatch(/\bbg-ink\/60\b/);
  });

  it('carries the shared circular chip shape every caller relies on', () => {
    expect(FLOATING_CONTROL_BUTTON).toContain('rounded-full');
    expect(FLOATING_CONTROL_BUTTON).toContain('h-10');
    expect(FLOATING_CONTROL_BUTTON).toContain('w-10');
  });
});
