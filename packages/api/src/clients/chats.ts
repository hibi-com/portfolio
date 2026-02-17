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

const getClient = () => getChats();

export const listChatRooms = (params?: ChatsListChatRoomsParams): Promise<ChatsListChatRooms200> => {
    return getClient().chatsListChatRooms(params);
};

export const getChatRoomById = (id: string): Promise<ChatRoomWithParticipants> => {
    return getClient().chatsGetChatRoomById(id);
};

export const createChatRoom = (input: CreateChatRoomInput): Promise<ChatRoom> => {
    return getClient().chatsCreateChatRoom(input);
};

export const closeChatRoom = (id: string): Promise<ChatRoom> => {
    return getClient().chatsCloseChatRoom(id);
};

export const getChatRoomParticipants = (id: string): Promise<ChatParticipant[]> => {
    return getClient().chatsGetChatRoomParticipants(id);
};

export const addChatParticipant = (id: string, input: AddParticipantInput): Promise<ChatParticipant> => {
    return getClient().chatsAddChatParticipant(id, input);
};

export const removeChatParticipant = (roomId: string, participantId: string): Promise<void> => {
    return getClient().chatsRemoveChatParticipant(roomId, participantId);
};

export const getChatRoomMessages = (id: string, params?: ChatsGetChatRoomMessagesParams): Promise<ChatMessage[]> => {
    return getClient().chatsGetChatRoomMessages(id, params);
};

export const sendChatMessage = (id: string, input: SendMessageInput): Promise<ChatMessage> => {
    return getClient().chatsSendChatMessage(id, input);
};

export const markMessagesAsRead = (
    roomId: string,
    participantId: string,
    body: ChatsMarkMessagesAsReadBody,
): Promise<void> => {
    return getClient().chatsMarkMessagesAsRead(roomId, body, { participantId });
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
