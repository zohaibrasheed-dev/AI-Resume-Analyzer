import { Link } from "react-router";
import { resumes } from "../../constants";
import ScoreGauge from "./ScoreGauge";

const ResumesArea = () => {
  return (
    <div className="resumes-wrapper lg:mt-16 md:mt-10 mt-6">
      <div className="mx-auto xl:max-w-[1280px] lg:px-5 lg:max-w-[1024px]">
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 xl:gap-8 lg:gap-5 gap-3">

          {
            resumes.map(resume => (
              <Link to="#">
                <div className="resume-card w-full transition duration-300 ease-in-out hover:-translate-y-2">
                  <div className="resume-card-header">
                    <div className="flex flex-col md:gap-2 gap-1">
                      <h2 className="!text-black font-bold break-words">{resume.companyName}</h2>
                      <h3 className="text-base md:text-lg break-words text-gray-500">{resume.jobTitle}</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <ScoreGauge score={resume.feedback.overallScore} />
                    </div>
                  </div>

                  <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                      <img
                        src={resume.imagePath}
                        alt="resume"
                        className="w-full md:h-[250px] lg:h-[360px] max-sm:h-[200px] object-cover object-top-left"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }

        </div>
      </div>
    </div>
  )
}

export default ResumesArea