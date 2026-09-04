import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import { AuthProvider } from '@/entities/user';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';

const loggedInUser: User = {
  id: 'user-1',
  name: 'Ирина',
  email: 'irina@example.com',
  password: 'secret123',
  isAdmin: false,
};

function renderSettings() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('SettingsPage', () => {
  it('asks a guest to log in', () => {
    renderSettings();
    expect(screen.getByText('Войдите, чтобы управлять профилем.')).toBeInTheDocument();
  });

  it('shows the placeholder for a logged-in user, with their name', () => {
    storage.set('currentUser', loggedInUser);
    renderSettings();
    expect(screen.getByText(/управлять вашим профилем/)).toBeInTheDocument();
    expect(screen.getByText('Ирина')).toBeInTheDocument();
  });
});
