import { storage } from '@/shared/api/storage';
import type { User } from '@/entities/user';
import type { Artwork } from '@/entities/artwork';

const demoUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Kate',
    email: 'kate@example.com',
    password: 'admin',
    isAdmin: true,
  },
];

const demoArtworks: Artwork[] = [
  {
    id: 'artwork-1',
    title: 'Сквозь пламя',
    description: 'Лицо на границе огня и холода, ещё не решившее, в какую сторону остыть.',
    price: 19500,
    category: 'Хаос',
    imageUrl: '/artworks/artwork-temp-02.png',
    orientation: 'vertical',
    featured: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'artwork-2',
    title: 'Тихая лодка',
    description: 'Единственная неподвижная точка в кадре, где всё остальное горит и течёт.',
    price: 22000,
    category: 'Пейзаж',
    imageUrl: '/artworks/artwork-temp-03.png',
    orientation: 'vertical',
    featured: false,
    createdAt: '2026-02-03T00:00:00.000Z',
  },
  {
    id: 'artwork-3',
    title: 'Цветные пятна',
    description: 'Профиль, на который будто плеснули красками вместо того, чтобы просто нарисовать.',
    price: 15800,
    category: 'Портрет',
    imageUrl: '/artworks/artwork-temp-04.png',
    orientation: 'vertical',
    featured: true,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'artwork-4',
    title: 'Конфетти на коже',
    description: 'Блики цвета вместо украшений: портрет, в котором свет заменяет всё лишнее.',
    price: 24000,
    category: 'Портрет',
    imageUrl: '/artworks/artwork-temp-05.png',
    orientation: 'vertical',
    featured: false,
    createdAt: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 'artwork-5',
    title: 'Жёлтая шляпа',
    description: 'Оптимизм такой силы, что даже тёмные очки от него не спасают.',
    price: 17200,
    category: 'Портрет',
    imageUrl: '/artworks/artwork-temp-06.png',
    orientation: 'vertical',
    featured: true,
    createdAt: '2026-03-22T00:00:00.000Z',
  },
  {
    id: 'artwork-6',
    title: 'Треснувший портрет',
    description: 'Лицо, собранное из осколков, которые не до конца согласились быть одним целым.',
    price: 20500,
    category: 'Хаос',
    imageUrl: '/artworks/artwork-temp-07.png',
    orientation: 'vertical',
    featured: false,
    createdAt: '2026-04-02T00:00:00.000Z',
  },
  {
    id: 'artwork-7',
    title: 'Терраса у моря',
    description: 'Слишком много цвета для одного балкона: бугенвиллия побеждает горизонт.',
    price: 18600,
    category: 'Пейзаж',
    imageUrl: '/artworks/artwork-temp-08.png',
    orientation: 'horizontal',
    featured: true,
    createdAt: '2026-04-14T00:00:00.000Z',
  },
  {
    id: 'artwork-8',
    title: 'Одна лодка',
    description: 'Закат, который важнее лодки, но лодка всё равно держит взгляд.',
    price: 21000,
    category: 'Пейзаж',
    imageUrl: '/artworks/artwork-temp-09.png',
    orientation: 'horizontal',
    featured: false,
    createdAt: '2026-04-20T00:00:00.000Z',
  },
];

export function seedIfEmpty(): void {
  if (storage.get<User[]>('users') === null) {
    storage.set('users', demoUsers);
  }
  if (storage.get<Artwork[]>('artworks') === null) {
    storage.set('artworks', demoArtworks);
  }
}
