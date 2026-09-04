import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from './AboutPage';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: vi.fn() };
});

import { useReducedMotion } from 'framer-motion';

function renderAboutPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it('renders the bio headline and every timeline year', () => {
    renderAboutPage();
    expect(screen.getByRole('heading', { name: 'Цвет громче слов' })).toBeInTheDocument();
    for (const year of ['2016', '2018', '2020', '2022', '2024', '2026']) {
      expect(screen.getAllByText(year).length).toBeGreaterThan(0);
    }
  });

  it('hides decorative layers (offset plates, glows, the divider rule) from assistive tech', () => {
    const { container } = renderAboutPage();
    const hiddenLayers = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenLayers.length).toBeGreaterThan(0);
  });

  it('stacks every story card plus the closing panel as sticky full-height sections, in one continuous scroll sequence', () => {
    const { container } = renderAboutPage();
    expect(container.querySelectorAll('.sticky').length).toBe(7);
  });

  it('ends the story stack with a distinct closing panel, not a dead stop', () => {
    renderAboutPage();
    expect(screen.getByRole('heading', { name: 'Хотите работу под своё пространство?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Смотреть работы' })).toHaveAttribute('href', '/works');
  });

  it('bridges the hero into the story stack with a kicker instead of leaving that gap empty', () => {
    renderAboutPage();
    expect(screen.getByText('История · 2016—2026')).toBeInTheDocument();
  });

  it('keeps every kicker on the light hero off bare text-acid — it measures ~2.1:1 against the canvas background, the same problem already fixed for gold', () => {
    renderAboutPage();
    for (const text of ['Kate · Акрил', 'История · 2016—2026']) {
      expect(screen.getByText(text)).not.toHaveClass('text-acid');
    }
  });

  it('cycles the three brand accents across the story cards instead of repeating one', () => {
    renderAboutPage();
    expect(screen.getByText('2016')).toHaveClass('text-primary');
    expect(screen.getByText('2018')).toHaveClass('text-acid');
    expect(screen.getByText('2020')).toHaveClass('text-love');
    expect(screen.getByText('2022')).toHaveClass('text-primary');
  });

  it('still renders every card correctly under reduced motion, just without the scroll-linked scale/opacity transform', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    renderAboutPage();
    expect(screen.getByText('2016')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Хотите работу под своё пространство?' })).toBeInTheDocument();
  });
});
