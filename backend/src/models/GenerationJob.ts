import mongoose, { Schema, Document } from "mongoose";

export interface IGenerationJob extends Document {
  assignmentId: mongoose.Types.ObjectId;
  status: "queued" | "started" | "generating" | "completed" | "failed";
  progress: number;
  currentSectionIndex: number;
  totalSections: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const generationJobSchema = new Schema<IGenerationJob>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    status: {
      type: String,
      enum: ["queued", "started", "generating", "completed", "failed"],
      default: "queued",
    },
    progress: { type: Number, default: 0 },
    currentSectionIndex: { type: Number, default: 0 },
    totalSections: { type: Number, required: true },
    error: String,
  },
  { timestamps: true }
);

export const GenerationJob = mongoose.model<IGenerationJob>("GenerationJob", generationJobSchema);
