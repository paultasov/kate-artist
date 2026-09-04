import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArtworkPage from './ArtworkPage';
import { storage } from '@/shared/api/storage';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';
import type { Artwork } from '@/entities/artwork';

const artwork: Artwork = {
  id: 'artwork-1',
  title: 'Без масок',
  description: 'Работа акрилом на холсте.',
  price: 21000,
  category: 'Акрил',
  imageUrl: '',
  featured: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/artwork/:id" element={<ArtworkPage />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ArtworkPage', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.set('artworks', [artwork]);
  });

  it('shows a not-found message for an unknown id', () => {
    renderAt('/artwork/does-not-exist');
    expect(screen.getByRole('heading', { name: 'Работа не найдена' })).toBeInTheDocument();
  });

  it('renders the artwork title, price and description', () => {
    renderAt('/artwork/artwork-1');
    expect(screen.getByRole('heading', { name: 'Без масок' })).toBeInTheDocument();
    expect(screen.getByText('21 000 ₽')).toBeInTheDocument();
    expect(screen.getByText('Работа акрилом на холсте.')).toBeInTheDocument();
  });

  it('opens the lightbox when the image is clicked', async () => {
    const user = userEvent.setup();
    renderAt('/artwork/artwork-1');
    await user.click(screen.getByRole('button', { name: 'Смотреть в увеличенном масштабе' }));
    expect(screen.getByRole('dialog', { name: 'Без масок' })).toBeInTheDocument();
  });

  it("opens the inquiry modal (and closes the lightbox) from the lightbox's own Buy button", async () => {
    const user = userEvent.setup();
    renderAt('/artwork/artwork-1');

    await user.click(screen.getByRole('button', { name: 'Смотреть в увеличенном масштабе' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Купить/ }));

    expect(screen.getByRole('heading', { name: 'Купить работу' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Без масок' })).not.toBeInTheDocument();
  });

  it('opens the inquiry modal with the purchase title when "Купить" is clicked', async () => {
    const user = userEvent.setup();
    renderAt('/artwork/artwork-1');
    await user.click(screen.getByRole('button', { name: 'Купить' }));
    expect(screen.getByRole('heading', { name: 'Купить работу' })).toBeInTheDocument();
  });

  it('opens the inquiry modal with the question title when "Задать вопрос" is clicked', async () => {
    const user = userEvent.setup();
    renderAt('/artwork/artwork-1');
    await user.click(screen.getByRole('button', { name: 'Задать вопрос' }));
    expect(screen.getByRole('heading', { name: 'Задать вопрос' })).toBeInTheDocument();
  });

  it('prompts a guest to log in when the favorite button is clicked', async () => {
    const user = userEvent.setup();
    renderAt('/artwork/artwork-1');
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }));
    expect(screen.getByRole('heading', { name: 'Войти' })).toBeInTheDocument();
  });
});
