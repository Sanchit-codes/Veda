import { GeneratedSection } from "../models/GeneratedSection";

export async function exportToPDF(section: GeneratedSection): Promise<Buffer> {
  // TODO: implement PDF export using pdfkit or similar
  return Buffer.from("");
}

export async function exportToJSON(section: GeneratedSection): Promise<string> {
  return JSON.stringify(section, null, 2);
}
