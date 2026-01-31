import type { ChatMessage, ChatRepository, SendMessageInput } from "~/domain/chat";

export class SendChatMessageUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(input: SendMessageInput): Promise<ChatMessage> {
        return this.chatRepository.createMessage(input);
    }
}
