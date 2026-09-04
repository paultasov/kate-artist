import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useAuthGate } from '@/features/auth';
import { FavoriteButton } from '@/features/toggle-favorite';
import { BuyButton } from '@/features/send-inquiry';
import { ArtworkCard, getArtworks } from '@/entities/artwork';
import { Reveal } from '@/shared/ui/Reveal';
import { Magnetic } from '@/shared/ui/Magnetic';
import { Button } from '@/shared/ui/Button';
import { useFavorites } from '@/entities/favorite';

function EmptyState({ description, action }: { description: string; action: ReactNode }) {
  return (
    <Reveal className="mx-auto flex max-w-md flex-col items-center px-5 pt-40 pb-32 text-center md:px-16">
      <div className="bg-primary/10 relative mb-8 flex h-32 w-32 items-center justify-center rounded-full">
        <HeartIcon size={56} weight="duotone" className="text-primary" />
        <span className="border-primary/30 absolute inset-0 animate-ping rounded-full border motion-reduce:animate-none" />
      </div>
      <h1 className="text-4xl uppercase">
        <span className="text-primary">Избранное</span>
      </h1>
      <p className="text-muted mt-4 text-base">{description}</p>
      <div className="mt-8">{action}</div>
    </Reveal>
  );
}

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { favoriteIds } = useFavorites();
  const { openAuthModal, authModalNode } = useAuthGate();

  if (!currentUser) {
    return (
      <>
        <EmptyState
          description="Войдите, чтобы увидеть сохранённые работы."
          action={
            <Button type="button" variant="accent" onClick={openAuthModal}>
              Войти
            </Button>
          }
        />
        {authModalNode}
      </>
    );
  }

  const artworks = getArtworks().filter((artwork) => favoriteIds.has(artwork.id));

  return artworks.length === 0 ? (
    <EmptyState
      description="Пока ничего не добавлено. Нажмите на сердечко у понравившейся работы."
      action={
        <Magnetic>
          <Link
            to="/works"
            className="bg-primary text-primary-foreground font-display inline-flex items-center rounded-full px-8 py-4 text-sm leading-[1.15] uppercase transition-transform duration-200 active:scale-95"
          >
            Смотреть работы
          </Link>
        </Magnetic>
      }
    />
  ) : (
    <div className="px-5 pt-40 pb-24 md:px-16">
      <Reveal>
        <h1 className="text-4xl uppercase">
          <span className="text-primary">Избранное</span>
        </h1>
        <p className="text-muted mt-2 text-sm tracking-[0.3em] uppercase">
          {artworks.length} {artworks.length === 1 ? 'работа' : 'работы'}
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            aspectClassName="aspect-[4/5]"
            actions={<FavoriteButton artworkId={artwork.id} surface="image" />}
            buyAction={<BuyButton artwork={artwork} />}
          />
        ))}
      </div>
    </div>
  );
}
