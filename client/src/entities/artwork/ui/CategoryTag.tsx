interface CategoryTagProps {
  category: string;
  className?: string;
}

export function CategoryTag({ category, className }: CategoryTagProps) {
  return (
    <span
      className={`bg-acid text-acid-foreground inline-flex items-center rounded-full px-3 py-1 text-[10px] leading-none font-semibold tracking-widest uppercase ${className ?? ''}`}
    >
      #{category}
    </span>
  );
}
