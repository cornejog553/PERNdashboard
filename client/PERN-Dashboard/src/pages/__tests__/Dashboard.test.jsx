import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

globalThis.fetch = vi.fn();

const mockLocalStorage = {
  getItem: vi.fn(() => JSON.stringify({ full_name: 'John Doe' })),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays correct stats from API data', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, full_name: 'Customer 1' },
          { id: 2, full_name: 'Customer 2' },
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, full_name: 'Cleaner 1', is_active: true },
          { id: 2, full_name: 'Cleaner 2', is_active: false },
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, status: 'pending' },
          { id: 2, status: 'confirmed' },
          { id: 3, status: 'completed' },
        ]
      });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for data to load and stats to render
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Customers
      expect(screen.getByText('1/2')).toBeInTheDocument(); // Active Cleaners
      expect(screen.getByText('3')).toBeInTheDocument(); // Total Bookings
    });
  });

  it('shows loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });
});