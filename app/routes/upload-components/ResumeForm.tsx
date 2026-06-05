import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 React Router 7 Navigation Hook
import FileUploader from "./FileUploader";
import FilePreview from "./FilePreview";
import spinner from "/images/resumeScanner.gif";
import { convertPdfToImage } from "~/lib/pdf2Img";

const ResumeForm = () => {
  const navigate = useNavigate(); // 🔥 Router trigger instance

  // Form States
  const [file, setFile] = useState<File | null>(null); 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // Receive Uploaded File From Child Component
  const fileReceived = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage('');
  }

  // Form Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const puter = (window as any).puter;
    if (!puter) {
      console.error("Puter Not Found!");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload your resume file");
      return;
    }

    // Extracting Input Fields Data
    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    try {
      setIsProcessing(true);
      
      let fileToUpload: File = file;
      let previewUrlString = "";

      // CHUNK A: PDF to Image conversion
      if (file.type === "application/pdf") {
        setProcessingStatus("Rendering PDF to Crisp Image...");
        const conversionResult = await convertPdfToImage(file);
        
        if (conversionResult.error || !conversionResult.file) {
          throw new Error(conversionResult.error || "PDF conversion failed.");
        }
        
        fileToUpload = conversionResult.file;
        previewUrlString = conversionResult.imageUrl;
      } else {
        previewUrlString = URL.createObjectURL(file);
      }

      // CHUNK B: Puter Cloud Upload
      setProcessingStatus("Uploading Resume To Cloud...");
      const puterCloudData = await puter.fs.upload(fileToUpload);
      
      if (!puterCloudData) {
        throw new Error("Puter cloud upload failed.");
      }

      // 🔥 INSTRUCTOR'S MASTERSTROKE: Cloud hosted read URL pick kiya
      const cloudImageUrl = puterCloudData.read_url;

      setProcessingStatus("Redirecting to analysis dashboard...");
      await new Promise((res) => setTimeout(res, 500)); 

      setIsProcessing(false);

      // 🔥 STEP 2 REDIRECT: React Router 7 ke mutabik query strings ke sath push kiya
      const queryParams = new URLSearchParams({
        imageUrl: cloudImageUrl,
        company: companyName,
        title: jobTitle,
        desc: jobDescription
      });

      navigate(`/results?${queryParams.toString()}`);

    } 
    catch (error: any) {
      setIsProcessing(false);
      setErrorMessage(error.message || "Something went wrong");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="uploader-form mt-20">
        {
          isProcessing ? (
            <div className="loader-wrapper flex flex-col items-center justify-center min-h-[40vh]">
              <span className="text-2xl text-gray-700 blink mb-4">{processingStatus}</span>
              <img src={spinner} alt="spinner-gif" className="w-24 h-24 object-contain" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="upload-form" className="flex flex-col gap-4 mt-8 p-12 rounded-xl bg-gray-300">
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

                {
                  file ? (
                    <FilePreview fileName={file.name} />
                  ) : (
                    <FileUploader fileReceiveFnc={fileReceived} />
                  )
                }

                {
                  errorMessage && (
                    <p className="text-red-400 text-base">{errorMessage}</p>
                  )
                }
              </div>
              <button className="primary-button active:scale-95" type="submit">
                Analyze Resume
              </button>
            </form>
          )
        }
      </div>
    </div>
  )
}

export default ResumeForm;