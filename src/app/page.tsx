"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/homepage/HeroSection";
import ProblemSection from "@/components/homepage/ProblemSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import AcademicSelector from "@/components/homepage/AcademicSelector";
import FooterSection from "@/components/homepage/FooterSection";
import AnimatedBackground from "@/components/homepage/AnimatedBackground";
import { useGSAPAnimations } from "@/components/homepage/animations";

export default function MainPage() {
  const router = useRouter();
  const [showAcademicSelector, setShowAcademicSelector] = useState(false);
  const [hasPreviousSelection, setHasPreviousSelection] = useState(false);

  // Initialize GSAP animations
  useGSAPAnimations();

  useEffect(() => {
    // Check for user profile in localStorage
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        if (profile.branch && profile.year && profile.semester) {
          // Auto-redirect to the user's academic route
          router.push(`/${profile.year}/${profile.branch}/${profile.semester}`);
          return;
        }
      }

      // Fallback: Check for previous selections in localStorage
      const previousBranch = localStorage.getItem("selectedBranch");
      const previousYear = localStorage.getItem("selectedYear");
      const previousSemester = localStorage.getItem("selectedSemester");

      if (previousBranch && previousYear && previousSemester) {
        setHasPreviousSelection(true);
      }
    }
  }, [router]);

  const handleGetStarted = () => {
    setShowAcademicSelector(true);
    // Smooth scroll to academic selector
    setTimeout(() => {
      const element = document.getElementById('academic-selector');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleContinue = (branch: string, year: string, semester: string) => {
    // Save current selections to localStorage
    localStorage.setItem("selectedBranch", branch);
    localStorage.setItem("selectedYear", year);
    localStorage.setItem("selectedSemester", semester);

    if (
      year === "fy" &&
      !(branch === "comps" || branch === "aids")
    ) {
      if (semester === "odd") router.push(`/fy/comps/even`);
      else router.push(`/fy/comps/odd`);
    } else {
      router.push(`/${year}/${branch}/${semester}`);
    }
  };

  const handleReturnToPrevious = () => {
    const previousBranch = localStorage.getItem("selectedBranch");
    const previousYear = localStorage.getItem("selectedYear");
    const previousSemester = localStorage.getItem("selectedSemester");

    if (previousBranch && previousYear && previousSemester) {
      router.push(`/${previousYear}/${previousBranch}/${previousSemester}`);
    }
  };

  try {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="min-h-screen bg-black overflow-x-hidden relative"
      >
        <AnimatedBackground />
        
        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} />
        
        {/* Problem Section */}
        <ProblemSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Academic Selector */}
        <AnimatePresence>
          {showAcademicSelector && (
            <motion.div
              id="academic-selector"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <AcademicSelector
                onContinue={handleContinue}
                hasPreviousSelection={hasPreviousSelection}
                onReturnToPrevious={handleReturnToPrevious}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <FooterSection />
      </motion.div>
    );
  } catch (error) {
    console.error('Homepage render error:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">LearnConnect</h1>
          <p className="text-xl mb-8">Your Academic Learning Platform</p>
          <button 
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }
}
