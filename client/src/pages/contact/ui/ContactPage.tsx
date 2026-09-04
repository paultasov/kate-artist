import { ContactForm } from '@/features/send-inquiry';
import { Reveal } from '@/shared/ui/Reveal';

export default function ContactPage() {
  return (
    <div className="section-ink grain flex min-h-[100dvh] items-center px-5 py-32 md:px-16">
      <div className="mx-auto w-full max-w-3xl text-center">
        <Reveal>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] uppercase">Контакты</h1>
          <p className="text-ink-foreground/70 mx-auto mt-4 max-w-md text-base">
            Есть вопрос или предложение? Напишите мне, обычно отвечаю в течение дня
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-md text-left">
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
