"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, Shield, Clock, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Problem cards animation
      gsap.from(problemsRef.current?.children || [], {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: problemsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Solutions animation
      gsap.from(solutionsRef.current?.children || [], {
        x: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: solutionsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const problems = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Scattered Resources",
      description: "Study materials are spread across different platforms, making it hard to find what you need quickly.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Disorganized Content",
      description: "Academic resources often lack proper structure and organization for efficient studying.",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Wasted Searching",
      description: "Students spend too much time looking for materials instead of focusing on learning.",
      gradient: "from-yellow-500 to-green-500"
    }
  ];

  const solutions = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Organized Content",
      description: "Study materials organized by subject, year, and semester for easy access."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Resources",
      description: "All content is verified by experts and updated regularly to ensure accuracy."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Learning",
      description: "Connect with peers, share notes, and learn together in a supportive community."
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
              {" "}Problem{" "}
            </span>
            We Solve
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Traditional academic resources are fragmented, outdated, and hard to navigate. 
            We&apos;re changing that with a unified, intelligent learning platform.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div ref={problemsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotateX: 5 }}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {problem.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {problem.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {problem.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solutions Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              {" "}Solution
            </span>
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A comprehensive platform that addresses every aspect of academic learning and resource management.
          </p>
        </motion.div>

        <div ref={solutionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center mr-4">
                  <div className="text-white">
                    {solution.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-white">{solution.title}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{solution.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
            <h4 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Learning Experience?
            </h4>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Join thousands of students who have revolutionized their study habits with LearnConnect.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
