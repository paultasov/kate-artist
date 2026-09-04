import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/shared/ui/Reveal';
import { Magnetic } from '@/shared/ui/Magnetic';
import { MarqueeBanner } from '@/widgets/marquee-banner';
import { FeaturedSlider } from '@/widgets/featured-slider';
import { getArtworks } from '@/entities/artwork';
import { publicUrl } from '@/shared/lib/publicUrl';

const ABOUT_PHOTO = publicUrl('/artworks/artwork-01.png');

const TAGS = ['ДЕРЗКО', 'ЧЕСТНОСТЬ', 'ХАОС', 'ГЛУБИНА', 'ЯРКО', 'МОМЕНТ', 'ГРОМКО', 'СУТЬ'];

const EASE = [0.16, 1, 0.3, 1] as const;

const SLIDES = [
  { kicker: 'Студия · Акрил', line: 'Крупные форматы', photo: publicUrl('/slider/kate-01.png') },
  { kicker: 'Акрил · Мастихин · Спрей', line: 'Работаю быстро', photo: publicUrl('/slider/kate-02.png') },
  { kicker: 'Плотный цвет, никаких полутонов', line: 'Живу ярко', photo: publicUrl('/slider/kate-03.png') },
  { kicker: 'Ночной город, дневная студия', line: 'Смотрю иначе', photo: publicUrl('/slider/kate-04.png') },
  { kicker: 'Никаких компромиссов', line: 'Делаю по-своему', photo: publicUrl('/slider/kate-05.png') },
];

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const artworks = getArtworks();
  const featuredOnly = artworks.filter((artwork) => artwork.featured);
  const featured = (featuredOnly.length > 0 ? featuredOnly : artworks).slice(0, 4);
  const slide = SLIDES[slideIndex]!;

  const { scrollYProgress } = useScroll();
  const washY1 = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '35%']);
  const washY2 = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '55%']);
  const washY3 = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '20%']);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => setSlideIndex((prev) => (prev + 1) % SLIDES.length), 5200);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  return (
    <>
      <section className="section-ink grain relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            style={{
              y: washY1,
              background: 'radial-gradient(circle, #e2481f 0%, transparent 70%)',
            }}
            className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full opacity-30 blur-[110px]"
          />
          <motion.div
            style={{
              y: washY2,
              background: 'radial-gradient(circle, #29b6e8 0%, transparent 70%)',
            }}
            className="absolute top-40 left-[22%] h-[360px] w-[360px] rounded-full opacity-25 blur-[100px]"
          />
          <motion.div
            style={{
              y: washY3,
              background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            }}
            className="absolute -top-10 left-[8%] h-[280px] w-[280px] rounded-full opacity-20 blur-[90px]"
          />
        </div>

        <div className="relative grid min-h-[92svh] grid-cols-1 items-center gap-10 px-5 pt-32 pb-16 md:min-h-[86svh] md:grid-cols-12 md:gap-10 md:px-16 md:pt-40 md:pb-16">
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.p
                key={slide.kicker}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-acid text-xs tracking-[0.35em] uppercase"
              >
                {slide.kicker}
              </motion.p>
            </AnimatePresence>

            <h1 className="text-stacked mt-6 text-[clamp(4.5rem,18vw,14rem)] leading-[0.82] uppercase">KATE</h1>

            <div className="font-display text-ink-foreground/70 mt-6 h-[1.15em] overflow-hidden text-[clamp(1.3rem,3.6vw,2.4rem)] uppercase">
              <AnimatePresence mode="wait">
                <motion.span
                  key={slide.line}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="block"
                >
                  {slide.line}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="text-ink-foreground/70 mt-8 max-w-md">
              Акриловая живопись крупных форматов: насыщенный цвет и слои, которые видно с другого конца комнаты.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  to="/works"
                  className="bg-acid text-acid-foreground font-display inline-flex items-center rounded-full px-8 py-4 text-sm leading-[1.15] uppercase transition-transform duration-200 active:scale-95"
                >
                  Все работы
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/contact"
                  className="border-ink-foreground/40 text-ink-foreground font-display inline-flex items-center rounded-full border px-8 py-4 text-sm leading-[1.15] uppercase"
                >
                  Заказать картину
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-ink relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <AnimatePresence initial={false}>
                <motion.img
                  key={slideIndex}
                  src={slide.photo}
                  alt="Kate"
                  initial={reducedMotion ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', scale: 1.1 }}
                  animate={reducedMotion ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
                  transition={{ duration: 1.1, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
              <div className="from-ink/70 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3">
                {SLIDES.map((item, index) => (
                  <button
                    key={item.kicker}
                    type="button"
                    aria-label={`Слайд ${index + 1}`}
                    onClick={() => setSlideIndex(index)}
                    className="bg-ink-foreground/25 h-[3px] flex-1"
                  >
                    <span
                      className="bg-acid block h-full transition-all duration-500"
                      style={{ width: index === slideIndex ? '100%' : '0%' }}
                    />
                  </button>
                ))}
                <span className="font-display text-ink-foreground/70 text-xs">
                  0{slideIndex + 1}/0{SLIDES.length}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-12">
            <MarqueeBanner items={TAGS} tone="dark" />
          </div>
        </div>
      </section>

      <section className="grain px-5 py-24 md:px-16">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-[clamp(2.5rem,8vw,6rem)] uppercase">
                Самое <span className="text-primary">яркое</span>
              </h2>
              <Link
                to="/works"
                className="bg-ink text-canvas hover:bg-primary hover:text-primary-foreground group inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-xs leading-none font-bold tracking-[0.25em] uppercase transition-colors"
              >
                Смотреть все работы
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <FeaturedSlider artworks={featured} />
          </Reveal>
        </div>
      </section>

      <section className="section-ink grain grid gap-10 px-5 py-24 md:grid-cols-2 md:items-center md:px-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-sm">
            <img
              src={ABOUT_PHOTO}
              alt="Kate за работой"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-acid text-sm font-bold tracking-[0.35em] uppercase">Кто я</p>
          <h2 className="text-stacked mt-6 text-[clamp(2rem,6vw,4.5rem)] uppercase">Цвет громче слов</h2>
          <p className="text-ink-foreground/70 mt-6 max-w-lg">
            Каждый холст — громкий разговор, который не влез в слова.
          </p>
          <Magnetic className="mt-8">
            <Link
              to="/about"
              className="bg-acid text-acid-foreground font-display inline-flex items-center rounded-full px-8 py-4 text-sm leading-[1.15] uppercase"
            >
              О художнике
            </Link>
          </Magnetic>
        </Reveal>
      </section>
    </>
  );
}
