'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  baseColor: string;
  highlightColor: string;
  speed: number;
}

export default function AnimatedParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    function initParticles(canvas: HTMLCanvasElement) {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: 'rgba(0, 191, 255, 0.5)',
          baseColor: 'rgba(0, 191, 255, 0.5)',
          highlightColor: 'rgba(0, 191, 255, 1)',
          speed: 2 + Math.random() * 0.5,
        });
      }
    }

    function drawParticles(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradientBg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradientBg.addColorStop(0, '#050e14');
      gradientBg.addColorStop(1, '#0a192f');
      ctx.fillStyle = gradientBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          particle.color = `rgba(77, 213, 254, ${0.4 + opacity * 0.6})`;
        } else {
          particle.color = particle.baseColor;
        }

        particle.x += Math.sin(i + Date.now() * 0.001) * 0.05 * particle.speed;
        particle.y += Math.cos(i + Date.now() * 0.0015) * 0.05 * particle.speed;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particles.forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(77, 213, 254, ${0.07 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        });
      });
    }

    function animate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
      drawParticles(canvas, ctx);
      animationFrameId = requestAnimationFrame(() => animate(canvas, ctx));
    }

    animate(canvas, ctx);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
