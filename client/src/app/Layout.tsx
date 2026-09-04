import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { useLenis } from 'lenis/react';

export function Layout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const outlet = useOutlet();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [location.pathname, lenis]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, transform: 'translateY(12px)' }}
          animate={{
            opacity: 1,
            transform: 'translateY(0px)',
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
