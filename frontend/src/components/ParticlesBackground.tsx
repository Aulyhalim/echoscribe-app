import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 20;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      const size = Math.random() * 5 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="particles-container" />
  );
}
