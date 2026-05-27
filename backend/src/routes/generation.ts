import { Router, Request, Response } from "express";
import { Assignment } from "../models/Assignment";
import { GenerationJob } from "../models/GenerationJob";
import { GeneratedSection } from "../models/GeneratedSection";
import { SourceDocument } from "../models/SourceDocument";
import { sectionQueue } from "../queues/sectionQueue";
import { getWsService } from "../services/websocket/WebSocketService";
// import { GeminiProvider } from "../services/llm/GeminiProvider"; // kept for reference
import { OllamaProvider } from "../services/llm/OllamaProvider";

const router = Router({ mergeParams: true });
const llm = new OllamaProvider();

// Trigger generation
router.post("/", async (req: Request, res: Response) => {
  const { id: assignmentId } = req.params;
  console.log(`[ROUTE] POST /generate called for assignmentId=${assignmentId}`);

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    console.log(`[ROUTE] Assignment ${assignmentId} not found`);
    return res.status(404).json({ error: "Assignment not found" }) as any;
  }
  console.log(`[ROUTE] Assignment found: title="${assignment.title}", sections=${assignment.sectionConfigs.length}`);

  // Create job record
  const job = await GenerationJob.create({
    assignmentId,
    status: "queued",
    totalSections: assignment.sectionConfigs.length,
    progress: 0,
  });
  console.log(`[ROUTE] GenerationJob created: jobId=${job._id}`);

  await Assignment.findByIdAndUpdate(assignmentId, { status: "generating" });

  // Queue one job per section
  for (let i = 0; i < assignment.sectionConfigs.length; i++) {
    const cfg = assignment.sectionConfigs[i];
    console.log(`[ROUTE] Queuing section ${i}: type=${cfg.type}, questions=${cfg.questionCount}, marks=${cfg.marksPerQuestion}`);
    await sectionQueue.add(
      `section-${assignmentId}-${i}`,
      { assignmentId, sectionIndex: i, jobDbId: String(job._id) },
      { priority: i }
    );
  }
  console.log(`[ROUTE] All ${assignment.sectionConfigs.length} section(s) queued. Emitting job:queued`);

  getWsService().emitJobQueued(assignmentId, String(job._id));
  res.status(202).json({ jobId: String(job._id) });
});

// Job status
router.get("/status", async (req: Request, res: Response) => {
  const { id: assignmentId } = req.params;
  const job = await GenerationJob.findOne({ assignmentId }).sort({ createdAt: -1 });
  if (!job) return res.status(404).json({ error: "No job found" }) as any;
  res.json(job);
});

// Regenerate single question
router.post(
  "/sections/:sectionId/questions/:questionId/regenerate",
  async (req: Request, res: Response) => {
    const { id: assignmentId, sectionId, questionId } = req.params;
    console.log(`[ROUTE] Regenerate question=${questionId} in section=${sectionId}`);

    const [assignment, section] = await Promise.all([
      Assignment.findById(assignmentId),
      GeneratedSection.findById(sectionId),
    ]);
    if (!assignment || !section)
      return res.status(404).json({ error: "Not found" }) as any;

    const question = section.questions.find((q: any) => String(q._id) === questionId);
    if (!question) return res.status(404).json({ error: "Question not found" }) as any;

    const sourceDocs = await SourceDocument.find({ _id: { $in: assignment.sourceDocIds } });
    const sourceText = sourceDocs.map((d) => d.extractedText).join("\n\n---\n\n");
    console.log(`[ROUTE] Regenerating with sourceText length=${sourceText.length}`);

    const newQuestion = await llm.regenerateQuestion({
      question: question as any,
      sourceText,
      metadata: {
        subject: assignment.subject,
        className: assignment.className,
        schoolName: assignment.schoolName,
      },
    });
    console.log(`[ROUTE] Regenerated question: "${newQuestion.text.slice(0, 60)}..."`);

    const idx = section.questions.findIndex((q: any) => String(q._id) === questionId);
    (section.questions as any)[idx] = { ...newQuestion };
    await section.save();

    getWsService().emitQuestionRegenerated(assignmentId, sectionId, newQuestion);
    res.json(newQuestion);
  }
);

export default router;
