'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { HabitList } from '@/components/habits/HabitList';
import { logout, getSession } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const s = getSession();
    if (s) setEmail(s.email);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-6"
      >
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Habits</h1>
            {email && <p className="text-xs text-slate-500">{email}</p>}
          </div>
          <button
            type="button"
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 hover:bg-slate-100"
          >
            Log out
          </button>
        </header>
        <HabitList />
      </main>
    </ProtectedRoute>
  );
}
