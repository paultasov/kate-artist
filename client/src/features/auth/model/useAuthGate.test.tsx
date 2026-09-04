import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/entities/user';
import { useAuthGate } from './useAuthGate';

describe('useAuthGate', () => {
  it('renders no modal until openAuthModal is called', () => {
    const { result } = renderHook(() => useAuthGate());
    expect(result.current.authModalNode).toBeNull();
  });

  it('opens the modal, and closing it clears the node again', async () => {
    const { result } = renderHook(() => useAuthGate());

    act(() => result.current.openAuthModal());
    expect(result.current.authModalNode).not.toBeNull();

    const user = userEvent.setup();
    render(<AuthProvider>{result.current.authModalNode}</AuthProvider>);
    expect(screen.getByRole('heading', { name: 'Войти' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(result.current.authModalNode).toBeNull();
  });
});
