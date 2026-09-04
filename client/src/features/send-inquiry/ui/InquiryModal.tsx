import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Artwork } from '@/entities/artwork';
import { addInquiry, type InquiryType } from '@/entities/inquiry';
import { Modal } from '@/shared/ui/Modal';
import { TextField } from '@/shared/ui/TextField';
import { TextareaField } from '@/shared/ui/TextareaField';
import { Button } from '@/shared/ui/Button';
import { CloseButton } from '@/shared/ui/CloseButton';
import { inquiryFormSchema, type InquiryFormValues } from '../model/schema';

export type ArtworkInquiryType = Exclude<InquiryType, 'general'>;

interface InquiryModalProps {
  artwork: Artwork;
  type: ArtworkInquiryType;
  onClose: () => void;
}

const TITLES: Record<ArtworkInquiryType, string> = {
  purchase: 'Купить работу',
  question: 'Задать вопрос',
};

function defaultMessage(type: ArtworkInquiryType, title: string): string {
  return type === 'purchase' ? `Хочу купить работу «${title}».` : `Вопрос по работе «${title}».`;
}

export function InquiryModal({ artwork, type, onClose }: InquiryModalProps) {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: '', email: '', message: defaultMessage(type, artwork.title) },
  });

  function onSubmit(values: InquiryFormValues) {
    addInquiry({ artworkId: artwork.id, artworkTitle: artwork.title, type, ...values });
    setSent(true);
  }

  return (
    <Modal onClose={onClose} labelledBy="inquiry-modal-title">
      {sent ? (
        <>
          <span className="bg-acid mb-3 block h-1.5 w-10" />
          <h2 id="inquiry-modal-title" className="font-display text-3xl uppercase">
            Заявка отправлена
          </h2>
          <p className="text-muted mt-3 text-sm">Я свяжусь с вами по указанной почте</p>
          <Button type="button" variant="secondary" onClick={onClose} className="mt-6">
            Закрыть
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="bg-primary mb-3 block h-1.5 w-10" />
              <h2 id="inquiry-modal-title" className="font-display text-3xl uppercase">
                {TITLES[type]}
              </h2>
            </div>
            <CloseButton onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
            <TextField id="inquiry-name" label="Имя" autoFocus error={errors.name?.message} {...register('name')} />
            <TextField
              id="inquiry-email"
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextareaField
              id="inquiry-message"
              label="Сообщение"
              rows={3}
              error={errors.message?.message}
              {...register('message')}
            />
            <Button type="submit" variant="accent" disabled={isSubmitting} className="mt-2 self-start">
              Отправить
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
}
