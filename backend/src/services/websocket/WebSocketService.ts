import { Server as HTTPServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { config } from "../../config";

export class WebSocketService {
  private io: SocketServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketServer(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`[WS] Client connected: ${socket.id}`);

      socket.on("join", (assignmentId: string) => {
        socket.join(`assignment:${assignmentId}`);
        console.log(`[WS] Client ${socket.id} joined room assignment:${assignmentId}`);
      });
      socket.on("leave", (assignmentId: string) => {
        socket.leave(`assignment:${assignmentId}`);
        console.log(`[WS] Client ${socket.id} left room assignment:${assignmentId}`);
      });
      socket.on("disconnect", () => {
        console.log(`[WS] Client disconnected: ${socket.id}`);
      });
    });
  }

  emit(assignmentId: string, event: Record<string, unknown>) {
    const room = `assignment:${assignmentId}`;
    const roomSockets = this.io.sockets.adapter.rooms.get(room);
    const listeners = roomSockets?.size ?? 0;
    console.log(`[WS] emit type=${event.type} → room=${room} (${listeners} listener${listeners !== 1 ? "s" : ""})`);
    this.io.to(room).emit("event", event);
  }

  emitJobQueued(assignmentId: string, jobId: string) {
    this.emit(assignmentId, { type: "job:queued", jobId });
  }

  emitJobStarted(assignmentId: string, jobId: string) {
    this.emit(assignmentId, { type: "job:started", jobId });
  }

  emitSectionStream(assignmentId: string, sectionIndex: number, token: string) {
    // Don't log every token — only every 50th to avoid noise
    this.io.to(`assignment:${assignmentId}`).emit("event", { type: "section:stream", sectionIndex, token });
  }

  emitSectionCompleted(assignmentId: string, section: unknown) {
    this.emit(assignmentId, { type: "section:completed", section });
  }

  emitQuestionRegenerated(assignmentId: string, sectionId: string, question: unknown) {
    this.emit(assignmentId, { type: "question:regenerated", sectionId, question });
  }

  emitJobCompleted(assignmentId: string) {
    this.emit(assignmentId, { type: "job:completed" });
  }

  emitJobFailed(assignmentId: string, error: string) {
    console.error(`[WS] emitJobFailed — ${error}`);
    this.emit(assignmentId, { type: "job:failed", error });
  }

  emitPdfReady(assignmentId: string, url: string) {
    this.emit(assignmentId, { type: "pdf:ready", url });
  }

  emitSourceAnalyzed(assignmentId: string, payload: { docCount: number; totalChars: number; preview: string; hasContent: boolean }) {
    this.emit(assignmentId, { type: "source:analyzed", ...payload });
  }

  emitThinkingStep(assignmentId: string, step: string) {
    this.emit(assignmentId, { type: "thinking:step", step });
  }
}

let wsService: WebSocketService | null = null;

export function initWebSocket(httpServer: HTTPServer): WebSocketService {
  wsService = new WebSocketService(httpServer);
  return wsService;
}

export function getWsService(): WebSocketService {
  if (!wsService) throw new Error("WebSocketService not initialized");
  return wsService;
}
