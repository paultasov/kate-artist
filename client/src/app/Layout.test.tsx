import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom';
import { Layout } from './Layout';
import { AuthProvider } from '@/entities/user';
import { FavoritesProvider } from '@/entities/favorite';

vi.mock('lenis/react', () => ({
  useLenis: vi.fn(),
}));

import { useLenis } from 'lenis/react';

function renderLayout() {
  return render(
    <AuthProvider>
      <FavoritesProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Link to="/works">Go to works</Link>} />
              <Route path="/works" element={<div>Works page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

describe('Layout', () => {
  it('renders the header, the routed page content, and the footer together', () => {
    renderLayout();
    expect(screen.getByRole('link', { name: 'KATE' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to works' })).toBeInTheDocument();
    expect(screen.getByText(/K\.A\.T\.U\.S\.H\.A/)).toBeInTheDocument();
  });

  it('resets scroll through Lenis on navigation, not the native API, when Lenis is active', async () => {
    const scrollTo = vi.fn();
    vi.mocked(useLenis).mockReturnValue({ scrollTo } as unknown as ReturnType<typeof useLenis>);
    const user = userEvent.setup();
    renderLayout();

    scrollTo.mockClear();
    await user.click(screen.getByRole('link', { name: 'Go to works' }));

    expect(scrollTo).toHaveBeenCalledWith(0, { immediate: true });
    expect(screen.getByText('Works page')).toBeInTheDocument();
  });

  it('freezes the exiting page instead of letting it re-render as the new route (the actual cause of the reported navigation jitter)', async () => {
    vi.mocked(useLenis).mockReturnValue({ scrollTo: vi.fn() } as unknown as ReturnType<typeof useLenis>);
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('link', { name: 'Go to works' }));

    expect(screen.getAllByText('Works page')).toHaveLength(1);
  });

  it('falls back to the native scrollTo when Lenis is not active (reduced motion)', () => {
    vi.mocked(useLenis).mockReturnValue(undefined);
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;
    renderLayout();

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });
});
