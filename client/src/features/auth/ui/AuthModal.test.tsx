import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from './AuthModal';
import { AuthProvider } from '@/entities/user';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';

function renderModal(onClose = () => {}) {
  return render(
    <AuthProvider>
      <AuthModal onClose={onClose} />
    </AuthProvider>
  );
}

describe('AuthModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('opens on the login mode by default', () => {
    renderModal();
    expect(screen.getByRole('heading', { name: 'Войти' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Имя')).not.toBeInTheDocument();
  });

  it('switches to the registration form', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    expect(screen.getByRole('heading', { name: 'Регистрация' })).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
  });

  it('rejects a short password on registration', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await user.type(screen.getByLabelText('Имя'), 'Ирина');
    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.type(screen.getByLabelText('Пароль'), '123');
    await user.click(screen.getByRole('button', { name: 'Создать аккаунт' }));

    expect(await screen.findByText('Минимум 6 символов')).toBeInTheDocument();
    expect(storage.get('users')).toBeNull();
  });

  it('registers a new user, storing the password, and closes on success', async () => {
    const user = userEvent.setup();
    let closed = false;
    renderModal(() => {
      closed = true;
    });
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await user.type(screen.getByLabelText('Имя'), 'Ирина');
    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Создать аккаунт' }));

    await waitFor(() => expect(closed).toBe(true));
    const user1 = storage.get<User>('currentUser');
    expect(user1?.email).toBe('irina@example.com');
    expect(user1?.password).toBe('secret123');
  });

  it('rejects login with a wrong password without logging in', async () => {
    storage.set('users', [
      { id: 'u1', name: 'Ирина', email: 'irina@example.com', password: 'correct-pass', isAdmin: false },
    ]);
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'wrong-pass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Неверный email или пароль')).toBeInTheDocument();
    expect(storage.get('currentUser')).toBeNull();
  });

  it('logs in an existing user with the correct password', async () => {
    storage.set('users', [
      { id: 'u1', name: 'Ирина', email: 'irina@example.com', password: 'correct-pass', isAdmin: false },
    ]);
    const user = userEvent.setup();
    let closed = false;
    renderModal(() => {
      closed = true;
    });

    await user.type(screen.getByLabelText('Email'), 'irina@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'correct-pass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => expect(closed).toBe(true));
    expect(storage.get<User>('currentUser')?.id).toBe('u1');
  });
});
