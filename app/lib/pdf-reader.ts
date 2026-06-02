
/* USE OF PDF_DIST
Yahan ek pura module bnaa rahy hen Jiska Kaam Library ko use kr pdf ko read krna hai.
Steps: 
    1.  2 cheezen receive hongi is men.. Data jo PDF ko read kr k mily ga aur 1 Promise k read ho rha hai ya nahi

    -> Jesy He file upload hogi, onChange chaly ga .. aur sath ee ye library download hogi jo k hamen file
    Read kr k degi. Lekin yahan humko bs wo library download krni hai.
*/


function loadPdfJs() {

    let pdfReaderLib = null;

    // @ts-ignore
    const libraryData = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
        pdfReaderLib = lib;
    })

}