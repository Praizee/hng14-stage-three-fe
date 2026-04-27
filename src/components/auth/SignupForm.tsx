'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/auth';
import { validatePassword } from '@/lib/validators';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pw = validatePassword(password);
    if (!pw.valid) {
      setError(pw.error);
      return;
    }
    const result = signup(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    router.replace('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          data-testid="auth-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          data-testid="auth-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
          aria-describedby="signup-password-hint"
        />
        <p id="signup-password-hint" className="text-xs text-slate-500">
          At least {PASSWORD_MIN_LENGTH} characters, with at least one letter and one number.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        data-testid="auth-signup-submit"
        className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-base font-medium text-white hover:bg-slate-800"
      >
        Create account
      </button>
    </form>
  );
}
