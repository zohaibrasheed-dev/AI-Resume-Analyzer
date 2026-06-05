import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "./ScoreBadge";

// TypeScript interface local backup safe alignment
interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface Feedback {
    overallScore: number;
    toneAndStyle?: { score: number; tips: Suggestion[] };
    content?: { score: number; tips: Suggestion[] };
    structure?: { score: number; tips: Suggestion[] };
    skills?: { score: number; tips: Suggestion[] };
    ATS?: { score: number; tips: Suggestion[] };
}

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
            : score > 49
        ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary border-b border-gray-100 last:border-none py-3 px-4 flex justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
                <p className="text-lg font-medium text-gray-700">{title}</p>
                <ScoreBadge score={score} />
            </div>
            <p className="text-lg font-bold text-gray-800">
                <span className={textColor}>{score}</span><span className="text-gray-400 font-normal text-sm">/100</span>
            </p>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: any }) => {
    // 🚀 FAIL-SAFE MAPPING: Underscore or alternate structural parsing falls back safely
    const overall = feedback?.overallScore ?? feedback?.overall_score ?? 0;
    
    // Fallbacks definitions to completely eliminate "Cannot read properties of undefined"
    const toneScore = feedback?.toneAndStyle?.score ?? feedback?.tone_and_style?.score ?? 0;
    const contentScore = feedback?.content?.score ?? 0;
    const structureScore = feedback?.structure?.score ?? 0;
    const skillsScore = feedback?.skills?.score ?? 0;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden border border-gray-100">
            <div className="flex flex-row items-center p-6 gap-6 bg-slate-50/50 border-b border-gray-100">
                <ScoreGauge score={overall} />

                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-gray-900">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        This score is calculated based on the metrics analyzed by the AI engine.
                    </p>
                </div>
            </div>

            {/* Passing parsed safe direct values instead of breaking structural nested queries */}
            <Category title="Tone & Style" score={toneScore} />
            <Category title="Content" score={contentScore} />
            <Category title="Structure" score={structureScore} />
            <Category title="Skills" score={skillsScore} />
        </div>
    )
}

export default Summary;