'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { getUserDataRequest } from '@/lib/auth';
import { setUser } from '@/store/slices/userSlice';
// import { useAppDispatch } from '@/store/hook';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  const getUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    await getUserDataRequest(
      (res) => {
        // dispatch(setUser(res));
        // router.replace('/profile');
      },
      (err) => {
        // const msg = (err as { message: string })?.message || 'Login failed';
        // console.error('Login error:', msg);
      },
    );
  };

  useEffect(() => {
    getUserData();
  }, []);

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
