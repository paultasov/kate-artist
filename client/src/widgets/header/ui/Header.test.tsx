import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';

function renderHeader(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <FavoritesProvider>
          <Header />
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the wordmark and nav links', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'KATE' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Работы' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'О художнике' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Контакты' })).toBeInTheDocument();
  });

  it('keeps the label itself plain white, no hue-coding on the text', () => {
    renderHeader();
    const link = screen.getByRole('link', { name: 'Работы' });
    expect(link).toHaveClass('text-ink-foreground');
    expect(link.className).not.toMatch(/text-primary\b|text-acid\b|text-love\b|bg-primary|bg-acid|rounded-full/);
  });

  it('marks the active page with full opacity and a permanent gold underline bar, dims inactive links with the bar hidden', () => {
    renderHeader('/works');
    const active = screen.getByRole('link', { name: 'Работы' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(active).toHaveClass('opacity-100', 'after:scale-x-100', 'after:bg-gold');

    const inactive = screen.getByRole('link', { name: 'Главная' });
    expect(inactive).not.toHaveAttribute('aria-current');
    expect(inactive).toHaveClass('opacity-55', 'hover:opacity-100', 'after:scale-x-0', 'hover:after:scale-x-100');
  });

  it('scrolls to top instead of navigating when the wordmark is clicked while already on the home page', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    renderHeader('/');

    await user.click(screen.getByRole('link', { name: 'KATE' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('lets the wordmark navigate home normally from any other page (no scroll interception)', () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo;
    renderHeader('/works');

    expect(screen.getByRole('link', { name: 'KATE' })).toHaveAttribute('href', '/');
  });

  it('shows a "Войти" button for a guest, which opens the auth modal', async () => {
    const user = userEvent.setup();
    renderHeader();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    expect(screen.getByRole('heading', { name: 'Войти' })).toBeInTheDocument();
  });

  it('shows "Избранное" and a profile menu icon for a logged-in user', () => {
    const loggedInUser: User = {
      id: 'user-1',
      name: 'Ирина',
      email: 'irina@example.com',
      password: 'secret123',
      isAdmin: false,
    };
    storage.set('currentUser', loggedInUser);
    renderHeader();
    expect(screen.getByRole('link', { name: 'Избранное' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Меню профиля' })).toBeInTheDocument();
  });

  it('logs out from the user menu', async () => {
    const loggedInUser: User = {
      id: 'user-1',
      name: 'Ирина',
      email: 'irina@example.com',
      password: 'secret123',
      isAdmin: false,
    };
    storage.set('currentUser', loggedInUser);
    const user = userEvent.setup();
    renderHeader();

    expect(screen.queryByRole('menuitem', { name: /Выйти/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Меню профиля' }));
    await user.click(screen.getByRole('menuitem', { name: /Выйти/ }));

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });
});
