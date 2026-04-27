'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { login } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = login(email, password);
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
        <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          data-testid="auth-login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base shadow-sm transition-colors placeholder:text-slate-400 focus:border-slate-900"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          data-testid="auth-login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base shadow-sm transition-colors placeholder:text-slate-400 focus:border-slate-900"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        data-testid="auth-login-submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-slate-800 active:bg-slate-950"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Log in
      </button>
    </form>
  );
}
