import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock fetch
globalThis.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submits login form successfully', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        user: { id: 1, email: 'test@example.com', full_name: 'Gio Cornejo', role: 'admin' }
      })
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill out form
    await user.type(screen.getByLabelText(/email/i), 'cornejog553@gmail.com');
    await user.type(screen.getByLabelText(/password/i), 'FakePass1!');

    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Check if API was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
    method: "POST",
    body: expect.stringContaining('"email":"cornejog553@gmail.com"'),
  })
      );
    });
  });

  it('shows error message on failed login', async () => {
    const user = userEvent.setup();

    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});