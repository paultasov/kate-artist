import { useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HeartIcon, ListIcon, PaletteIcon, XIcon } from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useFavorites } from '@/entities/favorite';
import { useAuthGate } from '@/features/auth';
import { UserMenu } from './UserMenu';

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/works', label: 'Работы' },
  { to: '/about', label: 'О художнике' },
  { to: '/contact', label: 'Контакты' },
] as const;

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `after:bg-gold relative text-sm font-bold tracking-[0.08em] uppercase text-ink-foreground transition-opacity duration-150 after:absolute after:-bottom-1.5 after:inset-x-0 after:h-[2px] after:origin-left after:transition-transform after:duration-200 ${
    isActive ? 'opacity-100 after:scale-x-100' : 'opacity-55 hover:opacity-100 after:scale-x-0 hover:after:scale-x-100'
  }`;
}

export function Header() {
  const { currentUser, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const location = useLocation();
  const { openAuthModal, authModalNode } = useAuthGate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const favoritesCount = favoriteIds.size;

  function closeMobile() {
    setMobileOpen(false);
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    closeMobile();
    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="bg-ink text-ink-foreground border-ink-foreground/10 fixed inset-x-0 top-0 z-50 border-b px-5 py-5 md:px-16">
      <div className="flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5" onClick={handleLogoClick}>
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <PaletteIcon size={16} weight="fill" />
          </span>
          <span className="font-display text-ink-foreground text-lg tracking-tight uppercase">KATE</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? 'Закрыть меню' : 'Меню'}
          aria-expanded={mobileOpen}
          className="text-ink-foreground flex h-9 w-9 items-center justify-center md:hidden"
        >
          {mobileOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
        </button>

        <nav
          className={`${mobileOpen ? 'flex' : 'hidden'} bg-ink border-ink-foreground/10 absolute inset-x-0 top-full flex-col items-start gap-6 border-b px-5 py-8 md:static md:flex md:flex-row md:items-center md:gap-9 md:border-0 md:bg-transparent md:p-0`}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMobile}
              className={navLinkClassName}
            >
              {link.label}
            </NavLink>
          ))}
          {currentUser ? (
            <>
              <Link
                to="/profile"
                aria-label="Избранное"
                onClick={closeMobile}
                className={`hover:border-love hover:bg-love hover:text-love-foreground relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  favoritesCount > 0 ? 'border-primary/40 text-primary' : 'border-ink-foreground/20 text-ink-foreground'
                }`}
              >
                <HeartIcon aria-hidden="true" size={16} weight={favoritesCount > 0 ? 'fill' : 'regular'} />
                {favoritesCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                  >
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <UserMenu name={currentUser.name} onLogout={logout} />
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMobile();
                openAuthModal();
              }}
              className="bg-acid text-acid-foreground inline-flex items-center rounded-full px-4 py-2 text-xs leading-none font-bold tracking-[0.15em] uppercase transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              Войти
            </button>
          )}
        </nav>
      </div>
      {authModalNode}
    </header>
  );
}
