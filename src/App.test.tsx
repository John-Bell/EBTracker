import { render, screen } from '@testing-library/react';
import App from './App.tsx';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    expect(screen.getAllByText(/Settings/i).length).toBeGreaterThan(0);
  });
});
