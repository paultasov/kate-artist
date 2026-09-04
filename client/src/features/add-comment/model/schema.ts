import { z } from 'zod';

export const commentFormSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя или ник'),
  email: z.string().trim().email('Некорректный email'),
  text: z.string().trim().min(2, 'Комментарий слишком короткий'),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
