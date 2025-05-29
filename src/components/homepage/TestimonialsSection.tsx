"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Star, Quote, Github, Linkedin, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Testimonial cards animation
//       gsap.from(cardsRef.current?.children || [], {
//         y: 100,
//         opacity: 0,
//         duration: 1,
//         stagger: 0.2,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: cardsRef.current,
//           start: "top 80%",
//           end: "bottom 20%",
//           toggleActions: "play none none reverse"
//         }
//       });

//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const testimonials = [
//     {
//       name: "Priya Sharma",
//       role: "Computer Science Student",
//       branch: "COMPS",
//       year: "Third Year",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//       content: "LearnConnect completely transformed my study routine. Having all the resources in one place saved me countless hours. The quality of notes is exceptional!",
//       rating: 5,
//       social: {
//         github: "https://github.com",
//         linkedin: "https://linkedin.com"
//       }
//     },
//     {
//       name: "Arjun Patel",
//       role: "Mechanical Engineering Student",
//       branch: "MECH",
//       year: "Final Year",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//       content: "The previous year questions section helped me ace my exams. The organized structure makes it so easy to find exactly what I need for my studies.",
//       rating: 5,
//       social: {
//         github: "https://github.com",
//         twitter: "https://twitter.com"
//       }
//     },
//     {
//       name: "Sneha Reddy",
//       role: "AI & Data Science Student",
//       branch: "AIDS",
//       year: "Second Year",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//       content: "As an AIDS student, I love how comprehensive the content is. The video lectures and interactive materials make complex topics much easier to understand.",
//       rating: 5,
//       social: {
//         linkedin: "https://linkedin.com",
//         twitter: "https://twitter.com"
//       }
//     }
//   ];

//   const stats = [
//     { number: "50K+", label: "Happy Students" },
//     { number: "95%", label: "Success Rate" },
//     { number: "10K+", label: "Study Materials" },
//     { number: "24/7", label: "Support" }
//   ];

//   return (
//     <section ref={sectionRef} className="relative py-24 bg-gradient-to-br from-slate-800 via-purple-900/10 to-slate-900 overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-6">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-center mb-20"
//         >
//           <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
//             What Our
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
//               {" "}Students{" "}
//             </span>
//             Say
//           </h2>
//           <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//             Join thousands of successful students who have transformed their academic journey with LearnConnect.
//           </p>
//         </motion.div>

//         {/* Stats */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           viewport={{ once: true }}
//           className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.05 }}
//               className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
//             >
//               <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
//               <div className="text-gray-300">{stat.label}</div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Testimonials */}
//         <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ y: -10, scale: 1.02 }}
//               className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500"
//             >
//               {/* Quote Icon */}
//               <div className="absolute top-6 right-6 text-purple-400/30 group-hover:text-purple-400/50 transition-colors duration-300">
//                 <Quote className="w-8 h-8" />
//               </div>

//               {/* Rating */}
//               <div className="flex items-center mb-4">
//                 {[...Array(testimonial.rating)].map((_, i) => (
//                   <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                 ))}
//               </div>

//               {/* Content */}
//               <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
//                 "{testimonial.content}"
//               </p>

//               {/* User Info */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <img
//                     src={testimonial.avatar}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full mr-4 ring-2 ring-purple-400/20 group-hover:ring-purple-400/40 transition-all duration-300"
//                   />
//                   <div>
//                     <h4 className="text-white font-semibold group-hover:text-purple-200 transition-colors duration-300">
//                       {testimonial.name}
//                     </h4>
//                     <p className="text-gray-400 text-sm">
//                       {testimonial.role} • {testimonial.branch} {testimonial.year}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Social Links */}
//                 <div className="flex space-x-2">
//                   {testimonial.social.github && (
//                     <motion.a
//                       href={testimonial.social.github}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       whileHover={{ scale: 1.2 }}
//                       className="text-gray-400 hover:text-white transition-colors duration-300"
//                     >
//                       <Github className="w-4 h-4" />
//                     </motion.a>
//                   )}
//                   {testimonial.social.linkedin && (
//                     <motion.a
//                       href={testimonial.social.linkedin}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       whileHover={{ scale: 1.2 }}
//                       className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
//                     >
//                       <Linkedin className="w-4 h-4" />
//                     </motion.a>
//                   )}
//                   {testimonial.social.twitter && (
//                     <motion.a
//                       href={testimonial.social.twitter}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       whileHover={{ scale: 1.2 }}
//                       className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
//                     >
//                       <Twitter className="w-4 h-4" />
//                     </motion.a>
//                   )}
//                 </div>
//               </div>

//               {/* Hover effect */}
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Call to Action */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//           viewport={{ once: true }}
//           className="text-center"
//         >
//           <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-10 border border-purple-400/30">
//             <h4 className="text-3xl font-bold text-white mb-6">
//               Ready to Join Our Success Stories?
//             </h4>
//             <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
//               Start your journey today and become part of our thriving community of successful students.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
//             >
//               Get Started Now
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
};

export default TestimonialsSection;
