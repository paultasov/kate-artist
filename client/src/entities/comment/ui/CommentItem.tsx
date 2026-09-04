import type { Comment } from '../model/types';
import { formatDate } from '../lib/formatDate';
import { authorAccentFor } from '../lib/authorAccent';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const initial = comment.authorName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="border-hairline flex gap-3.5 border-b py-5 last:border-b-0">
      <span
        aria-hidden="true"
        className={`font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${authorAccentFor(comment.authorEmail)}`}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold">{comment.authorName}</span>
          <span className="text-muted shrink-0 text-xs">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-muted mt-1.5 text-sm leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
}
