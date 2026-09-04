import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when a key has never been set', () => {
    expect(storage.get('artworks')).toBeNull();
  });

  it('round-trips a value through set and get', () => {
    const artworks = [{ id: '1', title: 'Test' }];
    storage.set('artworks', artworks);
    expect(storage.get('artworks')).toEqual(artworks);
  });

  it('removes a value', () => {
    storage.set('currentUser', { id: '1' });
    storage.remove('currentUser');
    expect(storage.get('currentUser')).toBeNull();
  });

  it('returns null for corrupted (non-JSON) stored data instead of throwing', () => {
    localStorage.setItem('artworks', '{not valid json');
    expect(storage.get('artworks')).toBeNull();
  });

  it('serializes values as JSON in localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    storage.set('adminSettings', { theme: 'dark' });
    expect(setItemSpy).toHaveBeenCalledWith('adminSettings', JSON.stringify({ theme: 'dark' }));
  });
});
