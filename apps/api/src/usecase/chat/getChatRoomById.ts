import type { ChatRepository, ChatRoomWithParticipants } from "~/domain/chat";

export class GetChatRoomByIdUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(id: string): Promise<ChatRoomWithParticipants | null> {
        return this.chatRepository.findRoomById(id);
    }
}
