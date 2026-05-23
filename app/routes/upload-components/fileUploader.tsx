import { useRef } from "react";
import infoIcon from "/public/icons/info.svg";

const FileUploader = () => {

    // Grab Input-file Element
    const inputFileRef = useRef<HTMLInputElement>(null);

    // Trigger Input-file while clicking Custom Uploader
    const showUploader = () => {
        inputFileRef.current?.click();
    }

    // File Uploading
    const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log("File is uploaded", selectedFile);
    }

    return (
        <>
            <div className="inset-shadow w-full p-3 rounded-3xl" onClick={showUploader}>
                <div className="custom-uploader flex flex-col items-center w-full bg-white p-12 rounded-2xl cursor-pointer">
                    <img src={infoIcon} alt="info-icon" className="w-[60px]" />
                    <h4 className="text-base font-inter mt-5 mb-2">
                        <span className="font-semibold">Click to upload</span>
                        <span className="text-gray-700"> or drag and drop</span>
                    </h4>
                    <span className="text-gray-500 text-sm">PDF, PNG or JPG (max. 10MB)</span>
                </div>
            </div>
            <input type="file" onChange={fileUpload} accept=".pdf" className="hidden" ref={inputFileRef} id="file-input" />
        </>
    )
}

export default FileUploader