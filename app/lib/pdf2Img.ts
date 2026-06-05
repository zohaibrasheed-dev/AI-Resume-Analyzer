let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  // @ts-ignore
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    // Public folder path
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<{ file: File | null; imageUrl: string; error: string | null }> {
  try {
    // console.log("Starting conversion for:", file.name);
    const pdfjs = await loadPdfJs();
    
    // File ko ArrayBuffer mein convert kiya
    const arrayBuffer = await file.arrayBuffer();
    
    // PDF Document load kiya
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // console.log("PDF loaded successfully. Total pages:", pdf.numPages);

    // Pehla page uthaya
    const page = await pdf.getPage(1);
    // console.log("Page 1 retrieved.");

    // Canvas create kiya rendering ke liye
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context 2D create nahi ho saka.");
    }

    // Viewport calculate kiya
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render configuration
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // console.log("Rendering page to canvas context...");
    await page.render(renderContext).promise;
    // console.log("Render completed successfully.");

    // Canvas se Blob/File banana
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ file: null, imageUrl: "", error: "Blob creation failed" });
          return;
        }

        // Asli PNG file create ki
        const convertedFile = new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}.png`, {
          type: "image/png",
        });

        // Local URL preview ke liye
        const imageUrl = URL.createObjectURL(convertedFile);

        // console.log("Image file generated successfully:", convertedFile.name);
        resolve({ file: convertedFile, imageUrl, error: null });
      }, "image/png");
    });

  } catch (err: any) {
    console.error("Error inside convertPdfToImage engine:", err);
    return { file: null, imageUrl: "", error: err.message || "Internal conversion error" };
  }
}