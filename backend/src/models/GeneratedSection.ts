import mongoose, { Schema, Document } from "mongoose";
import type { QuestionType, Question } from "../types";

export interface IGeneratedSection extends Document {
  assignmentId: mongoose.Types.ObjectId;
  sectionIndex: number;
  label: string;
  type: QuestionType;
  instructions?: string;
  questions: Question[];
  status: "pending" | "generating" | "completed" | "failed";
}

const questionSchema = new Schema({
  _id: { type: String },   // nanoid strings, not ObjectId
  text: { type: String, required: true },
  type: { type: String, enum: ["mcq", "short", "long", "truefalse"] },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  bloomsLevel: {
    type: String,
    enum: ["remember", "understand", "apply", "analyze", "evaluate", "create"],
  },
  marks: { type: Number, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: String,
}, { _id: true });

const generatedSectionSchema = new Schema<IGeneratedSection>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    sectionIndex: { type: Number, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["mcq", "short", "long", "truefalse"] },
    instructions: String,
    questions: [questionSchema],
    status: {
      type: String,
      enum: ["pending", "generating", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const GeneratedSection = mongoose.model<IGeneratedSection>(
  "GeneratedSection",
  generatedSectionSchema
);
