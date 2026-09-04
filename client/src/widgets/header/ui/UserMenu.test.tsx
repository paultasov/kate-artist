import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { UserMenu } from './UserMenu';

function renderMenu(onLogout = vi.fn()) {
  return render(
    <MemoryRouter>
      <UserMenu name="Ирина Петрова" onLogout={onLogout} />
    </MemoryRouter>
  );
}

describe('UserMenu', () => {
  it('renders only an icon trigger, menu closed by default', () => {
    renderMenu();
    expect(screen.getByRole('button', { name: 'Меню профиля' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('opens the menu on click, showing the name, settings link and logout', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }));

    expect(screen.getByText('Ирина Петрова')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Настройки/ })).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('menuitem', { name: /Выйти/ })).toBeInTheDocument();
  });

  it('calls onLogout and closes when "Выйти" is chosen', async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();
    renderMenu(onLogout);

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }));
    await user.click(screen.getByRole('menuitem', { name: /Выйти/ }));

    expect(onLogout).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('closes the menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div>
          <UserMenu name="Ирина" onLogout={vi.fn()} />
          <button type="button">Снаружи</button>
        </div>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Меню профиля' }));
    expect(screen.getByRole('menuitem', { name: /Выйти/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Снаружи' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});
