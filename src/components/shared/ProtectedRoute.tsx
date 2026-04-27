'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authed' | 'redirecting'>(
    'checking',
  );

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setStatus('redirecting');
      router.replace('/login');
    } else {
      setStatus('authed');
    }
  }, [router]);

  if (status !== 'authed') return null;
  return <>{children}</>;
}
