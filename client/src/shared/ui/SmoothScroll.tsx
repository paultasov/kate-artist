import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
