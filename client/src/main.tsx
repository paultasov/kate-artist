import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/shared/styles/tokens.css';
import { App } from '@/app';
import { seedIfEmpty } from '@/app/seed';

seedIfEmpty();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
