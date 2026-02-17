import type { WebSocket as CFWebSocket, DurableObjectState } from "@cloudflare/workers-types";

interface ChatSession {
    webSocket: CFWebSocket;
    participantId: string;
    participantName: string;
    joinedAt: Date;
}

interface ChatMessagePayload {
    type: "message" | "join" | "leave" | "typing" | "read";
    participantId: string;
    participantName: string;
    content?: string;
    messageId?: string;
    timestamp: string;
}

interface StoredMessage {
    id: string;
    participantId: string;
    participantName: string;
    content: string;
    timestamp: string;
}

export class ChatRoomDO {
    private readonly state: DurableObjectState;
    private readonly sessions: Map<CFWebSocket, ChatSession>;

    constructor(state: DurableObjectState) {
        this.state = state;
        this.sessions = new Map();

        this.state.getWebSockets().forEach((ws) => {
            const attachment = ws.deserializeAttachment() as ChatSession | null;
            if (attachment) {
                this.sessions.set(ws, attachment);
            }
        });
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/websocket") {
            if (request.headers.get("Upgrade") !== "websocket") {
                return new Response("Expected WebSocket upgrade", { status: 426 });
            }

            const participantId = url.searchParams.get("participantId");
            const participantName = url.searchParams.get("participantName") || "Anonymous";
            const roomId = url.searchParams.get("roomId");

            if (!participantId) {
                return new Response("participantId is required", { status: 400 });
            }

            if (!roomId) {
                return new Response("roomId is required", { status: 400 });
            }

            const pair = new WebSocketPair();
            const [client, server] = [pair[0], pair[1]];

            const session: ChatSession = {
                webSocket: server as unknown as CFWebSocket,
                participantId,
                participantName,
                joinedAt: new Date(),
            };

            this.state.acceptWebSocket(server as unknown as CFWebSocket);
            (server as unknown as CFWebSocket).serializeAttachment(session);
            this.sessions.set(server as unknown as CFWebSocket, session);

            this.broadcast({
                type: "join",
                participantId,
                participantName,
                timestamp: new Date().toISOString(),
            });

            return new Response(null, {
                status: 101,
                webSocket: client as unknown as WebSocket,
            });
        }

        if (url.pathname === "/history") {
            const messages = await this.getRecentMessages(50);
            return new Response(JSON.stringify(messages), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (url.pathname === "/participants") {
            const participants = Array.from(this.sessions.values()).map((session) => ({
                participantId: session.participantId,
                participantName: session.participantName,
                joinedAt: session.joinedAt.toISOString(),
            }));
            return new Response(JSON.stringify(participants), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("Not found", { status: 404 });
    }

    async webSocketMessage(ws: CFWebSocket, message: string | ArrayBuffer): Promise<void> {
        const session = this.sessions.get(ws);
        if (!session) return;

        try {
            const data = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message)) as {
                type: string;
                content?: string;
                messageId?: string;
            };

            switch (data.type) {
                case "message":
                    if (data.content) {
                        const messageId = crypto.randomUUID();
                        const timestamp = new Date().toISOString();

                        await this.storeMessage({
                            id: messageId,
                            participantId: session.participantId,
                            participantName: session.participantName,
                            content: data.content,
                            timestamp,
                        });

                        this.broadcast({
                            type: "message",
                            participantId: session.participantId,
                            participantName: session.participantName,
                            content: data.content,
                            messageId,
                            timestamp,
                        });
                    }
                    break;

                case "typing":
                    this.broadcastExcept(ws, {
                        type: "typing",
                        participantId: session.participantId,
                        participantName: session.participantName,
                        timestamp: new Date().toISOString(),
                    });
                    break;

                case "read":
                    if (data.messageId) {
                        this.broadcast({
                            type: "read",
                            participantId: session.participantId,
                            participantName: session.participantName,
                            messageId: data.messageId,
                            timestamp: new Date().toISOString(),
                        });
                    }
                    break;
            }
        } catch {
            ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
        }
    }

    async webSocketClose(ws: CFWebSocket, _code: number, _reason: string): Promise<void> {
        const session = this.sessions.get(ws);
        if (session) {
            this.broadcast({
                type: "leave",
                participantId: session.participantId,
                participantName: session.participantName,
                timestamp: new Date().toISOString(),
            });
            this.sessions.delete(ws);
        }
    }

    async webSocketError(ws: CFWebSocket, error: unknown): Promise<void> {
        const session = this.sessions.get(ws);
        if (session) {
            console.error(`WebSocket error for participant ${session.participantId}:`, error);
            this.sessions.delete(ws);
        }
    }

    private broadcast(payload: ChatMessagePayload): void {
        const message = JSON.stringify(payload);
        for (const [ws] of this.sessions) {
            try {
                ws.send(message);
            } catch {
                this.sessions.delete(ws);
            }
        }
    }

    private broadcastExcept(excludeWs: CFWebSocket, payload: ChatMessagePayload): void {
        const message = JSON.stringify(payload);
        for (const [ws] of this.sessions) {
            if (ws !== excludeWs) {
                try {
                    ws.send(message);
                } catch {
                    this.sessions.delete(ws);
                }
            }
        }
    }

    private async storeMessage(message: StoredMessage): Promise<void> {
        const messages = (await this.state.storage.get<StoredMessage[]>("messages")) || [];
        messages.push(message);

        if (messages.length > 1000) {
            messages.splice(0, messages.length - 1000);
        }

        await this.state.storage.put("messages", messages);
    }

    private async getRecentMessages(limit: number): Promise<StoredMessage[]> {
        const messages = (await this.state.storage.get<StoredMessage[]>("messages")) || [];
        return messages.slice(-limit);
    }
}
