import { InstagramLogoIcon } from '@phosphor-icons/react';
import { ChasingText } from '@/shared/ui/ChasingText';

const INSTAGRAM_URL = 'https://www.instagram.com/katerinka19911/';

export function Footer() {
  return (
    <footer className="section-ink grain border-ink-foreground/15 border-t">
      <div className="text-ink-foreground/50 flex flex-col gap-6 px-5 py-10 text-xs font-semibold tracking-[0.2em] uppercase md:flex-row md:items-center md:justify-between md:px-16">
        <span className="group">
          <ChasingText text={`K.A.T.U.S.H.A, ${new Date().getFullYear()}`} />
        </span>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-acid text-ink-foreground/70 transition-colors"
        >
          <InstagramLogoIcon size={20} weight="regular" />
        </a>
      </div>
    </footer>
  );
}
