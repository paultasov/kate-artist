import { useState, type ReactNode } from 'react';
import { AuthModal } from '../ui/AuthModal';

interface AuthGate {
  openAuthModal: () => void;
  authModalNode: ReactNode;
}

export function useAuthGate(): AuthGate {
  const [open, setOpen] = useState(false);
  return {
    openAuthModal: () => setOpen(true),
    authModalNode: open ? <AuthModal onClose={() => setOpen(false)} /> : null,
  };
}
