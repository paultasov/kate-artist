import { GearSixIcon } from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useAuthGate } from '@/features/auth';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';

function SettingsPreview() {
  return (
    <div className="border-hairline bg-canvas relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-dashed p-8">
      <span className="bg-acid text-acid-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
        Скоро
      </span>

      <div className="flex animate-pulse items-center gap-4">
        <div className="bg-hairline h-14 w-14 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="bg-hairline h-3 w-2/3 rounded-full" />
          <div className="bg-hairline h-3 w-1/3 rounded-full" />
        </div>
      </div>

      <div className="mt-9 animate-pulse space-y-6">
        <div>
          <div className="bg-hairline mb-2 h-2.5 w-20 rounded-full" />
          <div className="border-hairline h-10 w-full rounded-sm border" />
        </div>
        <div>
          <div className="bg-hairline mb-2 h-2.5 w-24 rounded-full" />
          <div className="border-hairline h-10 w-full rounded-sm border" />
        </div>
      </div>

      <div className="bg-hairline mt-9 h-10 w-36 animate-pulse rounded-full" />
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { openAuthModal, authModalNode } = useAuthGate();

  if (!currentUser) {
    return (
      <>
        <Reveal className="mx-auto flex max-w-md flex-col items-center px-5 pt-40 pb-32 text-center md:px-16">
          <h1 className="text-4xl uppercase">
            <span className="text-primary">Настройки</span>
          </h1>
          <p className="text-muted mt-4 text-base">Войдите, чтобы управлять профилем.</p>
          <Button type="button" variant="accent" className="mt-8" onClick={openAuthModal}>
            Войти
          </Button>
        </Reveal>
        {authModalNode}
      </>
    );
  }

  return (
    <div className="px-5 pt-40 pb-24 md:px-16">
      <Reveal className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="bg-primary/10 text-primary mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full">
            <GearSixIcon size={26} weight="duotone" />
          </span>
          <h1 className="text-4xl uppercase">
            <span className="text-primary">Настройки</span>
          </h1>
          <p className="text-muted mt-4 max-w-sm text-base">
            Здесь вы сможете управлять вашим профилем: имя, почта, пароль и уведомления. Пока раздел находится в
            разработке.
          </p>
          <p className="text-muted mt-3 text-sm">
            Вы вошли как <span className="text-ink font-semibold">{currentUser.name}</span>
          </p>
        </div>
        <SettingsPreview />
      </Reveal>
    </div>
  );
}
