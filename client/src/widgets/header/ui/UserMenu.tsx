import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GearSixIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';
import { useEscapeKey } from '@/shared/lib/useEscapeKey';

interface UserMenuProps {
  name: string;
  onLogout: () => void;
}

export function UserMenu({ name, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => setOpen(false));

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Меню профиля"
        className="border-ink-foreground/20 text-ink-foreground hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
      >
        <UserIcon size={17} weight={open ? 'fill' : 'regular'} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-ink border-ink-foreground/10 absolute top-full right-0 mt-3 min-w-[190px] origin-top-right overflow-hidden rounded-sm border shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
          >
            <p className="text-primary border-ink-foreground/10 font-display truncate border-b px-4 py-3 text-sm normal-case">
              {name}
            </p>
            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-ink-foreground/80 hover:bg-ink-foreground/10 hover:text-ink-foreground flex items-center gap-2.5 px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <GearSixIcon size={15} />
              Настройки
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="text-ink-foreground/80 hover:bg-ink-foreground/10 hover:text-ink-foreground flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <SignOutIcon size={15} />
              Выйти
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
