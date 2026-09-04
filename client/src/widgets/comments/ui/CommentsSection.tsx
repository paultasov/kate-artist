import { useState } from 'react';
import { CommentItem, type Comment } from '@/entities/comment';
import { AddCommentForm } from '@/features/add-comment';
import { storage } from '@/shared/api/storage';

interface CommentsSectionProps {
  artworkId: string;
}

export function CommentsSection({ artworkId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(() =>
    (storage.get<Comment[]>('comments') ?? []).filter((comment) => comment.artworkId === artworkId)
  );

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl uppercase">Комментарии</h2>
        {comments.length > 0 && <span className="text-muted text-sm font-semibold">{comments.length}</span>}
      </div>

      {comments.length === 0 ? (
        <p className="text-muted mt-4 text-sm">Пока нет комментариев. Будьте первым.</p>
      ) : (
        <div className="border-hairline mt-5 border-t">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      <AddCommentForm artworkId={artworkId} onAdded={(comment) => setComments((prev) => [...prev, comment])} />
    </div>
  );
}
