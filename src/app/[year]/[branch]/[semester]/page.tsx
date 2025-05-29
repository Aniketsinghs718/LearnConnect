"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ModuleCard from "@/components/ModuleCard";
import TopicList from "@/components/TopicList";
import { loadSubjectData, loadImportantLinksDataForSubject } from "@/services/fallbackData";
import useProgress from "@/hook/useProgress";
import { RotateCcw, X } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-300 font-medium">Loading your curriculum...</p>
        </div>
      </div>
    );
  }

  if (!subjects || Object.keys(subjects).length === 0 ) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-6">
          <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 text-center border border-gray-700">
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Simple Header Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {branch.toUpperCase()} Engineering
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                  {slug.toUpperCase()}
                </span>
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
                  {sem.charAt(0).toUpperCase() + sem.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {subjects ? Object.keys(subjects).length : 0} subjects available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Subject Selection Section */}
        <div className="mb-10 md:mb-12">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <div className="w-1 h-8 md:h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              Select Your Subject
              <div className="w-1 h-8 md:h-10 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full"></div>
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Choose from {Object.keys(subjects).length} available subjects to start your learning journey
            </p>
          </div>
          
          {/* Centered grid container */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl w-full">
              {Object.entries(subjects).map(([key, subject]: [string, any]) => {
                const Icon = subject.icon;
                const moduleCount = Object.keys(subject.modules).length;
                const isSelected = selectedSubject === key;                
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedSubject(key)
                      setImportantLinks([])
                      const firstModuleKey = Object.keys(
                        subjects[key]?.modules || {}
                      )[0]
                      setSelectedModule(
                        firstModuleKey ? parseInt(firstModuleKey) : 1
                      )
                    }}
                    className={`group relative p-4 md:p-6 rounded-2xl cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:scale-105
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-blue-500/25 ring-2 ring-blue-400/50 scale-105"
                            : "bg-gray-800/90 backdrop-blur-sm text-gray-200 border border-gray-700 hover:border-gray-600 hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/10"
                        }
                      `}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl animate-pulse"></div>
                      </>
                    )}
                    
                    <div className="relative flex flex-col items-center text-center space-y-3 md:space-y-4">
                      {/* Icon Container */}
                      <div className={`relative p-3 md:p-4 rounded-2xl transition-all duration-500 ${
                        isSelected 
                          ? "bg-white/20 shadow-lg" 
                          : "bg-gray-700/80 group-hover:bg-gray-600/80"
                      }`}>
                        <Icon className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${
                          isSelected ? "text-white" : "text-blue-400 group-hover:text-blue-300"
                        }`} />
                        
                        {/* Animated ring for selected state */}
                        {isSelected && (
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/40 animate-ping"></div>
                        )}
                      </div>
                      
                      {/* Subject Info */}
                      <div className="space-y-2">
                        <h3 className={`font-bold text-sm md:text-base lg:text-lg transition-colors duration-300 ${
                          isSelected ? "text-white" : "text-gray-100 group-hover:text-white"
                        }`}>
                          {subject.name}
                        </h3>
                        
                        <div className="flex items-center justify-center gap-4 text-xs md:text-sm">
                          <span className={`flex items-center gap-1 ${
                            isSelected ? "text-blue-100" : "text-gray-500 group-hover:text-gray-400"
                          }`}>
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                            {moduleCount} modules
                          </span>
                        </div>
                        
                        {/* Progress indicator */}
                        {isSelected && (
                          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 w-0 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-500"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar - Modules with integrated Quick Access */}
          <div className="lg:col-span-1 space-y-6">
            {/* Modules Section with Quick Access */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 lg:p-5">
                <h3 className="text-white font-bold flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Course Modules
                </h3>
                {selectedSubject && subjects[selectedSubject] && (
                  <p className="text-purple-100 text-sm mt-1">
                    {subjects[selectedSubject].name}
                  </p>
                )}
              </div>
              <div className="p-4 lg:p-5 space-y-4">
                {subjects && selectedSubject && subjects[selectedSubject]?.modules ? Object.keys(subjects[selectedSubject].modules).map(
                  (moduleKey) => {
                    const moduley = parseInt(moduleKey);
                    const currentSubject = subjects[selectedSubject];
                    return (
                      <ModuleCard
                        key={moduley}
                        module={moduley}
                        topics={
                          currentSubject?.modules?.[moduley]?.topics?.length || 0
                        }
                        isActive={selectedModule === moduley}
                        onClick={() => setSelectedModule(moduley)}
                        numberOfVideosCompleted={
                          progressData.moduleProgress[moduley] || 0
                        }
                        numberOfVideos={numberVideoInModule(moduley)}
                      />
                    );
                  }
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 text-sm">Loading modules...</p>
                  </div>
                )}

                {/* Quick Access Links integrated within modules */}
                {selectedSubject && (
                  <div className="pt-4 border-t border-gray-600/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <h4 className="text-green-400 font-semibold text-sm">Quick Access</h4>
                    </div>
                    <div className="space-y-2">
                      {loadingImportantLinks ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400 justify-center py-3">
                          <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                          Loading resources...
                        </div>
                      ) : importantLinks.length > 0 ? (
                        importantLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-3 py-2 text-xs font-medium bg-gradient-to-r from-green-600/15 to-emerald-600/15 text-green-400 rounded-lg hover:from-green-600/25 hover:to-emerald-600/25 transition-all duration-200 border border-green-500/20 hover:border-green-400/40"
                          >
                            {link.title}
                          </a>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-2">
                          No quick links available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Reset */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 lg:p-5">
              <button
                onClick={handleResetProgress}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border border-red-500/30"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Progress
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {subjects && selectedSubject && subjects[selectedSubject] ? subjects[selectedSubject].name : "Subject"} - Module {selectedModule || 1}
                    </h2>
                    <p className="text-blue-100 text-sm md:text-base">
                      Comprehensive study materials and video tutorials
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">
                        {numberVideoInModule(selectedModule)} Videos
                      </p>
                      <p className="text-blue-200 text-xs">
                        {progressData.moduleProgress[selectedModule] || 0} Completed
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="text-white font-bold text-lg">
                        {selectedModule}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Notice */}
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 m-6 rounded-r-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-900">!</span>
                  </div>
                  <p className="text-amber-400 font-medium text-sm md:text-base">
                    These videos serve as explanations for college notes. Please refer to your course notes for comprehensive study.
                  </p>
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                Reset Progress
              </h3>
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset your progress for this subject?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
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
