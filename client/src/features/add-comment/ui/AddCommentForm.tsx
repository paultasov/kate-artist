import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/entities/user';
import { addComment, type Comment } from '@/entities/comment';
import { TextField } from '@/shared/ui/TextField';
import { TextareaField } from '@/shared/ui/TextareaField';
import { Button } from '@/shared/ui/Button';
import { commentFormSchema, type CommentFormValues } from '../model/schema';

interface AddCommentFormProps {
  artworkId: string;
  onAdded: (comment: Comment) => void;
}

export function AddCommentForm({ artworkId, onAdded }: AddCommentFormProps) {
  const { currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { name: currentUser?.name ?? '', email: currentUser?.email ?? '', text: '' },
  });

  function onSubmit(values: CommentFormValues) {
    const comment = addComment({ artworkId, authorName: values.name, authorEmail: values.email, text: values.text });
    onAdded(comment);
    reset({ name: values.name, email: values.email, text: '' });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="comment-name" label="Имя или ник" error={errors.name?.message} {...register('name')} />
        <TextField id="comment-email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
      </div>
      <TextareaField
        id="comment-text"
        label="Комментарий"
        rows={3}
        error={errors.text?.message}
        {...register('text')}
      />
      <Button type="submit" disabled={isSubmitting} className="self-start">
        Отправить
      </Button>
    </form>
  );
}
