import AnimatedParticlesBackground from '@/components/ui/AnimatedParticlesBackground';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <section className="relative w-full min-h-screen text-white overflow-hidden">
      <AnimatedParticlesBackground />
      <LoginForm />
    </section>
  );
}
