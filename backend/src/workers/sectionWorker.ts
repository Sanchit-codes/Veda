import { Worker, Job } from "bullmq";
import { config } from "../config";
import { Assignment } from "../models/Assignment";
import { SourceDocument } from "../models/SourceDocument";
import { GeneratedSection } from "../models/GeneratedSection";
import { GenerationJob } from "../models/GenerationJob";
// import { GeminiProvider } from "../services/llm/GeminiProvider"; // kept for reference
import { OllamaProvider } from "../services/llm/OllamaProvider";
import { getWsService } from "../services/websocket/WebSocketService";
import type { SectionJobData } from "../queues/sectionQueue";

const llm = new OllamaProvider();

function ts() {
  return new Date().toISOString();
}

async function processSectionJob(job: Job<SectionJobData>) {
  const { assignmentId, sectionIndex, jobDbId } = job.data;
  const ws = getWsService();
  const label = `[WORKER][${assignmentId.slice(-6)}][sec${sectionIndex}]`;

  console.log(`${ts()} ${label} Job picked up. BullMQ jobId=${job.id}`);

  // ── Load assignment ────────────────────────────────────────────────────
  const t0 = Date.now();
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    console.warn(`${ts()} ${label} Assignment ${assignmentId} not found — skipping stale job`);
    return;
  }
  console.log(`${ts()} ${label} Assignment loaded in ${Date.now() - t0}ms`);

  // Skip stale jobs for assignments that already completed or failed
  if (assignment.status === "completed" || assignment.status === "failed") {
    console.warn(`${ts()} ${label} Assignment already ${assignment.status} — skipping stale job`);
    return;
  }

  // Skip if this section was already completed (stale re-queued job)
  const existingSection = await GeneratedSection.findOne({ assignmentId, sectionIndex });
  if (existingSection?.status === "completed") {
    console.warn(`${ts()} ${label} Section ${sectionIndex} already completed — skipping stale job`);
    return;
  }

  const sectionConfig = assignment.sectionConfigs[sectionIndex];
  if (!sectionConfig) throw new Error(`Section config ${sectionIndex} not found`);
  console.log(`${ts()} ${label} Section config: type=${sectionConfig.type} q=${sectionConfig.questionCount} m=${sectionConfig.marksPerQuestion}`);

  // ── Update job status ──────────────────────────────────────────────────
  await GenerationJob.findByIdAndUpdate(jobDbId, {
    status: "generating",
    currentSectionIndex: sectionIndex,
  });
  ws.emitJobStarted(assignmentId, jobDbId);
  console.log(`${ts()} ${label} Emitted job:started`);

  // ── Load source documents ──────────────────────────────────────────────
  ws.emitThinkingStep(assignmentId, "Reading uploaded source material…");
  const t1 = Date.now();
  const sourceDocs = await SourceDocument.find({ _id: { $in: assignment.sourceDocIds } });
  const sourceText = sourceDocs.map((d) => d.extractedText).join("\n\n---\n\n");
  console.log(`${ts()} ${label} Source docs loaded in ${Date.now() - t1}ms — ${sourceDocs.length} doc(s), ${sourceText.length} chars`);

  // ── Emit source analysis (only on first section so UI shows it once) ───
  if (sectionIndex === 0) {
    const hasContent = sourceText.trim().length > 20;
    const preview = hasContent
      ? sourceText.slice(0, 600).replace(/\s+/g, " ").trim()
      : "";
    ws.emitSourceAnalyzed(assignmentId, {
      docCount: sourceDocs.length,
      totalChars: sourceText.length,
      preview,
      hasContent,
    });
    console.log(`${ts()} ${label} Emitted source:analyzed (hasContent=${hasContent})`);
  }

  // ── Upsert section record ──────────────────────────────────────────────
  const dbSection = await GeneratedSection.findOneAndUpdate(
    { assignmentId, sectionIndex },
    { status: "generating" },
    { upsert: true, new: true }
  );
  console.log(`${ts()} ${label} DB section record ready (id=${dbSection._id})`);

  // ── Call LLM (streaming) ───────────────────────────────────────────────
  const LABELS = ["A", "B", "C", "D", "E", "F"];
  const sectionLabel = LABELS[sectionIndex] ?? String(sectionIndex + 1);
  const TYPE_LABELS: Record<string, string> = {
    mcq: "Multiple Choice Questions",
    short: "Short Answer Questions",
    long: "Long Answer Questions",
    truefalse: "True / False Questions",
  };
  const syllabusHint = assignment.syllabusText?.trim()
    ? ` on topics: ${assignment.syllabusText.slice(0, 80)}…`
    : "";
  ws.emitThinkingStep(
    assignmentId,
    `Designing Section ${sectionLabel}: ${sectionConfig.questionCount} ${TYPE_LABELS[sectionConfig.type] ?? sectionConfig.type}${syllabusHint}`
  );

  if (sourceText.trim().length > 20) {
    ws.emitThinkingStep(assignmentId, `Using ${sourceDocs.length} uploaded document${sourceDocs.length !== 1 ? "s" : ""} as source material (${(sourceText.length / 1000).toFixed(1)}k characters)`);
  } else if (assignment.syllabusText?.trim()) {
    ws.emitThinkingStep(assignmentId, `Using provided syllabus to guide question creation for Class ${assignment.className} ${assignment.subject}`);
  } else {
    ws.emitThinkingStep(assignmentId, `No source document found — generating from standard CBSE/ICSE Class ${assignment.className} ${assignment.subject} curriculum`);
  }

  ws.emitThinkingStep(assignmentId, `Generating ${sectionConfig.questionCount} question${sectionConfig.questionCount !== 1 ? "s" : ""} (${sectionConfig.marksPerQuestion} mark${sectionConfig.marksPerQuestion !== 1 ? "s" : ""} each)…`);

  console.log(`${ts()} ${label} Starting LLM stream call…`);
  const t2 = Date.now();
  let tokenCount = 0;

  const result = await llm.streamSection(
    {
      assignmentId,
      sectionConfig,
      sectionIndex,
      sourceText: sourceText || "No source material provided.",
      metadata: {
        subject: assignment.subject,
        className: assignment.className,
        schoolName: assignment.schoolName,
        instructions: assignment.instructions,
        additionalInstructions: assignment.additionalInstructions,
        syllabusText: assignment.syllabusText,
      },
    },
    {
      onToken: (token) => {
        tokenCount++;
        if (tokenCount === 1) {
          console.log(`${ts()} ${label} First token received after ${Date.now() - t2}ms`);
          ws.emitThinkingStep(assignmentId, "AI model responding…");
        }
        ws.emitSectionStream(assignmentId, sectionIndex, token);
      },
      onComplete: () => {
        console.log(`${ts()} ${label} Stream complete — ${tokenCount} tokens in ${Date.now() - t2}ms`);
      },
      onError: (err) => { throw err; },
    }
  );
  console.log(`${ts()} ${label} LLM returned ${result.questions.length} question(s), parsing done`);

  // ── Enforce teacher-configured marks (LLM often ignores the marks instruction) ─
  const marksPerQuestion = sectionConfig.marksPerQuestion ?? 1;
  if (!sectionConfig.marksPerQuestion) {
    console.warn(`${ts()} ${label} marksPerQuestion missing or zero in saved config — falling back to 1`);
  }
  const enforcedQuestions = result.questions
    .slice(0, sectionConfig.questionCount)   // don't exceed requested count
    .map((q) => ({ ...q, marks: marksPerQuestion }));
  console.log(`${ts()} ${label} Marks enforced: ${marksPerQuestion} per question, ${enforcedQuestions.length} questions`);
  ws.emitThinkingStep(assignmentId, `Validating and saving ${enforcedQuestions.length} question${enforcedQuestions.length !== 1 ? "s" : ""} for Section ${sectionLabel}`);

  // ── Persist section ────────────────────────────────────────────────────
  dbSection.label = sectionLabel;
  dbSection.type = result.type;
  dbSection.instructions = result.instructions;
  dbSection.questions = enforcedQuestions as any;
  dbSection.status = "completed";
  const t3 = Date.now();
  await dbSection.save();
  console.log(`${ts()} ${label} Section saved to DB in ${Date.now() - t3}ms`);

  ws.emitSectionCompleted(assignmentId, dbSection.toObject());
  console.log(`${ts()} ${label} Emitted section:completed`);

  // ── Check if all sections done ─────────────────────────────────────────
  const totalSections = assignment.sectionConfigs.length;
  const completedCount = await GeneratedSection.countDocuments({
    assignmentId,
    status: "completed",
  });
  console.log(`${ts()} ${label} Completed sections: ${completedCount}/${totalSections}`);

  if (completedCount >= totalSections) {
    await Assignment.findByIdAndUpdate(assignmentId, { status: "completed" });
    await GenerationJob.findByIdAndUpdate(jobDbId, { status: "completed", progress: 100 });
    ws.emitJobCompleted(assignmentId);
    console.log(`${ts()} ${label} All sections done — emitted job:completed`);
  } else {
    const progress = Math.round((completedCount / totalSections) * 100);
    await GenerationJob.findByIdAndUpdate(jobDbId, { progress });
    console.log(`${ts()} ${label} Progress updated to ${progress}%`);
  }

  console.log(`${ts()} ${label} Total job time: ${Date.now() - t0}ms`);
}

