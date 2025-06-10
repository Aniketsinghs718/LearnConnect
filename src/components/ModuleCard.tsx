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
        p-4 md:p-5
        rounded-xl 
        border-2
        transition-all
        duration-300
        cursor-pointer 
        shadow-lg
        hover:shadow-2xl
        transform hover:scale-[1.02]
        ${
          isActive
            ? "border-orange-500 bg-gradient-to-br from-orange-900/30 to-orange-800/30 shadow-orange-500/20 ring-1 ring-orange-400/30"
            : "border-gray-700 bg-gray-800/90 hover:border-orange-500/50 hover:bg-gray-800 hover:shadow-orange-500/10"
        }
      `}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-300 ${
                isActive 
                  ? "bg-orange-500/20 text-orange-400 ring-2 ring-orange-400/30" 
                  : "bg-gray-700 text-gray-300 group-hover:bg-gray-600 group-hover:text-orange-300"
              }`}>
                {module}
              </div>
              <div>
                <h3 className="font-bold text-white text-base md:text-lg">
                  Module {module}
                </h3>
                <span className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300"
                }`}>
                  {topics} topics
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                isActive 
                  ? "rotate-180 text-orange-400" 
                  : "text-gray-500 group-hover:text-orange-400"
              }`}
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-gray-300 font-medium">Progress</span>
              <span className={`font-bold ${
                isActive ? "text-orange-300" : "text-gray-300 group-hover:text-orange-300"
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
              <span className={`text-xs md:text-sm font-medium ${
                isActive ? "text-orange-200" : "text-gray-400 group-hover:text-orange-200"
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
