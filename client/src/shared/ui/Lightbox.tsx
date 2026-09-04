import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@phosphor-icons/react';
import { FLOATING_CONTROL_BUTTON } from './floatingControlButton';
import { useEscapeKey } from '@/shared/lib/useEscapeKey';

interface LightboxProps {
  imageUrl: string;
  placeholderGradient: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  buyAction?: ReactNode;
}

const CONTROL_BUTTON = `${FLOATING_CONTROL_BUTTON} fixed z-10`;

export function Lightbox({ imageUrl, placeholderGradient, alt, onClose, onPrev, onNext, buyAction }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const justDraggedRef = useRef(false);

  const [prevImageUrl, setPrevImageUrl] = useState(imageUrl);
  if (imageUrl !== prevImageUrl) {
    setPrevImageUrl(imageUrl);
    setZoomed(false);
  }

  useEscapeKey(onClose);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') onPrev?.();
      if (event.key === 'ArrowRight') onNext?.();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext]);

  function handleImagePointerDown(event: ReactPointerEvent<HTMLImageElement>) {
    event.stopPropagation();
    if (!zoomed || event.pointerType !== 'mouse' || !scrollRef.current) return;
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  }

  function handleImagePointerMove(event: ReactPointerEvent<HTMLImageElement>) {
    const start = dragStartRef.current;
    if (!start || !scrollRef.current) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) justDraggedRef.current = true;
    scrollRef.current.scrollLeft = start.scrollLeft - dx;
    scrollRef.current.scrollTop = start.scrollTop - dy;
  }

  function handleImagePointerUp(event: ReactPointerEvent<HTMLImageElement>) {
    event.stopPropagation();
    dragStartRef.current = null;
    setDragging(false);
  }

  function handleImageClick(event: ReactMouseEvent<HTMLImageElement>) {
    event.stopPropagation();
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    setZoomed((z) => !z);
  }

  return createPortal(
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className={`fixed inset-0 z-50 bg-black/85 p-6 ${
        zoomed ? 'overflow-auto' : 'flex cursor-zoom-out items-center justify-center'
      }`}
      onMouseDown={onClose}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="text-canvas hover:text-primary fixed top-6 right-6 z-10 inline-block text-3xl leading-none transition-[color,transform] duration-200 hover:rotate-90"
        onMouseDown={(e) => e.stopPropagation()}
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setZoomed((z) => !z);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label={zoomed ? 'Уменьшить' : 'Смотреть в полном разрешении'}
        className={`${CONTROL_BUTTON} top-6 right-20`}
      >
        {zoomed ? (
          <MagnifyingGlassMinusIcon size={18} weight="bold" />
        ) : (
          <MagnifyingGlassPlusIcon size={18} weight="bold" />
        )}
      </button>

      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Предыдущая работа"
          className={`${CONTROL_BUTTON} top-1/2 left-4 -translate-y-1/2`}
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Следующая работа"
          className={`${CONTROL_BUTTON} top-1/2 right-4 -translate-y-1/2`}
        >
          <ArrowRightIcon size={18} weight="bold" />
        </button>
      )}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          draggable={false}
          className={
            zoomed
              ? `mx-auto my-auto block select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`
              : 'max-h-full max-w-full cursor-zoom-in object-contain'
          }
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={handleImagePointerDown}
          onPointerMove={handleImagePointerMove}
          onPointerUp={handleImagePointerUp}
          onPointerCancel={handleImagePointerUp}
          onClick={handleImageClick}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="aspect-[4/5] max-h-full w-full max-w-2xl cursor-default"
          style={{ background: placeholderGradient }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}

      {buyAction && (
        <div
          className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {buyAction}
        </div>
      )}
    </div>,
    document.body
  );
}
