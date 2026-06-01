'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppNav() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem('token')));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setHasToken(false);
    router.push('/login');
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          PayMe
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/orders" className="rounded border px-3 py-1.5">
            My Orders
          </Link>
          <Link href="/owner/dashboard" className="rounded border px-3 py-1.5">
            Owner
          </Link>
          {hasToken ? (
            <button onClick={logout} className="rounded bg-black px-3 py-1.5 text-white">
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded bg-black px-3 py-1.5 text-white">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
