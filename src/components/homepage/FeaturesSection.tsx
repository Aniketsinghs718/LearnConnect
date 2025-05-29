"use client";
import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, Download, Search, Bookmark } from 'lucide-react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// 3D Floating Objects Component
function FloatingBook() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
    </Float>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#4F46E5"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
        wireframe
      />
    </Sphere>
  );
}

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Features animation
      gsap.from(featuresRef.current?.children || [], {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Canvas parallax effect
      gsap.to(canvasRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Study Notes",
      description: "Access organized notes for your subjects and topics, structured by year and semester.",
      gradient: "from-blue-500 to-purple-500",
      delay: 0.1
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Previous Year Questions",
      description: "Practice with extensive collection of previous year question papers to ace your exams with confidence.",
      gradient: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Interactive Videos",
      description: "Learn complex concepts through engaging video tutorials and interactive demonstrations.",
      gradient: "from-pink-500 to-red-500",
      delay: 0.3
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Offline Access",
      description: "Download content for offline study. Never let connectivity issues interrupt your learning flow.",
      gradient: "from-red-500 to-orange-500",
      delay: 0.4
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search",
      description: "Find exactly what you need with our AI-powered search engine that understands academic context.",
      gradient: "from-orange-500 to-yellow-500",
      delay: 0.5
    },
    {
      icon: <Bookmark className="w-8 h-8" />,
      title: "Personalized Library",
      description: "Create your personal study library with bookmarks, notes, and progress tracking across all subjects.",
      gradient: "from-yellow-500 to-green-500",
      delay: 0.6
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-black via-slate-900 to-slate-800 overflow-hidden">
      {/* 3D Background */}
      <div ref={canvasRef} className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingBook />
            <group position={[4, 0, 0]}>
              <AnimatedSphere />
            </group>
            <group position={[-4, 2, 0]}>
              <FloatingBook />
            </group>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Background Gradient Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            Powerful
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {" "}Features{" "}
            </span>
            for Modern Learning
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the tools and features that make LearnConnect the ultimate academic companion 
            for students across all engineering disciplines.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-30`}></div>
                </div>

                {/* Floating particles on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${20 + i * 10}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-10 border border-blue-400/30">
            <h4 className="text-3xl font-bold text-white mb-6">
              Experience the Future of Academic Learning
            </h4>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Join the revolution in education technology. Our platform combines cutting-edge features 
              with intuitive design to create the ultimate learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
              >
                Explore Features
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
