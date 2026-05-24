import pdfIcon from "/images/pdf.png";

interface FileName {
    fileName: string;
}

const FilePreview = ({fileName}: FileName) => {
    return (
        <div className="inset-shadow w-full p-3 rounded-3xl">
            <div className="fileName-preview flex flex-col items-center w-full bg-white p-12 rounded-2xl cursor-pointer gap-2">
                <img src={pdfIcon} alt="info-icon" className="w-[60px]" />
                <span>{fileName}</span>
            </div>
        </div>
    )
}

export default FilePreview