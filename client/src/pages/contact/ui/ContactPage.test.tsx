import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/entities/user';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the heading and the contact form fields', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ContactPage />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Контакты' })).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Сообщение')).toBeInTheDocument();
  });
});
