import type {
    AddParticipantInput,
    ChatMessage,
    ChatParticipant,
    ChatRoom,
    ChatRoomWithParticipants,
    ChatsGetChatRoomMessagesParams,
    ChatsListChatRooms200,
    ChatsListChatRoomsParams,
    ChatsMarkMessagesAsReadBody,
    CreateChatRoomInput,
    SendMessageInput,
} from "@generated/api.schemas";
import { getChats } from "@generated/chats/chats";

const chatsClient = getChats();

export const listChatRooms = (params?: ChatsListChatRoomsParams): Promise<ChatsListChatRooms200> => {
    return chatsClient.chatsListChatRooms(params);
};

export const getChatRoomById = (id: string): Promise<ChatRoomWithParticipants> => {
    return chatsClient.chatsGetChatRoomById(id);
};

export const createChatRoom = (input: CreateChatRoomInput): Promise<ChatRoom> => {
    return chatsClient.chatsCreateChatRoom(input);
};

export const closeChatRoom = (id: string): Promise<ChatRoom> => {
    return chatsClient.chatsCloseChatRoom(id);
};

export const getChatRoomParticipants = (id: string): Promise<ChatParticipant[]> => {
    return chatsClient.chatsGetChatRoomParticipants(id);
};

export const addChatParticipant = (id: string, input: AddParticipantInput): Promise<ChatParticipant> => {
    return chatsClient.chatsAddChatParticipant(id, input);
};

export const removeChatParticipant = (roomId: string, participantId: string): Promise<void> => {
    return chatsClient.chatsRemoveChatParticipant(roomId, participantId);
};

export const getChatRoomMessages = (id: string, params?: ChatsGetChatRoomMessagesParams): Promise<ChatMessage[]> => {
    return chatsClient.chatsGetChatRoomMessages(id, params);
};

export const sendChatMessage = (id: string, input: SendMessageInput): Promise<ChatMessage> => {
    return chatsClient.chatsSendChatMessage(id, input);
};

export const markMessagesAsRead = (
    roomId: string,
    participantId: string,
    body: ChatsMarkMessagesAsReadBody,
): Promise<void> => {
    return chatsClient.chatsMarkMessagesAsRead(roomId, body, { participantId });
};

export const chats = {
    listRooms: listChatRooms,
    getRoomById: getChatRoomById,
    createRoom: createChatRoom,
    closeRoom: closeChatRoom,
    getParticipants: getChatRoomParticipants,
    addParticipant: addChatParticipant,
    removeParticipant: removeChatParticipant,
    getMessages: getChatRoomMessages,
    sendMessage: sendChatMessage,
    markAsRead: markMessagesAsRead,
} as const;
