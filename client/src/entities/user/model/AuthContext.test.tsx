import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { storage } from '@/shared/api/storage';
import type { User } from './types';

function Probe() {
  const { currentUser, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="current-user">{currentUser ? currentUser.name : 'none'}</div>
      <button onClick={() => register('Ирина', 'irina@example.com', 'secret123')}>register</button>
      <button onClick={() => login('irina@example.com', 'secret123')}>login-correct</button>
      <button onClick={() => login('irina@example.com', 'wrong-pass')}>login-wrong</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no current user when storage is empty', () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByTestId('current-user')).toHaveTextContent('none');
  });

  it('restores the current user from storage on mount', () => {
    const existing: User = { id: '1', name: 'Kate', email: 'kate@example.com', password: 'x', isAdmin: false };
    storage.set('currentUser', existing);
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByTestId('current-user')).toHaveTextContent('Kate');
  });

  it('creates a new user record on register and stores it as the current user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await user.click(screen.getByText('register'));

    expect(screen.getByTestId('current-user')).toHaveTextContent('Ирина');
    expect(storage.get<User[]>('users')).toHaveLength(1);
    expect(storage.get<User>('currentUser')?.email).toBe('irina@example.com');
  });

  it('refuses to register a duplicate email', async () => {
    storage.set('users', [
      { id: 'existing-1', name: 'Old Name', email: 'irina@example.com', password: 'x', isAdmin: false },
    ]);
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await user.click(screen.getByText('register'));

    expect(storage.get<User[]>('users')).toHaveLength(1);
    expect(screen.getByTestId('current-user')).toHaveTextContent('none');
  });

  it('logs in with the correct password', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await user.click(screen.getByText('register'));
    await user.click(screen.getByText('logout'));
    await user.click(screen.getByText('login-correct'));

    expect(screen.getByTestId('current-user')).toHaveTextContent('Ирина');
  });

  it('refuses to log in with the wrong password', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await user.click(screen.getByText('register'));
    await user.click(screen.getByText('logout'));
    await user.click(screen.getByText('login-wrong'));

    expect(screen.getByTestId('current-user')).toHaveTextContent('none');
  });

  it('clears the current user on logout', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    await user.click(screen.getByText('register'));
    await user.click(screen.getByText('logout'));

    expect(screen.getByTestId('current-user')).toHaveTextContent('none');
    expect(storage.get('currentUser')).toBeNull();
  });

  it('throws a clear error when used outside an AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();
  });
});
