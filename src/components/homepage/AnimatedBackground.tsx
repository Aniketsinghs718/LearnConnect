"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'section' | 'footer';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'section' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = containerRef.current.querySelectorAll('.particle');
    
    // Animate particles
    gsap.set(particles, {
      x: () => gsap.utils.random(-100, window.innerWidth + 100),
      y: () => gsap.utils.random(-100, window.innerHeight + 100),
      scale: () => gsap.utils.random(0.1, 1),
      opacity: () => gsap.utils.random(0.1, 0.8)
    });

    gsap.to(particles, {
      x: () => `+=${gsap.utils.random(-200, 200)}`,
      y: () => `+=${gsap.utils.random(-200, 200)}`,
      rotation: () => gsap.utils.random(-360, 360),
      duration: () => gsap.utils.random(10, 20),
      repeat: -1,
      yoyo: true,
      ease: "none",
      stagger: {
        amount: 5,
        from: "random"
      }
    });

  }, []);

  const getGradientClass = () => {
    switch (variant) {
      case 'hero':
        return 'from-slate-900 via-purple-900/20 to-slate-800';
      case 'footer':
        return 'from-black via-slate-900 to-slate-800';
      default:
        return 'from-slate-800 via-purple-900/10 to-slate-900';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} overflow-hidden`}
    >
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Floating Particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 bg-white/20 rounded-full"
        />
      ))}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
    </div>
  );
};

export default AnimatedBackground;
