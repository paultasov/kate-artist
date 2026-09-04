import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/shared/ui/Reveal';
import { Magnetic } from '@/shared/ui/Magnetic';

const ABOUT_PHOTO = '/about/about-kate.png';

const TIMELINE = [
  { year: '2016', text: 'Первый холст. Краска на полу, соседи в шоке.' },
  { year: '2018', text: 'Первая продажа — прямо из инстаграма в чужую гостиную.' },
  { year: '2020', text: 'Своя студия. Свет с севера, никакого белого.' },
  { year: '2022', text: 'Групповая выставка. Несколько работ уехали в тот же вечер.' },
  { year: '2024', text: 'Персональная выставка и ни одной пустой стены.' },
  { year: '2026', text: 'Серия «Без масок» — самое честное, что я делала.' },
] as const;

const ACCENT_CYCLE = [
  { text: 'text-primary', bg: 'bg-primary' },
  { text: 'text-acid', bg: 'bg-acid' },
  { text: 'text-love', bg: 'bg-love' },
] as const;

interface StoryCardProps {
  year: string;
  text: string;
  index: number;
  total: number;
}

function StoryCard({ year, text, index, total }: StoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0.5]);
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];

  return (
    <div ref={ref} className="sticky top-0 h-[100svh]" style={{ zIndex: index + 1 }}>
      <motion.div style={reducedMotion ? undefined : { scale, opacity }} className="h-full w-full p-4 md:p-10">
        <div className="relative h-full w-full">
          <div aria-hidden="true" className={`absolute inset-0 translate-x-4 translate-y-4 rounded-sm ${accent.bg}`} />
          <div className="section-ink grain relative flex h-full w-full flex-col justify-between overflow-hidden rounded-sm p-8 pt-32 md:p-16">
            <div
              aria-hidden="true"
              className={`absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full opacity-20 blur-[110px] ${accent.bg}`}
            />

            <div className="relative flex items-center justify-between">
              <span className="text-ink-foreground/50 text-xs font-semibold tracking-[0.3em] uppercase">Путь</span>
              <span className="font-display text-ink-foreground/50 text-xs">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            <div className="relative">
              <p className={`font-display text-[clamp(4.5rem,16vw,11rem)] leading-none ${accent.text}`}>{year}</p>
              <p className="text-ink-foreground/80 mt-6 max-w-2xl text-xl leading-relaxed md:text-2xl">{text}</p>
            </div>

            <div aria-hidden="true" className={`relative h-[3px] w-16 ${accent.bg}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ClosingPanel({ total }: { total: number }) {
  return (
    <div className="sticky top-0 h-[100svh]" style={{ zIndex: total + 1 }}>
      <div className="section-ink grain flex h-full flex-col items-center justify-center gap-8 px-5 text-center md:px-16">
        <p className="text-acid text-xs font-bold tracking-[0.35em] uppercase">Дальше — ваша стена</p>
        <h2 className="text-stacked text-[clamp(2.5rem,7vw,5.5rem)] uppercase">Хотите работу под своё пространство?</h2>
        <Magnetic>
          <Link
            to="/works"
            className="bg-primary text-primary-foreground font-display inline-flex items-center rounded-full px-8 py-4 text-sm leading-[1.15] uppercase transition-transform duration-200 active:scale-95"
          >
            Смотреть работы
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="grain pt-24 pb-12">
        <div className="grid gap-10 px-5 md:grid-cols-12 md:items-center md:gap-10 md:px-16">
          <Reveal className="md:col-span-5">
            <p className="text-muted text-xs font-semibold tracking-[0.3em] uppercase">Kate · Акрил</p>
            <h1 className="text-stacked-ink mt-4 text-[clamp(2.8rem,6vw,4.5rem)] leading-[0.9] uppercase">
              Цвет громче слов
            </h1>
            <p className="text-muted mt-6 text-xl leading-relaxed">
              Акрил сохнет быстро и не даёт передумать: ровно как жизнь.
            </p>
            <p className="text-muted mt-4 max-w-sm">
              Каждый холст выходит таким, какой есть — без черновиков и оправданий.
            </p>
            <p className="text-muted mt-6">
              Instagram —{' '}
              <Magnetic strength={0.2}>
                <a
                  href="https://www.instagram.com/katerinka19911/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink border-ink hover:text-primary hover:border-primary border-b transition-colors"
                >
                  @katerinka19911
                </a>
              </Magnetic>
            </p>
          </Reveal>

          <Reveal delay={0.15} className="relative md:col-span-7">
            <div aria-hidden="true" className="bg-primary absolute inset-0 translate-x-4 translate-y-4 rounded-sm" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <img
                src={ABOUT_PHOTO}
                alt="Kate"
                loading="lazy"
                className="h-full w-full object-cover object-[85%_center]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="px-5 py-10 md:px-16 md:py-14">
        <p className="text-muted text-xs font-semibold tracking-[0.3em] uppercase">История · 2016—2026</p>
        <div aria-hidden="true" className="bg-primary mt-4 h-[3px] w-16" />
      </div>

      <div className="relative">
        {TIMELINE.map((item, index) => (
          <StoryCard key={item.year} year={item.year} text={item.text} index={index} total={TIMELINE.length} />
        ))}
        <ClosingPanel total={TIMELINE.length} />
      </div>
    </>
  );
}
