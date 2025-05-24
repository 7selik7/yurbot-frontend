import AnimatedParticlesBackground from '@/components/ui/AnimatedParticlesBackground';
import ForgotPasswordForm from "@/components/auth/ForgotPassword";

export default function ForgotPasswordPage() {
    return (
        <section className="relative w-full min-h-screen text-white overflow-hidden">
            <AnimatedParticlesBackground />
            <ForgotPasswordForm />
        </section>
    );
}
