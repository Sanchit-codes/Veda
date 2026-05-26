import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { readFileSync } from "fs";

export class PdfParser {
  async extractText(filePath: string, mimetype: string): Promise<string> {
    if (mimetype === "application/pdf" || filePath.endsWith(".pdf")) {
      try {
        const text = await this.extractFromPdf(filePath);
        console.log(`[PDF] Extracted ${text.length} chars from ${filePath}`);
        return text;
      } catch (err: any) {
        console.error(`[PDF] Failed to parse PDF ${filePath}: ${err.message}`);
        return "";
      }
    }

    if (
      mimetype.startsWith("image/") ||
      /\.(jpg|jpeg|png|bmp|tiff|webp)$/i.test(filePath)
    ) {
      return this.extractFromImage(filePath);
    }

    console.log(`[PDF] Unsupported file type ${mimetype} — returning empty`);
    return "";
  }

  private async extractFromPdf(filePath: string): Promise<string> {
    const buffer = readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text.replace(/\s+/g, " ").trim();
  }

  private async extractFromImage(filePath: string): Promise<string> {
    try {
      console.log(`[OCR] Running tesseract on ${filePath}…`);
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, { logger: () => {} });
      const { data } = await worker.recognize(filePath);
      await worker.terminate();
      const text = data.text.replace(/\s+/g, " ").trim();
      console.log(`[OCR] Extracted ${text.length} chars from image`);
      return text;
    } catch (err: any) {
      console.error(`[OCR] tesseract failed on ${filePath}: ${err.message}`);
      return "";
    }
  }
}
