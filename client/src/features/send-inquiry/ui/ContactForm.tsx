import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircleIcon } from '@phosphor-icons/react';
import { addInquiry } from '@/entities/inquiry';
import { FloatingTextField, FloatingTextareaField } from '@/shared/ui/FloatingField';
import { Button } from '@/shared/ui/Button';
import { inquiryFormSchema, type InquiryFormValues } from '../model/schema';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const reducedMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  function onSubmit(values: InquiryFormValues) {
    addInquiry({ type: 'general', ...values });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-acid/15 relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        >
          <span className="border-acid/30 absolute inset-0 animate-ping rounded-full border motion-reduce:animate-none" />
          <CheckCircleIcon size={38} weight="fill" className="text-acid" />
        </motion.div>
        <h2 className="text-2xl uppercase">Заявка отправлена</h2>
        <p className="text-ink-foreground/60 mt-3 text-sm">Я свяжусь с вами по указанной почте</p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSent(false);
          }}
          className="text-ink-foreground/50 hover:text-ink-foreground mt-8 text-xs font-semibold tracking-[0.2em] uppercase underline-offset-4 transition-colors hover:underline"
        >
          Написать ещё раз
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FloatingTextField id="contact-name" label="Имя" error={errors.name?.message} {...register('name')} />
      <FloatingTextField
        id="contact-email"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FloatingTextareaField
        id="contact-message"
        label="Сообщение"
        error={errors.message?.message}
        {...register('message')}
      />
      <Button type="submit" variant="accent" disabled={isSubmitting}>
        Отправить
      </Button>
    </form>
  );
}
