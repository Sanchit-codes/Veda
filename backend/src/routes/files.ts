import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";
import { SourceDocument } from "../models/SourceDocument";
import { Assignment } from "../models/Assignment";
import { PdfParser } from "../services/pdf/PdfParser";

const router = Router({ mergeParams: true });
const pdfParser = new PdfParser();

router.post(
  "/",
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    const { id: assignmentId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      return res.status(400).json({ error: "No files uploaded" }) as any;
    }

    const docs = await Promise.all(
      files.map(async (file) => {
        const extractedText = await pdfParser.extractText(file.path, file.mimetype);
        return SourceDocument.create({
          assignmentId,
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          extractedText,
        });
      })
    );

    // Link docs to assignment
    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { sourceDocIds: { $each: docs.map((d) => d._id) } },
    });

    res.status(201).json(docs);
  }
);

export default router;
