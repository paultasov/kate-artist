import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  it('calls the callback when Escape is pressed', () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeKey(onEscape));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onEscape).toHaveBeenCalledOnce();
  });

  it('ignores other keys', () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeKey(onEscape));

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(onEscape));
    unmount();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onEscape).not.toHaveBeenCalled();
  });
});
