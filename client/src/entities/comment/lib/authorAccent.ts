const ACCENTS = ['bg-primary text-primary-foreground', 'bg-acid text-acid-foreground', 'bg-love text-love-foreground'];

export function authorAccentFor(authorEmail: string): string {
  const key = authorEmail.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}
