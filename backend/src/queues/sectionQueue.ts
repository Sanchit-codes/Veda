import { Queue } from "bullmq";
import { config } from "../config";

export interface SectionJobData {
  assignmentId: string;
  sectionIndex: number;
  jobDbId: string;
}

export const sectionQueue = new Queue<SectionJobData>("section-generation", {
  connection: { url: config.redisUrl },
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});
