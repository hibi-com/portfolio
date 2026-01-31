import type { AddParticipantInput, ChatParticipant, ChatRepository } from "~/domain/chat";

export class AddChatParticipantUseCase {
    constructor(private readonly chatRepository: ChatRepository) {}

    async execute(input: AddParticipantInput): Promise<ChatParticipant> {
        return this.chatRepository.addParticipant(input);
    }
}
