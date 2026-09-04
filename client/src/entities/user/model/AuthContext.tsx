import { useState, type ReactNode } from 'react';
import { storage } from '@/shared/api/storage';
import type { User } from './types';
import { AuthContext, type AuthResult } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.get<User>('currentUser'));

  function login(email: string, password: string): AuthResult {
    const users = storage.get<User[]>('users') ?? [];
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((existing) => existing.email.toLowerCase() === normalizedEmail);

    if (!user || user.password !== password) {
      return { ok: false, error: 'Неверный email или пароль' };
    }

    storage.set('currentUser', user);
    setCurrentUser(user);
    return { ok: true };
  }

  function register(name: string, email: string, password: string): AuthResult {
    const users = storage.get<User[]>('users') ?? [];
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((existing) => existing.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'Пользователь с таким email уже зарегистрирован' };
    }

    const user: User = { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), password, isAdmin: false };
    storage.set('users', [...users, user]);
    storage.set('currentUser', user);
    setCurrentUser(user);
    return { ok: true };
  }

  function logout() {
    storage.remove('currentUser');
    setCurrentUser(null);
  }

  return <AuthContext.Provider value={{ currentUser, login, register, logout }}>{children}</AuthContext.Provider>;
}
