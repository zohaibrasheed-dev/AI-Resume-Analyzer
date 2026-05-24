import { useState } from "react";
import FileUploader from "./fileUploader";
import FilePreview from "./FilePreview";
import spinner from "/images/resumeScanner.gif";

const ResumeForm = () => {

  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileReceived = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage('');
  }

  // Form Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if Puter Is Installed!
    const puter = (window as any).puter;
    if (!puter) {
      console.error("Puter Not Found!");
      return;
    }

    // Check If File Is Uploaded
    if (!file) {
      setErrorMessage("Please upload your resume file");
      return;
    }

    // Extracting Data From All Input Fields
    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    const resumeFile = file as File;

    try {
      const puterCloudData = await puter.fs.upload(file);
      if (puterCloudData) {
        console.log("Files Upload Success");
        console.log("Here is what we get", puterCloudData);
      }
    } catch (error) {
      console.log("Something Went Wrong!", error);
    }

  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="uploader-form mt-20">

        {
          isUploading ? (
            isUploading && (
              <div className="loader-wrapper">
                <span className="text-2xl text-gray-700 blink">Uploading.... Please wait</span>
                <img src={spinner} alt="spinner-gif" />
              </div>
            )
          ) : (
            <form onSubmit={handleSubmit} id="upload-form" className="flex flex-col gap-4 mt-8 p-12 rounded-xl bg-gray-300">
              <div className="field">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
              </div>
              <div className="field">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>
              <div className="field">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
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

export default ResumeForm