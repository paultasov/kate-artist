import { z } from 'zod';

export const inquiryFormSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя'),
  email: z.string().trim().email('Некорректный email'),
  message: z.string().trim().min(5, 'Сообщение слишком короткое'),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
