'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-3xl font-bold text-center border-b border-gray-700">Y</div>
          <nav className="flex flex-col gap-2 p-4">
            <Link href="/profile" className="px-4 py-2 rounded hover:bg-gray-700 transition">
              🏠 Home
            </Link>
            <Link href="/chats" className="px-4 py-2 rounded hover:bg-gray-700 transition">
              💬 Chat
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
