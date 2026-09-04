const TAG_GRADIENTS = [
  'linear-gradient(135deg, #e2481f, #a8300f)',
  'linear-gradient(135deg, #29b6e8, #14708f)',
  'linear-gradient(135deg, #8b5cf6, #5b2fc7)',
];

const TEXTURE_OVERLAY =
  'repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 8px)';

interface MarqueeBannerProps {
  items: string[];
  tone?: 'light' | 'dark';
}

function Tags({ items, hidden }: { items: string[]; hidden: boolean }) {
  return (
    <div className="flex items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span
          key={item}
          className="text-4xl font-extrabold tracking-tight whitespace-nowrap lg:text-5xl"
          style={{
            backgroundImage: `${TEXTURE_OVERLAY}, ${TAG_GRADIENTS[i % TAG_GRADIENTS.length]}`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          #{item}
        </span>
      ))}
    </div>
  );
}

export function MarqueeBanner({ items, tone = 'light' }: MarqueeBannerProps) {
  const borderClass = tone === 'dark' ? 'border-ink-foreground/15' : 'border-hairline';

  return (
    <div className={`overflow-hidden border-y py-8 ${borderClass}`}>
      <div className="marquee-track flex w-max" style={{ ['--marquee-duration' as string]: '17s' }}>
        <Tags items={items} hidden={false} />
        <Tags items={items} hidden />
      </div>
    </div>
  );
}
