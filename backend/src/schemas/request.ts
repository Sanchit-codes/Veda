import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  className: z.string().min(1),
  schoolName: z.string(),
  sectionConfigs: z.array(z.object({
    type: z.enum(["mcq", "short", "long", "truefalse"]),
    questionCount: z.number().min(1),
    marksPerQuestion: z.number().min(1),
  })),
});