export function startSectionWorker() {
  console.log(`[WORKER] Starting section worker (concurrency=3, redis=${config.redisUrl})`);

  const worker = new Worker<SectionJobData>(
    "section-generation",
    processSectionJob,
    {
      connection: { url: config.redisUrl },
      concurrency: 3,
      lockDuration: 600_000,   // 10 min — local LLMs can be slow
      lockRenewTime: 120_000,  // renew lock every 2 min while job runs
    }
  );

  worker.on("active", (job) => {
    console.log(`${ts()} [WORKER] Job active: ${job.id} — section ${job.data.sectionIndex}`);
  });

  worker.on("completed", (job) => {
    console.log(`${ts()} [WORKER] Job completed: ${job.id}`);
  });

  worker.on("failed", async (job, err) => {
    if (!job) return;
    const { assignmentId, jobDbId } = job.data;
    console.error(`${ts()} [WORKER] Job FAILED: ${job.id} — ${err.message}`);
    await GenerationJob.findByIdAndUpdate(jobDbId, { status: "failed", error: err.message });
    await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });
    getWsService().emitJobFailed(assignmentId, err.message);
  });

  worker.on("error", (err) => {
    console.error(`${ts()} [WORKER] Worker error:`, err.message);
  });

  worker.on("stalled", (jobId) => {
    console.warn(`${ts()} [WORKER] Job stalled: ${jobId}`);
  });

  return worker;
}
