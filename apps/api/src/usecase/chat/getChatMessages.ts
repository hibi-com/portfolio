import type { ChatMessage, ChatRepository } from "~/domain/chat";

export class GetChatMessagesUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(chatRoomId: string, limit?: number, before?: Date): Promise<ChatMessage[]> {
        return this.chatRepository.findMessagesByRoomId(chatRoomId, limit, before);
    }
}
