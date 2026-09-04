export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
