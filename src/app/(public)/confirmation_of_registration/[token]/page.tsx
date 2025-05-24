'use client';

import AnimatedParticlesBackground from '@/components/ui/AnimatedParticlesBackground';
import ConfirmRegistrationForm from '@/components/auth/ConfirmRegistrationForm';

export default function ConfirmRegistrationPage({ params }: { params: { token: string } }) {
  return (
    <section className="relative w-full min-h-screen text-white overflow-hidden">
      <AnimatedParticlesBackground />
      <ConfirmRegistrationForm token={params.token} />
    </section>
  );
}
