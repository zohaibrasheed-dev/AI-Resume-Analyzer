import { useState } from "react";
import FileUploader from "./upload-components/fileUploader";

const Upload = () => {

    const [file, setFile] = useState<File | null>(null);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">

            <div className="heroSec text-center mt-14">
                <h1>Smart feedback <br />for your dream job</h1>
                <p className="text-xl mt-4">Drop your resume for an ATS score and improvement tips.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="uploader-form mt-20">
                    <form id="upload-form" className="flex flex-col gap-4 mt-8 p-12 rounded-xl bg-gray-300">
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
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader />
                        </div>
                        <button className="primary-button" type="submit">
                            Analyze Resume
                        </button>
                    </form>
                </div>
            </div>

        </main>
    )
}

export default Upload