"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomepageNavbar from "@/components/homepage/HomepageNavbar";

export default function MainPage() {
  const router = useRouter();

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
        // If user has previous selections, redirect them directly
        router.push(`/${previousYear}/${previousBranch}/${previousSemester}`);
      }
    }
  }, [router]);

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleViewDemo = () => {
    router.push('/demo');
  };

  try {
    return (
      <div className="min-h-screen bg-black">
        {/* Homepage Navbar */}
        <HomepageNavbar />
        
        {/* Header */}
        <header className="relative overflow-hidden bg-black pt-16">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-500/30">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-400 text-sm font-medium">Your CS Journey Starts Here</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Master Computer Science with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                  LearnConnect
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Your ultimate platform for Computer Science education. Access curated study materials, 
                connect with fellow students, and excel in your academic journey with our comprehensive resources.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Learning →
                </button>
                <button 
                  onClick={handleViewDemo}
                  className="text-white border-2 border-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300">
                  Explore Platform
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Student Success Stories
              </h2>
              <p className="text-gray-400">Meet students who excelled using LearnConnect</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Priya S.", role: "CS Final Year", avatar: "👩‍🎓", achievement: "CGPA: 9.2" },
                { name: "Rahul K.", role: "CS Third Year", avatar: "👨‍💻", achievement: "Google Intern" },
                { name: "Ananya M.", role: "CS Second Year", avatar: "👩‍💻", achievement: "Hackathon Winner" },
                { name: "Arjun T.", role: "CS Final Year", avatar: "👨‍🎓", achievement: "Microsoft SDE" }
              ].map((learner, index) => (
                <div key={index} className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors">
                  <div className="text-4xl mb-3">{learner.avatar}</div>
                  <h3 className="font-semibold text-white">{learner.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{learner.role}</p>
                  <p className="text-xs text-orange-400 font-medium">{learner.achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comprehensive CS Resources
              </h2>
              <p className="text-gray-400">Everything you need for your Computer Science degree</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Data Structures & Algorithms", desc: "Master DSA with implementations in C, C++, Java", color: "bg-orange-500", icon: "🏗️" },
                { title: "Programming Languages", desc: "C, C++, Java, Python - syntax to advanced concepts", color: "bg-blue-500", icon: "💻" },
                { title: "Database Management", desc: "SQL, DBMS concepts, normalization, and design", color: "bg-green-500", icon: "🗄️" },
                { title: "Operating Systems", desc: "Process management, memory, file systems", color: "bg-purple-500", icon: "⚙️" },
                { title: "Computer Networks", desc: "Protocols, security, network architecture", color: "bg-red-500", icon: "🌐" },
                { title: "Software Engineering", desc: "SDLC, testing, project management principles", color: "bg-yellow-500", icon: "🛠️" }
              ].map((resource, index) => (
                <div key={index} className={`${resource.color} rounded-2xl p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                  <div className="text-3xl mb-4">{resource.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <p className="text-white/90">{resource.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Growing Student Community
              </h2>
              <p className="text-gray-400">Join thousands of CS students in their learning journey</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "5,000+", label: "Active Students" },
                { number: "15,000+", label: "Study Materials" },
                { number: "500+", label: "Video Lectures" },
                { number: "50+", label: "CS Subjects" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors">
                  <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose LearnConnect?
              </h2>
              <p className="text-gray-400">Features designed specifically for CS students</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Organized by Semester", 
                  desc: "Content structured by year, branch, and semester for easy navigation and focused learning.",
                  icon: "📚"
                },
                { 
                  title: "Multiple Formats", 
                  desc: "Access content through videos, PDFs, notes, and interactive exercises tailored to your learning style.",
                  icon: "🎯"
                },
                { 
                  title: "Peer Collaboration", 
                  desc: "Connect with classmates, form study groups, and share knowledge within your academic community.",
                  icon: "👥"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-8 bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors border border-gray-800">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Student Success Story
              </h2>
              <p className="text-gray-400">How LearnConnect helped shape academic excellence</p>
            </div>
            
            <div className="bg-orange-500 rounded-3xl p-8 md:p-12 text-white border border-orange-400/20">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto flex items-center justify-center text-6xl">
                    👩‍🎓
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <blockquote className="text-xl md:text-2xl font-medium mb-4">
                    "LearnConnect made my CS journey so much easier! Having all subjects organized by semester with quality notes and videos helped me maintain a 9+ CGPA throughout college."
                  </blockquote>
                  <div className="flex items-center justify-center md:justify-start">
                    <div>
                      <div className="font-semibold">Sneha Sharma</div>
                      <div className="text-white/80">Computer Science Graduate • CGPA: 9.4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Access Your CS Resources
              </h2>
              <p className="text-gray-400">Choose how you want to access our comprehensive CS study materials</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Free Access", 
                  desc: "Basic access to essential study materials",
                  price: "Free",
                  features: ["Core Subject Notes", "Basic Video Lectures", "Community Access", "Limited Downloads"],
                  color: "border-gray-700 hover:border-orange-500"
                },
                { 
                  title: "Student Premium", 
                  desc: "Full access to all academic resources",
                  price: "₹299/semester",
                  features: ["All Subjects & Topics", "HD Video Lectures", "Previous Year Papers", "Unlimited Downloads", "Priority Support"],
                  color: "border-orange-500 bg-orange-500/10 relative"
                },
                { 
                  title: "Lifetime Access", 
                  desc: "One-time payment for complete access",
                  price: "₹1,999",
                  features: ["Lifetime Access", "All Future Updates", "Premium Community", "Career Guidance", "Alumni Network"],
                  color: "border-gray-700 hover:border-orange-500"
                }
              ].map((plan, index) => (
                <div key={index} className={`border-2 ${plan.color} rounded-2xl p-6 transition-all duration-300 bg-gray-900`}>
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                    <p className="text-gray-400 mb-4">{plan.desc}</p>
                    <div className="text-3xl font-bold text-orange-400 mb-6">{plan.price}</div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transition-all duration-300">
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "How do I get started with LearnConnect?", a: "Simply register with your academic details (year, branch, semester) and get instant access to your curriculum-specific study materials." },
                { q: "Which CS subjects are covered?", a: "We cover all major CS subjects including DSA, DBMS, OS, CN, SE, Programming Languages (C, C++, Java, Python), and more based on university syllabi." },
                { q: "Can I access materials offline?", a: "Yes! Premium members can download PDFs, notes, and select video content for offline studying." },
                { q: "How often is content updated?", a: "Our content is regularly updated to match current university syllabi and includes the latest previous year question papers." },
                { q: "Is there support for different universities?", a: "Yes, we support multiple university curricula and continuously add more based on student requests." }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-orange-500 border-t border-orange-400/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Excel in Your CS Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of CS students who are already using LearnConnect to achieve academic excellence.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-orange-600 px-12 py-4 rounded-full font-semibold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Learning Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">LearnConnect</h3>
                <p className="text-gray-400">Your comprehensive platform for Computer Science education. Organized study materials, video lectures, and peer collaboration - all designed to help you excel in your CS journey.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Platform</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Courses</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Resources</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Bug Reports</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Feature Requests</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 LearnConnect. All rights reserved. Made with ❤️ for students.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Homepage render error:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">LearnConnect</h1>
          <p className="text-xl mb-8 text-gray-400">Your Academic Learning Platform</p>
          <button 
            onClick={handleGetStarted}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }
}
