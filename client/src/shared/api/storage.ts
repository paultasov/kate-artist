export type StorageKey =
  'users' | 'currentUser' | 'artworks' | 'favorites' | 'comments' | 'adminSettings' | 'inquiries';

function get<T>(key: StorageKey): T | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set<T>(key: StorageKey, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: StorageKey): void {
  localStorage.removeItem(key);
}

export const storage = { get, set, remove };
