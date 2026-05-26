import mongoose, { Schema, Document } from "mongoose";

export interface ISourceDocument extends Document {
  assignmentId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  extractedText: string;
  uploadedAt: Date;
}

const sourceDocSchema = new Schema<ISourceDocument>({
  assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: Number,
  extractedText: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now },
});

export const SourceDocument = mongoose.model<ISourceDocument>("SourceDocument", sourceDocSchema);
