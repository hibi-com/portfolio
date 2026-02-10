import "@typespec/http";
import "@typespec/openapi3";
import "../models/chat.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Chats")
@route("/api")
namespace Api.Chats {
    @get
    @route("/chat/rooms")
    @summary("Get all chat rooms")
    op listChatRooms(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: ChatRoomStatus,
        @query customerId?: string,
    ): ChatRoom[] | PaginatedResponse<ChatRoom>;

    @get
    @route("/chat/rooms/{id}")
    @summary("Get a chat room by ID")
    op getChatRoomById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: ChatRoomWithParticipants;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/chat/rooms")
    @summary("Create a new chat room")
    op createChatRoom(@body body: CreateChatRoomInput): {
        @statusCode statusCode: 201;
        @body body: ChatRoom;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @post
    @route("/chat/rooms/{id}/close")
    @summary("Close a chat room")
    op closeChatRoom(@path id: string): {
        @statusCode statusCode: 200;
        @body body: ChatRoom;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @get
    @route("/chat/rooms/{id}/participants")
    @summary("Get participants in a chat room")
    op getChatRoomParticipants(@path id: string): ChatParticipant[];

    @post
    @route("/chat/rooms/{id}/participants")
    @summary("Add a participant to a chat room")
    op addChatParticipant(@path id: string, @body body: AddParticipantInput): {
        @statusCode statusCode: 201;
        @body body: ChatParticipant;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @delete
    @route("/chat/rooms/{roomId}/participants/{participantId}")
    @summary("Remove a participant from a chat room")
    op removeChatParticipant(@path roomId: string, @path participantId: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @get
    @route("/chat/rooms/{id}/messages")
    @summary("Get messages in a chat room")
    op getChatRoomMessages(
        @path id: string,
        @query limit?: int32,
        @query before?: string,
    ): ChatMessage[];

    @post
    @route("/chat/rooms/{id}/messages")
    @summary("Send a message in a chat room")
    op sendChatMessage(@path id: string, @body body: SendMessageInput): {
        @statusCode statusCode: 201;
        @body body: ChatMessage;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @post
    @route("/chat/rooms/{roomId}/messages/read")
    @summary("Mark messages as read")
    op markMessagesAsRead(
        @path roomId: string,
        @query participantId: string,
        @body body: { messageIds: string[] },
    ): {
        @statusCode statusCode: 200;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };
}
