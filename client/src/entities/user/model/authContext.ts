import { createContext } from 'react';
import type { User } from './types';

export type AuthResult = { ok: true } | { ok: false; error: string };

export interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
