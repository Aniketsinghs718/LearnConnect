import React from "react";
// import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface ModuleCardProps {
  module: number;
  topics: number;
  isActive: boolean;
  onClick: () => void;
  numberOfVideos: number;
  numberOfVideosCompleted: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  topics,
  isActive,
  onClick,
  numberOfVideos,
  numberOfVideosCompleted
}) => {
  // const total = 100;
  // const [done, setdone] = useState(20);

  // console.log("Module Progress for this is "+(progressData.moduleProgress[module] || 0))
  // console.log(topics)
  // console.log("Number of videos in this module is: "+numberOfVideos)

  // setdone(40);

  // console.log(progressData.moduleProgress[module])


  // const [progressDataa, setProgressData2] = useState({});

  // const { progressData: progressData2 } = useProgress(subjectName);
//   console.log( progressData2);
//   console.log(progressData.moduleProgress[module] || 0);

  //   console.log(subjectName)
  // setProgressData2(progressData2);
  // console.log("Progress Data is: " + progressDataa);



  // console.log(progressData2);

  
  return (
    <>
      <div
        onClick={onClick}
        className={`
        group
        p-5
        rounded-2xl 
        border-2
        transition-all
        duration-300
        cursor-pointer 
        shadow-lg
        hover:shadow-2xl
        transform hover:scale-[1.02]
        ${
          isActive
            ? "border-purple-500 bg-gradient-to-br from-purple-900/40 to-pink-900/40 shadow-purple-500/20 ring-1 ring-purple-400/30"
            : "border-gray-600 bg-gray-800/90 hover:border-gray-500 hover:bg-gray-700/90 hover:shadow-purple-500/10"
        }
      `}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
              }`}>
                {module}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Module {module}
                </h3>
                <span className={`text-sm px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white/20 text-purple-100"
                    : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                }`}>
                  {topics} topics
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-6 h-6 transition-all duration-300 ${
                isActive 
                  ? "rotate-180 text-purple-300" 
                  : "text-gray-400 group-hover:text-gray-300"
              }`}
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-medium">Progress</span>
              <span className={`font-bold ${
                isActive ? "text-purple-300" : "text-gray-300"
              }`}>
                {numberOfVideosCompleted || 0}/{numberOfVideos} videos
              </span>
            </div>
            <ProgressBar
              total={numberOfVideos}
              completed={numberOfVideosCompleted || 0}
            />
            
            {/* Completion percentage */}
            <div className="text-right">
              <span className={`text-sm font-medium ${
                isActive ? "text-purple-200" : "text-gray-400"
              }`}>
                {numberOfVideos > 0 
                  ? Math.round(((numberOfVideosCompleted || 0) / numberOfVideos) * 100)
                  : 0
                }% complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleCard;
