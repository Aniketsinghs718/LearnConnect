"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  School, 
  Calendar, 
  NotebookText, 
  RotateCcw,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AcademicSelectorProps {
  onContinue: (branch: string, year: string, semester: string) => void;
  hasPreviousSelection: boolean;
  onReturnToPrevious: () => void;
}

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

const AcademicSelector: React.FC<AcademicSelectorProps> = ({
  onContinue,
  hasPreviousSelection,
  onReturnToPrevious
}) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const handleContinue = () => {
    if (selectedBranch && selectedYear && selectedSemester) {
      onContinue(selectedBranch, selectedYear, selectedSemester);
    }
  };

  const isFormValid = selectedBranch && selectedYear && selectedSemester;

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
            <span className="text-purple-400 text-lg font-semibold tracking-wide uppercase">
              Get Started
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Academic Path
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select your branch, year, and semester to access personalized study materials 
            tailored specifically for your academic journey.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-12">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Academic Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Branch Selection */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <School className="w-5 h-5 text-purple-400" />
                Branch
              </label>
              <div className="relative group">
                <select
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="" disabled className="bg-slate-800 text-gray-300">
                    Choose your branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value} className="bg-slate-800 text-white">
                      {branch.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" />
              </div>
            </motion.div>

            {/* Year Selection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                Year
              </label>
              <div className="relative group">
                <select
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="" disabled className="bg-slate-800 text-gray-300">
                    Choose your year
                  </option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value} className="bg-slate-800 text-white">
                      {year.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" />
              </div>
            </motion.div>

            {/* Semester Selection */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <NotebookText className="w-5 h-5 text-purple-400" />
                Semester
              </label>
              <div className="relative group">
                <select
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="" disabled className="bg-slate-800 text-gray-300">
                    Choose your semester
                  </option>
                  {semesters.map((semester) => (
                    <option key={semester.value} value={semester.value} className="bg-slate-800 text-white">
                      {semester.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" />
              </div>
            </motion.div>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-6"
          >
            <motion.button
              onClick={handleContinue}
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isFormValid
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/25'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Continue to Your Modules
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isFormValid ? 'group-hover:translate-x-1' : ''}`} />
            </motion.button>

            {/* Previous Selection Button */}
            <AnimatePresence>
              {hasPreviousSelection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={onReturnToPrevious}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/40 px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Return to Previous Selection
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            Don&apos;t worry, you can always change these settings later from your profile.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademicSelector;
