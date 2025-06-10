"use client";
import React, { useState } from 'react';
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

const SimpleAcademicSelector: React.FC<AcademicSelectorProps> = ({
  onContinue,
  hasPreviousSelection,
  onReturnToPrevious
}) => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const isFormValid = selectedBranch && selectedYear && selectedSemester;
  return (
    <section className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-orange-500 mr-3" />
            <span className="text-orange-400 text-lg font-semibold">Almost There!</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select Your Academic Details
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose your branch, year, and semester to get personalized study materials and resources.
          </p>
        </div>

        {/* Previous Selection Option */}
        {hasPreviousSelection && (
          <div className="mb-8 text-center">
            <button
              onClick={onReturnToPrevious}
              className="inline-flex items-center bg-gray-800 text-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors duration-300 border border-gray-700"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Continue with Previous Selection
            </button>
          </div>
        )}

        {/* Selection Form */}
        <div className="bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Branch Selection */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <School className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Branch</h3>
              </div>
              <div className="relative">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value}>{branch.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Year Selection */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Year</h3>
              </div>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Semester Selection */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <NotebookText className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Semester</h3>
              </div>
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl px-4 py-4 text-white focus:border-orange-500 focus:outline-none appearance-none"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((semester) => (
                    <option key={semester.value} value={semester.value}>{semester.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => onContinue(selectedBranch, selectedYear, selectedSemester)}
              disabled={!isFormValid}
              className={`inline-flex items-center px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-2xl transform hover:scale-105'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Learning Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          
          {!isFormValid && (
            <p className="text-center text-gray-500 mt-4">
              Please select all fields to continue
            </p>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Curated Content", desc: "Access handpicked study materials" },
            { icon: GraduationCap, title: "Expert Guidance", desc: "Learn from industry professionals" },
            { icon: Sparkles, title: "Interactive Learning", desc: "Engage with multimedia content" }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
              <item.icon className="w-8 h-8 mx-auto mb-4 text-orange-500" />
              <h4 className="font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimpleAcademicSelector;
