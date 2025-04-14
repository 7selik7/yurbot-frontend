'use client';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  console.log('Public');
  return <>{children}</>;
}
