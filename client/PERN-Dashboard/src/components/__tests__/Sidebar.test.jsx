import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Sidebar', () => {
  it('renders navigation links', () => {
    // Mock user data
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ full_name: 'John Doe', email: 'john@example.com' })
    );

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    // Check if navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Cleaners')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays user name on mobile', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({ full_name: 'John Doe', email: 'john@example.com' })
    );

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});