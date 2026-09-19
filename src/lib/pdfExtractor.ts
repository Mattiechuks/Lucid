import * as pdfjsLib from "pdfjs-dist";

// Configure worker using official CDN matching version to ensure no build bundle issues
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  // Use unpkg or cdnjs worker for seamless execution
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "4.10.38"}/pdf.worker.min.mjs`;
}

export interface PDFExtractionResult {
  text: string;
  numPages: number;
  wordCount: number;
}

/**
 * Extract plain text and metadata from an uploaded lecture PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = "";
  const numPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageStrings = content.items
        .map((item) => {
          if ("str" in item) {
            return (item as { str: string }).str;
          }
          return "";
        })
        .filter(Boolean);
      
      const pageText = pageStrings.join(" ").trim();
      if (pageText) {
        fullText += `[Page ${pageNum}]\n${pageText}\n\n`;
      }
    } catch (pageErr) {
      console.warn(`Could not extract page ${pageNum}:`, pageErr);
    }
  }

  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  return {
    text: fullText.trim(),
    numPages,
    wordCount,
  };
}
