import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя'),
  email: z.string().trim().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
