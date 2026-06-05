import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "./FileUploader";
import FilePreview from "./FilePreview";
import spinner from "/images/resumeScanner.gif";
import { convertPdfToImage } from "~/lib/pdf2Img";

const ResumeForm = () => {
  const navigate = useNavigate();

  // Form States
  const [file, setFile] = useState<File | null>(null); 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const fileReceived = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const puter = (window as any).puter;
    if (!puter) {
      setErrorMessage("Puter cloud services not available.");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload your resume file");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // try {
    //   setIsProcessing(true);
      
    //   let imageFileToUpload: File = file;

      // 1. Convert PDF to Image locally if it's a PDF
      // if (file.type === "application/pdf") {
      //   setProcessingStatus("Converting PDF layout to Image asset...");
      //   const conversionResult = await convertPdfToImage(file);
      //   if (conversionResult.error || !conversionResult.file) {
      //     throw new Error(conversionResult.error || "PDF conversion failed.");
      //   }
      //   imageFileToUpload = conversionResult.file;
      // }

      // 2. Upload As-Is Resume File (PDF/Doc) to Puter FS
      // setProcessingStatus("Uploading original resume to safe storage...");
      // const originalUpload = await puter.fs.upload(file);
      // if (!originalUpload) throw new Error("Original resume upload failed.");

      // 3. Upload the Converted PNG image to Puter FS
      // setProcessingStatus("Optimizing and hosting resume preview canvas...");
      // const imageUpload = await puter.fs.upload(imageFileToUpload);
      // if (!imageUpload) throw new Error("Preview rendering asset upload failed.");

      // 4. Fire Puter AI to analyze and get Structured JSON
      // setProcessingStatus("AI is running deep ATS scanning matrix...");
      
//       const systemPrompt = `You are an elite Applicant Tracking System (ATS) and tech recruiter.
// Analyze the resume and match it against the job details. 
// You must return your entire response as a valid JSON object matching this exact TypeScript shape:
// {
//   "summary": "A high-level paragraph review of the candidate alignment.",
//   "ATS": {
//     "score": 85,
//     "tips": ["Add TypeScript keywords", "Elaborate on React state hooks management"]
//   },
//   "details": {
//     "strengths": ["Strong CSS styling architecture", "Good portfolio link"],
//     "weaknesses": ["Missing backend API connection experience"]
//   }
// }
// Do not wrap the JSON in markdown code blocks or add any text outside the JSON object.`;

//       const userPrompt = `
// Job Title: ${jobTitle}
// Company: ${companyName}
// Job Description: ${jobDescription}
// Please read the resume from this file asset: ${imageUpload.read_url}`;

//       const aiResponse = await puter.ai.chat([
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ]);

      // Parse output string cleanly
      // let parsedFeedback;
      // try {
      //   const cleanJsonString = aiResponse.message.content.replace(/```json|```/g, "").trim();
      //   parsedFeedback = JSON.parse(cleanJsonString);
      // } catch (pErr) {
      //   console.error("AI returned malformed JSON, creating fallback object", pErr);
      //   parsedFeedback = {
      //     summary: aiResponse.message.content,
      //     ATS: { score: 70, tips: ["Ensure clear keywords integration."] },
      //     details: { strengths: ["Good attempt"], weaknesses: ["Could not parse deep metrics"] }
      //   };
      // }

      // 5. Store package into Puter KV Storage
      // setProcessingStatus("Finalizing records secure tokens...");
      // const resumeId = "res_" + Math.random().toString(36).substring(2, 11);
      
      // const payload = {
      //   resumePath: originalUpload.path,
      //   imagePath: imageUpload.path,
      //   feedback: parsedFeedback
      // };

      // await puter.kv.set(`results:${resumeId}`, JSON.stringify(payload));

      // setIsProcessing(false);
      
      // 6. Navigate directly to Instructor's style clean path!
      // navigate(`/results/${resumeId}`);

    // } catch (error: any) {
    //   console.error(error);
    //   setIsProcessing(false);
    //   setErrorMessage(error.message || "Something went wrong");
    // }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="uploader-form mt-20">
        {isProcessing ? (
          <div className="loader-wrapper flex flex-col items-center justify-center min-h-[40vh]">
            <span className="text-2xl text-gray-700 blink mb-4">{processingStatus}</span>
            <img src={spinner} alt="Processing..." className="w-24 h-24 object-contain" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 p-12 rounded-xl bg-gray-300">
            <div className="field">
              <label htmlFor="company-name">Company Name</label>
              <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
            </div>
            <div className="field">
              <label htmlFor="job-title">Job Title</label>
              <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
            </div>
            <div className="field">
              <label htmlFor="job-description">Job Description</label>
              <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
            </div>
            <div className="field">
              <label>Upload Resume</label>
              {file ? <FilePreview fileName={file.name} /> : <FileUploader fileReceiveFnc={fileReceived} />}
              {errorMessage && <p className="text-red-400 text-base">{errorMessage}</p>}
            </div>
            <button className="primary-button active:scale-95" type="submit">
              Analyze Resume
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;