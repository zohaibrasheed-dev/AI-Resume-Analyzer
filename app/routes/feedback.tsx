import { useResumeStore } from "~/store/resumeStore";
import { useEffect, useState } from "react";
import scannerImg from "/images/scanner.gif";
import { prepareInstructions } from "~/lib/instructions";

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

    // 2. Optimized AI Analysis with Timeout
    useEffect(() => {
        const runAnalysis = async () => {
            if (!imageBlob || !jobData) return;

            setLoading(true);
            setError(null);

            try {
                const puter = (window as any).puter;

                // Convert Blob to Base64 (Most reliable for AI image analysis)
                const base64Image = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageBlob);
                });

                const instructions = prepareInstructions({
                    jobTitle: jobData.jobTitle,
                    jobDescription: jobData.jobDescription,
                });

                // Setup Timeout (60 seconds)
                const analysisTask = puter.ai.chat(
                    [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: instructions },
                                { type: "image_url", image_url: { url: base64Image } },
                            ],
                        },
                    ],
                    { model: "gpt-4o" } // gpt-4o is vision-capable, make sure you're using this
                );

                const timeoutTask = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Analysis took too long. Please try again.")), 60000)
                );

                // Race between analysis and timeout
                const response: any = await Promise.race([analysisTask, timeoutTask]);
                console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));

                // Extract and Clean Content
                const rawContent = typeof response === 'string'
                    ? response
                    : (response.message?.content ?? "");

                console.log("RAW AI RESPONSE:", rawContent); // 👈 Add this temporarily to debug

                // Extract JSON — find the first { and last } to isolate the object
                const jsonStart = rawContent.indexOf('{');
                const jsonEnd = rawContent.lastIndexOf('}');

                if (jsonStart === -1 || jsonEnd === -1) {
                    throw new Error("AI did not return a valid JSON structure. Try again.");
                }

                const cleanedJson = rawContent.slice(jsonStart, jsonEnd + 1);
                const parsedData = JSON.parse(cleanedJson);

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
                <div className="w-1/2 p-5 bg-gray-300">
                    <div className="resume-preview flex items-center justify-center h-full">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Resume Preview" className="w-full max-w-[70%]" />
                        ) : (
                            <p>No preview available</p>
                        )}
                    </div>
                </div>

                <div className="w-1/2 relative">
                    <div className="full-center">
                        {loading ? (
                            <div className="flex flex-col items-center">
                                <img src={scannerImg} alt="Analyzing..." className="h-100 w-100" />
                                <p>AI is analyzing your resume... (this may take up to 60s)</p>
                            </div>
                        ) : error ? (
                            <p className="text-red-500 font-bold">{error}</p>
                        ) : feedback ? (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold">Overall Score: {feedback.overallScore}</h2>
                                <pre className="text-xs bg-gray-100 p-4 mt-4">{JSON.stringify(feedback, null, 2)}</pre>
                            </div>
                        ) : (
                            <p>No feedback generated.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Feedback;