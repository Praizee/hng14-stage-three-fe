import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { STORAGE_KEYS } from '@/lib/constants';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: replace, refresh: vi.fn() }),
}));

beforeEach(() => {
  replace.mockClear();
  window.localStorage.clear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'a@b.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'pw12345');
    await userEvent.click(screen.getByTestId('auth-signup-submit'));

    const session = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.session) || 'null',
    );
    expect(session).toMatchObject({ email: 'a@b.com' });
    expect(replace).toHaveBeenCalledWith('/dashboard');

    const users = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.users) || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('a@b.com');
  });

  it('shows an error for duplicate signup email', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify([
        { id: 'u1', email: 'a@b.com', password: 'pw12345', createdAt: 'x' },
      ]),
    );
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'a@b.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'pw12345');
    await userEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByRole('alert')).toHaveTextContent('User already exists');
    expect(replace).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify([
        { id: 'u1', email: 'a@b.com', password: 'pw12345', createdAt: 'x' },
      ]),
    );
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'a@b.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'pw12345');
    await userEvent.click(screen.getByTestId('auth-login-submit'));

    const session = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.session) || 'null',
    );
    expect(session).toEqual({ userId: 'u1', email: 'a@b.com' });
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify([
        { id: 'u1', email: 'a@b.com', password: 'pw12345', createdAt: 'x' },
      ]),
    );
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'a@b.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'wrong');
    await userEvent.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    );
    expect(window.localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });
});
