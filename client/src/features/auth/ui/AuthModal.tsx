import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/user';
import { Modal } from '@/shared/ui/Modal';
import { TextField } from '@/shared/ui/TextField';
import { Button } from '@/shared/ui/Button';
import { CloseButton } from '@/shared/ui/CloseButton';
import { loginFormSchema, registerFormSchema, type LoginFormValues, type RegisterFormValues } from '../model/schema';

interface AuthModalProps {
  onClose: () => void;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  function onSubmit(values: LoginFormValues) {
    const result = login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
      <TextField
        id="login-email"
        label="Email"
        type="email"
        autoFocus
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        id="login-password"
        label="Пароль"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      {formError && <p className="text-love text-sm">{formError}</p>}
      <Button type="submit" variant="accent" disabled={isSubmitting} className="mt-2 self-start">
        Войти
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  function onSubmit(values: RegisterFormValues) {
    const result = registerUser(values.name, values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
      <TextField id="register-name" label="Имя" autoFocus error={errors.name?.message} {...register('name')} />
      <TextField id="register-email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <TextField
        id="register-password"
        label="Пароль"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      {formError && <p className="text-love text-sm">{formError}</p>}
      <Button type="submit" variant="accent" disabled={isSubmitting} className="mt-2 self-start">
        Создать аккаунт
      </Button>
    </form>
  );
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <Modal onClose={onClose} labelledBy="auth-modal-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="bg-primary mb-3 block h-1.5 w-10" />
          <h2 id="auth-modal-title" className="font-display text-3xl uppercase">
            {mode === 'login' ? 'Войти' : 'Регистрация'}
          </h2>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      {mode === 'login' ? <LoginForm onSuccess={onClose} /> : <RegisterForm onSuccess={onClose} />}

      <p className="text-muted mt-5 text-sm">
        {mode === 'login' ? (
          <>
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={() => setMode('register')}
              className="text-primary hover:border-love hover:text-love border-primary border-b-2 pb-0.5 font-bold transition-colors"
            >
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-primary hover:border-love hover:text-love border-primary border-b-2 pb-0.5 font-bold transition-colors"
            >
              Войти
            </button>
          </>
        )}
      </p>
    </Modal>
  );
}
