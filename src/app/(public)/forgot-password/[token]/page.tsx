'use client';


import AnimatedParticlesBackground from "@/components/ui/AnimatedParticlesBackground";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({params}: { params: { token: string } }) {
    return (
        <section className="relative w-full min-h-screen text-white overflow-hidden">
            <AnimatedParticlesBackground/>
            <ResetPasswordForm token={params.token}/>
        </section>
    );
}