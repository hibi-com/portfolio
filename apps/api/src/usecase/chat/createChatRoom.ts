import type { ChatRepository, ChatRoom, CreateChatRoomInput } from "~/domain/chat";

export class CreateChatRoomUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(input: CreateChatRoomInput): Promise<ChatRoom> {
        return this.chatRepository.createRoom(input);
    }
}
