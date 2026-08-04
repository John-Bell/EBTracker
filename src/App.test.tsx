import { render, screen, act } from '@testing-library/react';
import App from './App.tsx';
import { describe, it, expect, beforeEach } from 'vitest';

describe('App Routing', () => {
  beforeEach(() => {
    // Reset hash before each test
    window.location.hash = '';
  });

  it('renders Dashboard as the default page', () => {
    render(<App />);
    // Check for dashboard content
    expect(screen.getAllByText(/EBTracker/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Oatmeal with Berries/i)).toBeInTheDocument();
  });

  it('switches to Settings page when hash changes to #/settings', () => {
    render(<App />);

    // Default should be Dashboard
    expect(screen.queryByText(/Daily Goals/i)).not.toBeInTheDocument();

    // Change hash to #/settings
    act(() => {
      window.location.hash = '#/settings';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Should render settings page
    expect(screen.getByText(/Daily Goals/i)).toBeInTheDocument();
  });

  it('switches back to Dashboard when hash changes from #/settings to #/', () => {
    render(<App />);

    // Go to Settings
    act(() => {
      window.location.hash = '#/settings';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByText(/Daily Goals/i)).toBeInTheDocument();

    // Go back to Dashboard
    act(() => {
      window.location.hash = '#/';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByText(/Oatmeal with Berries/i)).toBeInTheDocument();
  });
});
