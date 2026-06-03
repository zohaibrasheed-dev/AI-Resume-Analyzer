// app/lib/pdf2Img.ts

// =========================================================
// TYPES & CACHING VARIABLES
// =========================================================
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;


// =========================================================
// CHUNK 1: Dynamic Engine Loader Function
// =========================================================
export async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // @ts-ignore
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}


// =========================================================
// CHUNK 2 & CHUNK 3: Main Engine & Rendering Setup
// =========================================================
export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        // --- CHUNK 2: Page Extraction Start ---
        // 1. Library load karke active ki
        const pdfjs = await loadPdfJs();

        // 2. Original PDF file ko machine-readable raw binary data (ArrayBuffer) mein badla
        const arrayBuffer = await file.arrayBuffer();

        // 3. Engine ko binary data feed karke document load karne ka order diya
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;

        // 4. PDF document ke andar se Pehla Page (Blueprint) nikaal kar hold kiya
        const page = await pdfDoc.getPage(1);
        // --- CHUNK 2 END ---


        // --- CHUNK 3: Canvas Board Paint Start ---
        // 5. Kis scale/zoom par page render karna hai (1.5 se image clear banti hai)
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // 6. Browser memory mein ek invisible khaali board (canvas element) banaya
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas context initialize nahi ho saka.");
        }

        // 7. Board ka physical size bilkul PDF page ke blueprint ke mutabik fix kiya
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // 8. Engine ko context aur viewport de kar blueprint ko board par paint karwa diya
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;
        // --- CHUNK 3 END ---


        // Abhi ke liye temporary return (Agle chunk mein real image file banayenge)
        return {
            imageUrl: "",
            file: null
        };

    } catch (err: any) {
        console.error("Conversion error:", err);
        return {
            imageUrl: "",
            file: null,
            error: err.message || "PDF parse ya render karne mein masla hua."
        };
    }
}