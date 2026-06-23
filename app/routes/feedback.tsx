import { useResumeStore } from "~/store/resumeStore";
import { useEffect, useState } from "react";
import scannerImg from "/images/scanner.gif";
import { prepareInstructions } from "~/lib/instructions";
import Summary from "./results-components/Summary";
import ATS from "./results-components/ATS";
import Details from "./results-components/Details";

const Feedback = () => {
    const { imageBlob, jobData } = useResumeStore();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Image Preview logic
    useEffect(() => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageBlob]);

    // 2. AI Analysis
    useEffect(() => {
        const runAnalysis = async () => {
            if (!imageBlob || !jobData) return;

            setLoading(true);
            setError(null);

            try {
                const puter = (window as any).puter;

                const base64Image = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageBlob);
                });

                const instructions = prepareInstructions({
                    jobTitle: jobData.jobTitle,
                    jobDescription: jobData.jobDescription,
                });

                const analysisTask = puter.ai.chat([
                    {
                        role: "user",
                        content: [
                            { type: "text", text: instructions },
                            { type: "image_url", image_url: { url: base64Image } },
                        ],
                    },
                ]);

                const timeoutTask = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Analysis took too long. Please try again.")),
                        60000
                    )
                );

                const response: any = await Promise.race([analysisTask, timeoutTask]);

                const rawContent =
                    typeof response === "string"
                        ? response
                        : response?.message?.content ?? "";

                const jsonStart = rawContent.indexOf("{");
                const jsonEnd = rawContent.lastIndexOf("}");

                if (jsonStart === -1 || jsonEnd === -1) {
                    throw new Error("AI did not return a valid JSON structure. Try again.");
                }

                const cleanedJson = rawContent.slice(jsonStart, jsonEnd + 1);

                let parsedData;
                try {
                    parsedData = JSON.parse(cleanedJson);
                } catch (parseError) {
                    // Attempt to repair common AI JSON issues:
                    // 1. Unescaped newlines inside strings
                    // 2. Trailing commas before closing braces/brackets
                    const repaired = cleanedJson
                        .replace(/[\r\n]+/g, " ")           // flatten newlines inside strings
                        .replace(/,\s*([}\]])/g, "$1")      // remove trailing commas
                        .replace(/([^\\])\\([^"\\/bfnrtu])/g, "$1 $2"); // fix bad escape sequences

                    parsedData = JSON.parse(repaired);
                }

                await puter.kv.set("latest_feedback", parsedData);
                setFeedback(parsedData);
            } catch (err: any) {
                console.error("AI Analysis Error:", err);
                setError(err.message || "Failed to analyze resume.");
            } finally {
                setLoading(false);
            }
        };

        runAnalysis();
    }, [imageBlob, jobData]);

    return (
        <main className="p-0!">
            <div className="flex flex-wrap min-h-screen">

                {/* ── Left panel: Resume Preview ── */}
                <div className="w-full lg:w-[50%] lg:sticky top-0 lg:h-screen bg-gray-100 flex items-center justify-center p-8 shrink-0">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Resume Preview"
                            className="w-full max-w-3xl rounded-xl shadow-lg object-contain md:max-h-[500px] lg:max-h-[90vh]"
                        />
                    ) : (
                        <p className="text-gray-400">No preview available</p>
                    )}
                </div>

                {/* ── Right panel: Feedback ── */}
                <div className="w-full lg:w-[50%] overflow-y-auto px-5 py-5 lg:px-10 lg:py-10">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <img src={scannerImg} alt="Analyzing..." className="h-40 w-40" />
                            <p className="mt-4 text-gray-500 text-base">
                                AI is analyzing your resume… (this may take up to 60s)
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <p className="text-red-500 font-semibold text-lg">{error}</p>
                        </div>
                    ) : feedback ? (
                        <div className="flex flex-col gap-6">

                            {/* Page title + breadcrumb area */}
                            <h1 className="feedbackTitle">Resume Review</h1>

                            {/* Overall score summary card */}
                            <Summary feedback={feedback} />

                            {/* ATS card */}
                            {feedback.ATS && (
                                <ATS
                                    score={feedback.ATS.score}
                                    suggestions={feedback.ATS.tips}
                                />
                            )}

                            {/* Detailed accordion sections */}
                            <Details feedback={feedback} />

                        </div>
                    ) : (
                        <p className="text-gray-400">No feedback generated.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Feedback;
