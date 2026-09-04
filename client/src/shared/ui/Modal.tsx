import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useEscapeKey } from '@/shared/lib/useEscapeKey';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export function Modal({ onClose, children, labelledBy }: ModalProps) {
  const reducedMotion = useReducedMotion();

  useEscapeKey(onClose);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-canvas border-ink relative w-full max-w-md origin-center rounded-sm border-2 p-8 shadow-[8px_8px_0_0_var(--color-primary)]"
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
}
