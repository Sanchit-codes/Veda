import { io, Socket } from "socket.io-client";
import type { StreamEvent } from "@/types/generation";
import { useGenerationStore } from "@/stores/useGenerationStore";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000", {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.on("connect", () =>
      console.log("[SOCKET] Connected:", socket?.id)
    );
    socket.on("disconnect", (reason) =>
      console.log("[SOCKET] Disconnected:", reason)
    );
    socket.on("connect_error", (err) =>
      console.error("[SOCKET] Connection error:", err.message)
    );
  }
  return socket;
}

export function subscribeToAssignment(assignmentId: string) {
  const sock = getSocket();

  if (!sock.connected) {
    console.log("[SOCKET] Connecting…");
    sock.connect();
  }

  // Remove any previous listener before adding a new one (prevents duplicates on re-subscribe)
  sock.off("event");

  sock.emit("join", assignmentId);
  console.log("[SOCKET] Joined room for assignment:", assignmentId);

  const handler = (event: StreamEvent) => {
    const store = useGenerationStore.getState(); // always get latest state ref

    switch (event.type) {
      case "job:queued":
        console.log("[SOCKET] job:queued", event.jobId);
        store.setJob(event.jobId, assignmentId);
        break;

      case "job:started":
        console.log("[SOCKET] job:started");
        store.setStatus("started");
        break;

      case "section:stream":
        store.setStatus("generating");
        store.appendStream(event.token);
        break;

      case "section:completed":
        console.log("[SOCKET] section:completed — questions:", (event.section as any)?.questions?.length);
        store.addSection(event.section);
        break;

      case "question:regenerated":
        console.log("[SOCKET] question:regenerated in section", event.sectionId);
        store.replaceQuestion(event.sectionId, event.question);
        break;

      case "job:completed":
        console.log("[SOCKET] job:completed — setting status to completed");
        store.setStatus("completed");
        break;

      case "job:failed":
        console.error("[SOCKET] job:failed:", event.error);
        store.setError(event.error);
        break;

      case "pdf:ready":
        console.log("[SOCKET] pdf:ready:", event.url);
        store.setPdfUrl(event.url);
        break;

      case "thinking:step":
        store.addThinkingStep(event.step);
        break;

      case "source:analyzed":
        store.setSourceAnalysis({
          docCount: event.docCount,
          totalChars: event.totalChars,
          preview: event.preview,
          hasContent: event.hasContent,
        });
        break;

      default:
        console.warn("[SOCKET] Unknown event type:", (event as any).type);
    }
  };

  sock.on("event", handler);

  return () => {
    console.log("[SOCKET] Unsubscribing from assignment:", assignmentId);
    sock.off("event", handler);
    sock.emit("leave", assignmentId);
  };
}
