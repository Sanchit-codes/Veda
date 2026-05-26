import mongoose, { Schema, Document } from "mongoose";
import type { AssignmentStatus, SectionConfig } from "../types";

export interface IAssignment extends Document {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate?: Date;
  timeAllowed: number;
  instructions?: string;
  additionalInstructions?: string;
  syllabusText?: string;
  status: AssignmentStatus;
  sectionConfigs: SectionConfig[];
  sourceDocIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const sectionConfigSchema = new Schema({
  id: String,
  type: { type: String, enum: ["mcq", "short", "long", "truefalse"] },
  questionCount: { type: Number, default: 5 },
  marksPerQuestion: { type: Number, default: 1 },
  instructions: String,
}, { _id: false });

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    schoolName: { type: String, default: "" },
    dueDate: Date,
    timeAllowed: { type: Number, default: 60 },
    instructions: String,
    additionalInstructions: String,
    syllabusText: String,
    status: {
      type: String,
      enum: ["draft", "generating", "completed", "failed"],
      default: "draft",
    },
    sectionConfigs: [sectionConfigSchema],
    sourceDocIds: [{ type: Schema.Types.ObjectId, ref: "SourceDocument" }],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
