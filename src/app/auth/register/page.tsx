"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Building2, GraduationCap, Calendar, BookOpen } from "lucide-react";

const colleges = [
  "IIT Bombay",
  "Veermata Jijabai Technological Institute (VJTI)",
  "Sardar Patel Institute of Technology (SPIT)",
  "Thadomal Shahani Engineering College (TSEC)",
  "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
  "K. J. Somaiya College of Engineering (KJSCE)",
  "Fr. Conceicao Rodrigues College of Engineering (CRCE)",
  "SIES Graduate School of Technology",
  "Ramrao Adik Institute of Technology (RAIT)",
  "Datta Meghe College of Engineering",
  "Pillai College of Engineering",
  "Terna Engineering College",
  "Lokmanya Tilak College of Engineering",
  "Shah & Anchor Kutchhi Engineering College",
  "Vishwatmak Om Gurudev College of Engineering",
];

const branches = [
  { value: "comps", label: "Computer Science" },
  { value: "mech", label: "Mechanical Engineering" },
  { value: "excp", label: "Electronics & Computer Engineering" },
  { value: "it", label: "Information Technology" },
  { value: "extc", label: "Electronics & Telecommunication Engineering" },
  { value: "rai", label: "Robotics & Automation Engineering" },
  { value: "cce", label: "Computer and Communication Engineering" },
  { value: "csbs", label: "Computer Science and Business Systems" },
  { value: "aids", label: "Artificial Intelligence and Data Science" },
];

const years = [
  { value: "fy", label: "First Year" },
  { value: "sy", label: "Second Year" },
  { value: "ty", label: "Third Year" },
  { value: "ly", label: "Fourth Year" },
];

const semesters = [
  { value: "odd", label: "Odd Semester" },
  { value: "even", label: "Even Semester" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    year: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Insert extra user info into users table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        name: form.name,
        email: form.email,
        college: form.college,
        branch: form.branch,
        year: form.year,
        semester: form.semester,
      },
    ]);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
    setSuccess("Registration successful! Please check your email to verify your account.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="relative w-full max-w-xl p-8">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-white/80">Join LearnConnect to access your academic resources</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-lg rounded-lg border border-red-500/50">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/20 backdrop-blur-lg rounded-lg border border-green-500/50">
              <p className="text-white text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                name="college"
                value={form.college}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-400">Choose your college</option>
                {colleges.map((college) => (
                  <option key={college} value={college} className="text-gray-900">{college}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-400">Choose your branch</option>
                {branches.map((branch) => (
                  <option key={branch.value} value={branch.value} className="text-gray-900">{branch.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-400">Choose your year</option>
                {years.map((year) => (
                  <option key={year.value} value={year.value} className="text-gray-900">{year.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-400">Choose your semester</option>
                {semesters.map((semester) => (
                  <option key={semester.value} value={semester.value} className="text-gray-900">{semester.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-3 font-medium transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-lg"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 