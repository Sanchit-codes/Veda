import { Router, Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { GeneratedSection } from "../models/GeneratedSection";

const router = Router();

// List
router.get("/", async (_req: Request, res: Response) => {
  const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
  const ids = assignments.map((a) => a._id);
  const sections = await GeneratedSection.find({
    assignmentId: { $in: ids },
    status: "completed",
  }).lean();

  const result = assignments.map((a) => {
    const aId = String(a._id);
    const aSections = sections.filter((s) => String(s.assignmentId) === aId);
    const totalMarks = aSections.reduce(
      (sum, s) => sum + s.questions.reduce((qs, q) => qs + q.marks, 0),
      0
    );
    return {
      ...a,
      sectionCount: aSections.length,
      totalMarks,
    };
  });
  res.json(result);
});

// Create
router.post("/", async (req: Request, res: Response) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

// Get one with sections
router.get("/:id", async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id).lean();
  if (!assignment) return res.status(404).json({ error: "Not found" }) as any;

  const sections = await GeneratedSection.find({
    assignmentId: req.params.id,
  })
    .sort({ sectionIndex: 1 })
    .lean();

  res.json({ ...assignment, sections });
});

// Update
router.patch("/:id", async (req: Request, res: Response) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!assignment) return res.status(404).json({ error: "Not found" }) as any;
  res.json(assignment);
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
  await Assignment.findByIdAndDelete(req.params.id);
  await GeneratedSection.deleteMany({ assignmentId: req.params.id });
  res.status(204).send();
});

// Edit a question
router.patch(
  "/:id/sections/:sectionId/questions/:questionId",
  async (req: Request, res: Response) => {
    const section = await GeneratedSection.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" }) as any;

    const q = section.questions.find(
      (q: any) => String(q._id) === req.params.questionId
    );
    if (!q) return res.status(404).json({ error: "Question not found" }) as any;

    Object.assign(q, req.body);
    await section.save();
    res.json(q);
  }
);

export default router;
