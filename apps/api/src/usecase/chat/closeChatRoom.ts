import type { ChatRepository, ChatRoom } from "~/domain/chat";

export class CloseChatRoomUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(id: string): Promise<ChatRoom> {
        return this.chatRepository.closeRoom(id);
    }
}
