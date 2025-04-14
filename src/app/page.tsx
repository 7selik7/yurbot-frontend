import Link from 'next/link';

export default function Home() {
  return (
    <div>
      Welcome to YurBot!
      <Link href="/login" className="px-4 py-2 rounded hover:bg-gray-700 transition">
        Login
      </Link>
      <Link href="/signup" className="px-4 py-2 rounded hover:bg-gray-700 transition">
        Sign Up
      </Link>
    </div>
  );
}
