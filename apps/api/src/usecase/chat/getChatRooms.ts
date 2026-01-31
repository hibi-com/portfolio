import type { ChatRepository, ChatRoom } from "~/domain/chat";

export class GetChatRoomsUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(): Promise<ChatRoom[]> {
        return this.chatRepository.findAllRooms();
    }
}
