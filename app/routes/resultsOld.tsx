import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState, useRef } from "react";


export interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

export interface Feedback {
  overallScore: number;
  toneAndStyle: { score: number; tips: Suggestion[] };
  content: { score: number; tips: Suggestion[] };
  structure: { score: number; tips: Suggestion[] };
  skills: { score: number; tips: Suggestion[] };
  ATS: {
    score: number;
    tips: Suggestion[];
  };
}

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const hasFetched = useRef(false);

  useEffect(() => {
    const loadResume = async () => {
      const puter = (window as any).puter;
      if (!puter) return; 

      if (!id || hasFetched.current) return;

      try {
        hasFetched.current = true;
        console.log("Fetching key match from Puter KV: results:" + id);
        const resumePayload = await puter.kv.get(`results:${id}`);

        if (!resumePayload) {
          setErrorMsg("No record found for this Resume ID.");
          return;
        }

        const data = JSON.parse(resumePayload);

        // 1. Load original PDF blob
        if (data.resumePath) {
          const resumeBlobData = await puter.fs.read(data.resumePath);
          if (resumeBlobData) {
            const pdfBlob = new Blob([resumeBlobData], { type: "application/pdf" });
            setResumeUrl(URL.createObjectURL(pdfBlob));
          }
        }

        // 2. Load preview image blob
        if (data.imagePath) {
          const imageBlobData = await puter.fs.read(data.imagePath);
          if (imageBlobData) {
            const imgBlob = new Blob([imageBlobData], { type: "image/png" });
            setImageUrl(URL.createObjectURL(imgBlob));
          }
        }

        // 3. 🔥 CRASH-PROOF DATA MAPPING FOR ALL CHILDREN (Summary, Details, ATS)
        const rawFeedback = data.feedback || {};

        console.log("Full Raw Data Structure:", rawFeedback);

        const toSuggestion = (arr: any[], type: "good" | "improve") =>
          (arr || []).map((t: any) => (typeof t === "string" ? { type, tip: t } : t));

        const mapLegacyDetails = (rf: any): Feedback => {
          const strengths: string[] = rf.details?.strengths ?? [];
          const weaknesses: string[] = rf.details?.weaknesses ?? [];

          const keywords: { [cat: string]: string[] } = {
            toneAndStyle: ["tone", "voice", "style", "professional", "formal", "informal"],
            content: ["content", "details", "description", "summary", "bullets", "experience"],
            structure: ["structure", "format", "layout", "order", "sections", "formatting"],
            skills: ["skill", "typescript", "react", "javascript", "css", "api", "backend", "frontend", "node"]
          };

          const buckets: { [k: string]: any[] } = {
            toneAndStyle: [],
            content: [],
            structure: [],
            skills: []
          };

          const assign = (text: string, type: "good" | "improve") => {
            const txt = (text || "").toLowerCase();
            let placed = false;
            Object.keys(keywords).forEach((cat) => {
              if (keywords[cat].some((kw) => txt.includes(kw))) {
                buckets[cat].push({ type, tip: text });
                placed = true;
              }
            });
            if (!placed) {
              // fallback to content
              buckets.content.push({ type, tip: text });
            }
          };

          strengths.forEach((s: string) => assign(s, "good"));
          weaknesses.forEach((w: string) => assign(w, "improve"));

          const combined = [...(buckets.toneAndStyle || []), ...(buckets.content || []), ...(buckets.structure || []), ...(buckets.skills || [])];

          // Ensure each category has something — if empty, populate with combined mapped suggestions
          Object.keys(buckets).forEach((k) => {
            if (buckets[k].length === 0) buckets[k] = combined.slice(0, 3);
          });

          return {
            overallScore: rf.overallScore ?? rf.overall_score ?? 75,
            toneAndStyle: { score: rf.toneAndStyle?.score ?? 70, tips: buckets.toneAndStyle },
            content: { score: rf.content?.score ?? 70, tips: buckets.content },
            structure: { score: rf.structure?.score ?? 70, tips: buckets.structure },
            skills: { score: rf.skills?.score ?? 70, tips: buckets.skills },
            ATS: {
              score: rf.ATS?.score ?? rf.ats?.score ?? 70,
              tips: rf.ATS?.tips ?? rf.ats?.tips ?? rf.ATS?.suggestions ?? rf.ats?.suggestions ?? []
            }
          };
        };

        let cleanFeedback: Feedback = {
          overallScore: rawFeedback.overallScore ?? rawFeedback.overall_score ?? 75,
          toneAndStyle: {
            score: rawFeedback.toneAndStyle?.score ?? rawFeedback.tone_and_style?.score ?? 70,
            tips:
              rawFeedback.toneAndStyle?.tips ?? rawFeedback.tone_and_style?.tips ?? rawFeedback.toneAndStyle?.suggestions ?? rawFeedback.tone_and_style?.suggestions ?? []
          },
          content: {
            score: rawFeedback.content?.score ?? 70,
            tips: rawFeedback.content?.tips ?? rawFeedback.content?.suggestions ?? []
          },
          structure: {
            score: rawFeedback.structure?.score ?? 70,
            tips: rawFeedback.structure?.tips ?? rawFeedback.structure?.suggestions ?? []
          },
          skills: {
            score: rawFeedback.skills?.score ?? 70,
            tips: rawFeedback.skills?.tips ?? rawFeedback.skills?.suggestions ?? []
          },
          ATS: {
            score: rawFeedback.ATS?.score ?? rawFeedback.ats?.score ?? 70,
            tips: rawFeedback.ATS?.tips ?? rawFeedback.ats?.tips ?? rawFeedback.ATS?.suggestions ?? rawFeedback.ats?.suggestions ?? []
          }
        };

        // If the expected category tips are all empty but we have legacy `details`, map them.
        const allEmpty =
          cleanFeedback.toneAndStyle.tips.length === 0 &&
          cleanFeedback.content.tips.length === 0 &&
          cleanFeedback.structure.tips.length === 0 &&
          cleanFeedback.skills.tips.length === 0;

        if (allEmpty && rawFeedback.details) {
          console.warn("Detected legacy `details` shape — mapping into category tips.");
          cleanFeedback = mapLegacyDetails(rawFeedback);
        }

        setFeedback(cleanFeedback);

      } catch (err: any) {
        console.error("Critical error inside data layer:", err);
        setErrorMsg(err?.message || "Failed to retrieve data.");
      }
    };

    const interval = setInterval(() => {
      if ((window as any).puter) {
        loadResume();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [resumeUrl, imageUrl]);

  return (
    <main className="!pt-0 min-h-screen bg-gray-50/50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-gray-800 text-sm font-semibold hover:text-indigo-600 transition-colors">
            ← Back to Dashboard
          </span>
        </Link>
      </nav>

      {errorMsg && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl text-center shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="flex flex-row w-full max-lg:flex-col-reverse items-start">
        {/* Left Side: Resume Preview */}
        <section className="lg:w-1/2 w-full bg-slate-100 min-h-[90vh] lg:sticky lg:top-0 flex items-center justify-center p-6">
          {imageUrl && resumeUrl ? (
            <div className="h-[85vh] w-full max-w-xl shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-200 p-2">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img src={imageUrl} className="w-full h-full object-contain rounded-xl" alt="Scanned Resume" />
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl max-w-sm">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold text-slate-700">Loading Resume Preview Canvas...</p>
            </div>
          )}
        </section>

        {/* Right Side: Dashboard */}
        <section className="lg:w-1/2 w-full p-8 flex flex-col gap-6">
          <div className="border-b pb-4 border-gray-200">
            <h2 className="text-4xl text-black font-black tracking-tight">Resume Review</h2>
          </div>
          
          {feedback ? (
            <div className="flex flex-col gap-8 w-full">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-12 min-h-[60vh]">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-gray-800">Compiling Evaluation Matrix</h3>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;