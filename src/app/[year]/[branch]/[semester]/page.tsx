"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ModuleCard from "@/components/ModuleCard";
import TopicList from "@/components/TopicList";
import CourseNavbar from "@/components/homepage/CourseNavbar";
import { loadSubjectData, loadImportantLinksDataForSubject } from "@/services/fallbackData";
import useProgress from "@/hook/useProgress";
import { RotateCcw, X, BookOpen, ExternalLink } from "lucide-react";

interface Topic {
  title: string;
  description: string;
  videos?: {
    title: string;
    url?: string;
  }[];
  notes?: {
    title: string;
    url: string;
  }[];
}

interface NotesLink {
  title: string;
  url: string;
}

interface Module {
  [key: number]: {
    notesLink: NotesLink[];
    topics: Topic[];
  };
}

interface Subject {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  modules: Module;
}

interface Subjects {
  [subjectKey: string]: Subject;
}

interface SemesterData {
  [key: string]: Subjects;
}

interface BranchData {
  [key: string]: SemesterData;
}

interface NotesDataType {
  [year: string]: BranchData;
}

interface PyqLink {
  title: string;
  url: string;
}

interface ImportantLink {
  title: string;
  url: string;
}

interface PyqLinks {
  [year: string]: PyqLink[];
}

const EngineeringCurriculum: React.FC = () => {
  const {
    year: slug,
    branch,
    semester: sem,
  } = useParams<{ year: string; branch: string; semester: string }>();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [subjects, setSubjects] = useState<any>(null);
  const [importantLinks, setImportantLinks] = useState<any[]>([]);
  const [loadingImportantLinks, setLoadingImportantLinks] = useState(false);

  // Load data asynchronously
  useEffect(() => {
    const loadData = async () => {
      if (!slug || !branch || !sem) return;
      
      try {
        setLoading(true);
        
        // Load subjects and Important Links data
        const [subjectsData] = await Promise.all([
          loadSubjectData(slug, branch, sem)
        ]);
        
        setSubjects(subjectsData);
        // Important links will be loaded when a subject is selected
      } catch (error) {
        console.error('Error loading data:', error);
        setSubjects({});
        setImportantLinks([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    loadData();
  }, [slug, branch, sem]);

  const isMountedRef = useRef(isMounted);
  useEffect(() => {
    setIsMounted(true);
    console.log(isMountedRef.current); // Access via ref instead
  }, []);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<number>(1);

  // Update selected subject when subjects data loads
  useEffect(() => {
    if (subjects && Object.keys(subjects).length > 0 && !selectedSubject) {
      const firstSubject = Object.keys(subjects)[0];
      setSelectedSubject(firstSubject);
    }
  }, [subjects, selectedSubject]);

  // Load important links when selected subject changes
  useEffect(() => {
    const loadSubjectImportantLinks = async () => {
      if (slug && branch && sem && selectedSubject) {
        setLoadingImportantLinks(true);
        try {
          const subjectImportantLinks = await loadImportantLinksDataForSubject(
            slug, 
            branch, 
            sem, 
            selectedSubject
          );
          setImportantLinks(subjectImportantLinks);
        } catch (error) {
          console.error('Error loading subject-specific important links:', error);
          setImportantLinks([]);
        } finally {
          setLoadingImportantLinks(false);
        }
      }
    };

    loadSubjectImportantLinks();
  }, [slug, branch, sem, selectedSubject]);

  useEffect(() => {
    if (subjects && selectedSubject && subjects[selectedSubject]?.modules) {
      const firstModuleKey = Object.keys(
        subjects[selectedSubject].modules
      )[0];
      setSelectedModule(firstModuleKey ? parseInt(firstModuleKey) : 1);
    }
  }, [selectedSubject, subjects]);

  const { progressData, updateVideoProgress, resetProgress } = useProgress(selectedSubject);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-gray-300 font-medium">Loading your curriculum...</p>
        </div>
      </div>
    );
  }

  if (!subjects || Object.keys(subjects).length === 0 ) {
    return (
      <div className="min-h-screen bg-black">
        <CourseNavbar courseInfo={{ year: slug, branch, semester: sem }} />
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-6 pt-20">
          <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-2xl p-8 text-center border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
              No Subjects Found
            </h2>
            <p className="text-gray-300">
              It seems there are no subjects available for the selected
              curriculum. Will be added soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  const numberVideoInModule = (k: number) =>
    subjects && selectedSubject && subjects[selectedSubject]?.modules?.[k]?.topics
      ? subjects[selectedSubject].modules[k].topics.reduce((acc: number, topic: any) => {
          return acc + (topic.videos?.length || 0);
        }, 0)
      : 0;
  
  const handleResetProgress = () => {
    setShowResetConfirmation(true);
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirmation(false);
  };  return (
    <div className="min-h-screen bg-black">
      {/* Course Navbar */}
      <CourseNavbar courseInfo={{ year: slug, branch, semester: sem }} />
      
      {/* Hero Section - Simplified */}
      <div className="bg-gray-900 border-b border-orange-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {branch.toUpperCase()} Engineering
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30">
                  {slug.toUpperCase()}
                </span>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30">
                  {sem.charAt(0).toUpperCase() + sem.slice(1)} Semester
                </span>
              </div>
            </div>
            <div className="text-orange-300 text-sm font-medium">
              {subjects ? Object.keys(subjects).length : 0} Subjects Available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subject Selection Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-orange-400" />
              Choose Your Subject
            </h2>
            <p className="text-gray-400 text-lg">
              Select from {Object.keys(subjects).length} available subjects to begin studying
            </p>
          </div>

          {/* Subject Cards Grid - Improved for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(subjects).map(([key, subject]: [string, any]) => {
              const Icon = subject.icon;
              const moduleCount = Object.keys(subject.modules).length;
              const isSelected = selectedSubject === key;
              
              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedSubject(key);
                    setImportantLinks([]);
                    const firstModuleKey = Object.keys(subjects[key]?.modules || {})[0];
                    setSelectedModule(firstModuleKey ? parseInt(firstModuleKey) : 1);
                  }}
                  className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-2
                    ${
                      isSelected
                        ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20"
                        : "bg-gray-900/80 border-gray-700 hover:border-orange-500/50 hover:bg-gray-900"
                    }
                  `}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className={`p-4 rounded-xl transition-all duration-300 ${
                      isSelected ? "bg-orange-500/20" : "bg-gray-800 group-hover:bg-gray-700"
                    }`}>
                      <Icon className={`w-8 h-8 transition-colors duration-300 ${
                        isSelected ? "text-orange-400" : "text-gray-400 group-hover:text-orange-400"
                      }`} />
                    </div>
                    
                    {/* Subject Info */}
                    <div>
                      <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-gray-200 group-hover:text-white"
                      }`}>
                        {subject.name}
                      </h3>
                      <p className={`text-sm ${
                        isSelected ? "text-orange-300" : "text-gray-500 group-hover:text-gray-400"
                      }`}>
                        {moduleCount} modules available
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar - Quick Access and Modules */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Access Section - Now comes first */}
            {selectedSubject && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                <div className="bg-orange-500 p-4 lg:p-5 border-b border-orange-400/20">
                  <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                    <ExternalLink className="w-5 h-5" />
                    Quick Access
                  </h3>
                  <p className="text-orange-100 text-sm mt-1">
                    Important resources and links
                  </p>
                </div>
                <div className="p-4 lg:p-5">
                  {loadingImportantLinks ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 justify-center py-4">
                      <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading resources...
                    </div>
                  ) : importantLinks.length > 0 ? (
                    <div className="space-y-3">
                      {importantLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-3 text-sm font-medium bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-all duration-200 border border-orange-500/20 hover:border-orange-400/40 hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between">
                            <span>{link.title}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">No quick links available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modules Section */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-orange-500 p-4 lg:p-5 border-b border-orange-400/20">
                <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" />
                  Lecture Videos
                </h3>
                {selectedSubject && subjects[selectedSubject] && (
                  <p className="text-orange-100 text-sm mt-1">
                    {subjects[selectedSubject].name} - Video Lectures
                  </p>
                )}
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {subjects && selectedSubject && subjects[selectedSubject]?.modules ? Object.keys(subjects[selectedSubject].modules).map(
                  (moduleKey) => {
                    const moduley = parseInt(moduleKey);
                    const currentSubject = subjects[selectedSubject];
                    return (
                      <ModuleCard
                        key={moduley}
                        module={moduley}
                        topics={currentSubject?.modules?.[moduley]?.topics?.length || 0}
                        isActive={selectedModule === moduley}
                        onClick={() => setSelectedModule(moduley)}
                        numberOfVideosCompleted={progressData.moduleProgress[moduley] || 0}
                        numberOfVideos={numberVideoInModule(moduley)}
                      />
                    );
                  }
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 text-sm">Loading modules...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Reset */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 lg:p-5">
              <button
                onClick={handleResetProgress}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border border-red-500/30 hover:scale-[1.02]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Progress
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              {/* Content Header */}
              <div className="bg-orange-500 p-6 border-b border-orange-400/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {subjects && selectedSubject && subjects[selectedSubject] ? subjects[selectedSubject].name : "Subject"} - Module {selectedModule || 1}
                    </h2>
                    <p className="text-orange-100 text-sm md:text-base">
                      Comprehensive study materials and video tutorials
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">
                        {numberVideoInModule(selectedModule)} Videos
                      </p>
                      <p className="text-orange-200 text-xs">
                        {progressData.moduleProgress[selectedModule] || 0} Completed
                      </p>
                    </div>
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="text-white font-bold text-lg md:text-xl">
                        {selectedModule}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Notice */}
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 m-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-gray-900">!</span>
                  </div>
                  <div>
                    <p className="text-amber-400 font-medium text-sm md:text-base mb-1">
                      Important Study Guide
                    </p>
                    <p className="text-amber-300/80 text-xs md:text-sm">
                      These videos serve as explanations for college notes. Please refer to your course notes for comprehensive study.
                    </p>
                  </div>
                </div>
              </div>

              {/* Topics Content */}
              <div className="p-6">
                {subjects && selectedSubject && subjects[selectedSubject]?.modules?.[selectedModule]?.topics ? (
                  <TopicList
                    topics={subjects[selectedSubject].modules[selectedModule].topics}
                    moduleNumber={selectedModule || 1}
                    updateVideoProgress={updateVideoProgress}
                    moduleKey={`${selectedModule}`}
                    subjectName={selectedSubject}
                    year={slug}
                    branch={branch}
                    semester={sem}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      Loading Module Content
                    </h3>
                    <p className="text-gray-500">
                      Please wait while we load the topics for this module...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Reset Progress
              </h3>
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-gray-300 text-center">
                Are you sure you want to reset your progress for this subject?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:scale-[1.02]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineeringCurriculum;
