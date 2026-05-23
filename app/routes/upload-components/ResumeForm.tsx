import { useState } from "react";
import FileUploader from "./fileUploader";

const ResumeForm = () => {

  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileReceived = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage('');
  }

  // Form Handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please upload your resume file");
      return;
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="uploader-form mt-20">
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
            <FileUploader fileReceiveFnc={fileReceived} />
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
      </div>
    </div>
  )
}

export default ResumeForm