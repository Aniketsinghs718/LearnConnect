"use client";
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAPAnimations = () => {
  useEffect(() => {
    // Smooth scrolling setup
    const lenis = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    };

    // Global scroll trigger refresh
    ScrollTrigger.refresh();

    // Mobile optimizations
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Reduce animation complexity on mobile
      gsap.globalTimeline.timeScale(0.8);
      
      // Optimize scroll triggers for mobile
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        ignoreMobileResize: true
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: offsetPosition, autoKill: false },
      ease: "power3.inOut"
    });
  }
};

export const createStaggerAnimation = (
  elements: Element[],
  options: {
    from?: string;
    duration?: number;
    stagger?: number;
    delay?: number;
  } = {}
) => {
  const {
    from = "bottom",
    duration = 0.8,
    stagger = 0.1,
    delay = 0
  } = options;

  const fromProps = {
    bottom: { y: 50, opacity: 0 },
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    top: { y: -50, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 }
  };

  return gsap.fromTo(elements, 
    fromProps[from as keyof typeof fromProps] || fromProps.bottom,
    {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: "power3.out"
    }
  );
};
