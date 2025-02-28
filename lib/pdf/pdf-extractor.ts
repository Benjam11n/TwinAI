import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Configure worker
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface TextBlock {
  str: string;
  x: number;
  y: number;
  hasEOL?: boolean;
}

interface PdfExtractCallbacks {
  onPageComplete?: (currentPage: number, totalPages: number) => void;
  onComplete?: (text: string) => void;
}

export class PdfTextExtractor {
  private pageTexts: { [key: number]: string } = {};
  private completedPages = 0;

  constructor() {}

  /**
   * Extract text from PDF file
   * @param file PDF file to process
   * @param callbacks Optional progress callbacks
   */
  async extractText(
    file: File,
    callbacks?: PdfExtractCallbacks
  ): Promise<string> {
    try {
      // Read file as ArrayBuffer
      const data = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const totalPages = pdf.numPages;

      // Process all pages concurrently
      const pagePromises = [];
      for (let i = 1; i <= totalPages; i++) {
        pagePromises.push(
          this.processPage(pdf, i, totalPages, callbacks?.onPageComplete)
        );
      }

      // Wait for all pages to complete
      await Promise.all(pagePromises);

      // Combine text from all pages in order
      let fullText = '';
      for (let i = 1; i <= totalPages; i++) {
        fullText += this.pageTexts[i] || '';
      }

      // Call completion callback if provided
      callbacks?.onComplete?.(fullText);

      return fullText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw error;
    }
  }

  private async processPage(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number,
    totalPages: number,
    onPageComplete?: (current: number, total: number) => void
  ): Promise<void> {
    try {
      // Get page
      const page = await pdf.getPage(pageNum);

      // Extract text content
      const textContent = await page.getTextContent();

      // Process text blocks
      let pageText = '';
      let lastBlock: TextBlock | null = null;

      for (const item of textContent.items) {
        const block = item as unknown as TextBlock;

        // Add appropriate spacing between blocks
        if (lastBlock) {
          if (lastBlock.str[lastBlock.str.length - 1] !== ' ') {
            if (block.x < lastBlock.x) {
              // New line if x-coordinate decreases
              pageText += '\n';
            } else if (
              lastBlock.y !== block.y &&
              !lastBlock.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/)
            ) {
              // Space if y-coordinate changes and not mid-word
              pageText += ' ';
            }
          }
        }

        pageText += block.str;
        lastBlock = block;

        // Add newline for explicit EOL markers
        if (block.hasEOL) {
          pageText += '\n';
        }
      }

      // Store page text
      this.pageTexts[pageNum] = pageText + '\n\n';

      // Update progress
      this.completedPages++;
      onPageComplete?.(this.completedPages, totalPages);
    } catch (error) {
      console.error(`Error processing page ${pageNum}:`, error);
      throw error;
    }
  }
}
