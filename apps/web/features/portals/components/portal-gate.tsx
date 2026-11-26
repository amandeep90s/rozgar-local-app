'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshSession } from '@/features/auth/session-actions';

export function PortalGate({
  children,
  message,
  expired = false,
}: {
  children?: React.ReactNode;
  message: string;
  expired?: boolean;
}) {
  const router = useRouter();
  const started = useRef(false);
  const [status, setStatus] = useState(message);
  useEffect(() => {
    if (!expired || started.current) return;
    started.current = true;
    const recover = async () => {
      try {
        const result = navigator.locks
          ? await navigator.locks.request('rozgarlocal-session', () => refreshSession())
          : await refreshSession();
        if (result === 'refreshed' || result === 'current') router.refresh();
        else if (result === 'signed-out') router.replace('/login?reason=expired');
        else setStatus('Your session could not be refreshed. Please try again.');
      } catch (error) {
        console.error('Portal session recovery failed', error);
        setStatus('Your session could not be refreshed. Please try again.');
      }
    };
    void recover();
  }, [expired, router]);
  return children ? (
    <>{children}</>
  ) : (
    <main className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center text-center">
      <p className="rounded-2xl border border-auth-border bg-auth-surface px-6 py-5 text-sm text-auth-muted">
        {status}
      </p>
    </main>
  );
}
