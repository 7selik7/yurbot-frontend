import AnimatedParticlesBackground from '@/components/ui/AnimatedParticlesBackground';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <section className="relative w-full min-h-screen text-white overflow-hidden">
      <AnimatedParticlesBackground />
      <SignupForm />
    </section>
  );
}
