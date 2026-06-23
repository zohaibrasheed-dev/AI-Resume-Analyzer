import { useState } from "react";
import FileUploader from "./FileUploader";
import FilePreview from "./FilePreview";
import spinner from "/images/resumeScanner.gif";
import { convertPdfToImage } from "~/lib/pdf2Img";
import { useResumeStore } from "~/store/resumeStore";

import { useNavigate } from "react-router";

const ResumeForm = () => {

  const navigate = useNavigate();

  // Get Feedback Store so that we can store data in Store
  const { setImageBlob, setJobData } = useResumeStore();

  // To Track PDF File if User Uploaded Any file before submit
  const [file, setFile] = useState<File | null>(null); 
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Track And Show Processing Messages When PDF2Img is Working
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // Check if image Is ready
  const [imageStatus, setImageStatus] = useState<string>('');

  const fileReceived = (uploadedFile:File) => {
    setFile(uploadedFile);
    setErrorMessage('');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!file) {
      setErrorMessage("Please Upload Your Resume");
      return;
    }

    const puter = (window as any).puter;
    if (!puter) {
      setErrorMessage("Puter cloud services not available.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const jobInfo = {
      companyName: formData.get("company-name") as string,
      jobTitle: formData.get("job-title") as string,
      jobDescription: formData.get("job-description") as string
    }
    setJobData(jobInfo);

    try {

      setIsProcessing(true);

      let imageFile:File = file;

      if (file.type === "application/pdf") {
        setProcessingStatus("Converting Your PDF File To Image...");
        const conversionResult = await convertPdfToImage(file);
        if (conversionResult.error || !conversionResult.file) {
          throw new Error(conversionResult.error || "PDF conversion failed.");
        }
        imageFile = conversionResult.file;
      }

      // After Converting PDF To Image, Upload it to Puter Cloud
      setProcessingStatus("Uploading Resume To Cloud...");
      const originalUpload = await puter.fs.upload(file);
      if (!originalUpload) throw new Error("Original resume upload failed.");

      setProcessingStatus("Preparing Dashboard.... redirecting");
      setImageBlob(imageFile);

      navigate('/feedback');

      setIsProcessing(false);

    }

    catch(error: any) {
      setIsProcessing(false);
      console.error("Hi From Catch Snippet, PDF To Image Conversion and Uploading To Cloud has failed!",error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="uploader-form mt-20">

        {
          isProcessing ? (
            <div className="loader-wrapper flex flex-col items-center justify-center min-h-[40vh]">
              <span className="text-2xl text-gray-700 blink mb-4">{processingStatus}</span>
              <img src={spinner} alt="loader-img" className="w-100 h-100 object-contain" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col mt-8 p-4 md:p-12 rounded-xl bg-gray-300">
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
          )
        }


      </div>
    </div>
  )
}

export default ResumeForm