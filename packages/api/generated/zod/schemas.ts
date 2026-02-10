import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ChatRoomStatus = z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]);
const ChatRoom = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        inquiryId: z.string().optional(),
        name: z.string().optional(),
        status: ChatRoomStatus,
        metadata: z.object({}).partial().passthrough().optional(),
        closedAt: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const PaginationMeta = z
    .object({
        page: z.number().int(),
        perPage: z.number().int(),
        total: z.number().int(),
        totalPages: z.number().int(),
    })
    .passthrough();
const CreateChatRoomInput = z
    .object({
        customerId: z.string(),
        inquiryId: z.string(),
        name: z.string(),
        metadata: z.object({}).partial().passthrough(),
    })
    .partial()
    .passthrough();
const ErrorResponse = z.object({ error: z.string(), details: z.unknown().optional() }).passthrough();
const ChatParticipantRole = z.enum(["CUSTOMER", "AGENT", "OBSERVER"]);
const ChatParticipant = z
    .object({
        id: z.string(),
        chatRoomId: z.string(),
        userId: z.string().optional(),
        name: z.string(),
        role: ChatParticipantRole,
        isOnline: z.boolean(),
        lastSeenAt: z.string().optional(),
        joinedAt: z.string(),
        leftAt: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const ChatRoomWithParticipants = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        inquiryId: z.string().optional(),
        name: z.string().optional(),
        status: ChatRoomStatus,
        metadata: z.object({}).partial().passthrough().optional(),
        closedAt: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
        participants: z.array(ChatParticipant),
    })
    .passthrough();
const ChatMessageType = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);
const ChatMessage = z
    .object({
        id: z.string(),
        chatRoomId: z.string(),
        participantId: z.string(),
        type: ChatMessageType,
        content: z.string(),
        metadata: z.object({}).partial().passthrough().optional(),
        readBy: z.array(z.string()).optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const SendMessageInput = z
    .object({
        chatRoomId: z.string(),
        participantId: z.string(),
        type: ChatMessageType.optional(),
        content: z.string(),
        metadata: z.object({}).partial().passthrough().optional(),
    })
    .passthrough();
const AddParticipantInput = z
    .object({
        chatRoomId: z.string(),
        userId: z.string().optional(),
        name: z.string(),
        role: ChatParticipantRole.optional(),
    })
    .passthrough();
const Chats_markMessagesAsRead_Body = z.object({ messageIds: z.array(z.string()) }).passthrough();
const CustomerStatus = z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"]);
const Customer = z
    .object({
        id: z.string(),
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        status: CustomerStatus,
        tags: z.array(z.string()).optional(),
        customFields: z.object({}).partial().passthrough().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateCustomerInput = z
    .object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        status: CustomerStatus.optional(),
        tags: z.array(z.string()).optional(),
        customFields: z.object({}).partial().passthrough().optional(),
    })
    .passthrough();
const UpdateCustomerInput = z
    .object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        company: z.string(),
        website: z.string(),
        address: z.string(),
        notes: z.string(),
        status: CustomerStatus,
        tags: z.array(z.string()),
        customFields: z.object({}).partial().passthrough(),
    })
    .partial()
    .passthrough();
const DealStatus = z.enum(["OPEN", "WON", "LOST", "STALLED"]);
const Deal = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        leadId: z.string().optional(),
        stageId: z.string(),
        name: z.string(),
        value: z.number().optional(),
        currency: z.string(),
        expectedCloseDate: z.string().optional(),
        actualCloseDate: z.string().optional(),
        status: DealStatus,
        notes: z.string().optional(),
        lostReason: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateDealInput = z
    .object({
        customerId: z.string().optional(),
        leadId: z.string().optional(),
        stageId: z.string(),
        name: z.string(),
        value: z.number().optional(),
        currency: z.string().optional(),
        expectedCloseDate: z.string().optional(),
        status: DealStatus.optional(),
        notes: z.string().optional(),
    })
    .passthrough();
const UpdateDealInput = z
    .object({
        customerId: z.string(),
        stageId: z.string(),
        name: z.string(),
        value: z.number(),
        currency: z.string(),
        expectedCloseDate: z.string(),
        actualCloseDate: z.string(),
        status: DealStatus,
        notes: z.string(),
        lostReason: z.string(),
    })
    .partial()
    .passthrough();
const LeadStatus = z.enum(["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED"]);
const Lead = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        source: z.string().optional(),
        status: LeadStatus,
        score: z.number().int().optional(),
        notes: z.string().optional(),
        convertedAt: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateLeadInput = z
    .object({
        customerId: z.string().optional(),
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        source: z.string().optional(),
        status: LeadStatus.optional(),
        score: z.number().int().optional(),
        notes: z.string().optional(),
    })
    .passthrough();
const UpdateLeadInput = z
    .object({
        customerId: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        company: z.string(),
        source: z.string(),
        status: LeadStatus,
        score: z.number().int(),
        notes: z.string(),
    })
    .partial()
    .passthrough();
const PipelineStage = z
    .object({
        id: z.string(),
        pipelineId: z.string(),
        name: z.string(),
        order: z.number().int(),
        probability: z.number().optional(),
        color: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const Pipeline = z
    .object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        isDefault: z.boolean(),
        stages: z.array(PipelineStage),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreatePipelineInput = z
    .object({
        name: z.string(),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
    })
    .passthrough();
const UpdatePipelineInput = z
    .object({ name: z.string(), description: z.string(), isDefault: z.boolean() })
    .partial()
    .passthrough();
const CreatePipelineStageInput = z
    .object({
        pipelineId: z.string(),
        name: z.string(),
        order: z.number().int(),
        probability: z.number().optional(),
        color: z.string().optional(),
    })
    .passthrough();
const UpdatePipelineStageInput = z
    .object({
        name: z.string(),
        order: z.number().int(),
        probability: z.number(),
        color: z.string(),
    })
    .partial()
    .passthrough();
const EmailStatus = z.enum(["PENDING", "SENT", "DELIVERED", "BOUNCED", "FAILED"]);
const EmailLog = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        templateId: z.string().optional(),
        resendId: z.string().optional(),
        fromEmail: z.string(),
        toEmail: z.string(),
        ccEmail: z.string().optional(),
        bccEmail: z.string().optional(),
        subject: z.string(),
        htmlContent: z.string().optional(),
        textContent: z.string().optional(),
        status: EmailStatus,
        errorMessage: z.string().optional(),
        sentAt: z.string().optional(),
        deliveredAt: z.string().optional(),
        openedAt: z.string().optional(),
        clickedAt: z.string().optional(),
        bouncedAt: z.string().optional(),
        metadata: z.object({}).partial().passthrough().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const SendEmailInput = z
    .object({
        customerId: z.string().optional(),
        templateId: z.string().optional(),
        fromEmail: z.string().optional(),
        toEmail: z.string(),
        ccEmail: z.string().optional(),
        bccEmail: z.string().optional(),
        subject: z.string(),
        htmlContent: z.string().optional(),
        textContent: z.string().optional(),
        variables: z.record(z.string()).optional(),
        metadata: z.object({}).partial().passthrough().optional(),
    })
    .passthrough();
const Emails_sendEmailWithTemplate_Body = z
    .object({ variables: z.record(z.string()) })
    .partial()
    .passthrough();
const EmailTemplateCategory = z.enum(["MARKETING", "TRANSACTIONAL", "SUPPORT", "NOTIFICATION"]);
const EmailTemplate = z
    .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        category: EmailTemplateCategory,
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isActive: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateEmailTemplateInput = z
    .object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        category: EmailTemplateCategory.optional(),
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    })
    .passthrough();
const UpdateEmailTemplateInput = z
    .object({
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        category: EmailTemplateCategory,
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string(),
        variables: z.array(z.string()),
        isActive: z.boolean(),
    })
    .partial()
    .passthrough();
const PortfolioContent = z.object({ html: z.string() }).passthrough();
const Asset = z.object({ url: z.string() }).passthrough();
const Portfolio = z
    .object({
        id: z.string().optional(),
        title: z.string(),
        slug: z.string(),
        company: z.string(),
        date: z.string(),
        current: z.boolean(),
        overview: z.string().optional(),
        description: z.string().optional(),
        content: PortfolioContent.optional(),
        thumbnailTemp: z.string().optional(),
        images: z.array(Asset).optional(),
        intro: z.string().optional(),
    })
    .passthrough();
const PostContent = z.object({ html: z.string(), raw: z.unknown().optional() }).passthrough();
const Post = z
    .object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        description: z.string().optional(),
        content: PostContent,
        imageTemp: z.string(),
        tags: z.array(z.string()),
        sticky: z.boolean(),
        intro: z.string().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
        images: z.array(Asset).optional(),
    })
    .passthrough();
const InquiryStatus = z.enum(["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"]);
const InquiryPriority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const InquiryCategory = z.enum(["GENERAL", "TECHNICAL", "BILLING", "SALES", "COMPLAINT", "FEATURE_REQUEST", "OTHER"]);
const Inquiry = z
    .object({
        id: z.string(),
        customerId: z.string().optional(),
        assigneeId: z.string().optional(),
        subject: z.string(),
        content: z.string(),
        status: InquiryStatus,
        priority: InquiryPriority,
        category: InquiryCategory,
        tags: z.array(z.string()).optional(),
        source: z.string().optional(),
        metadata: z.object({}).partial().passthrough().optional(),
        resolvedAt: z.string().optional(),
        closedAt: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateInquiryInput = z
    .object({
        customerId: z.string().optional(),
        assigneeId: z.string().optional(),
        subject: z.string(),
        content: z.string(),
        status: InquiryStatus.optional(),
        priority: InquiryPriority.optional(),
        category: InquiryCategory.optional(),
        tags: z.array(z.string()).optional(),
        source: z.string().optional(),
        metadata: z.object({}).partial().passthrough().optional(),
    })
    .passthrough();
const UpdateInquiryInput = z
    .object({
        customerId: z.string(),
        assigneeId: z.string(),
        subject: z.string(),
        content: z.string(),
        status: InquiryStatus,
        priority: InquiryPriority,
        category: InquiryCategory,
        tags: z.array(z.string()),
        source: z.string(),
        metadata: z.object({}).partial().passthrough(),
    })
    .partial()
    .passthrough();
const InquiryResponse = z
    .object({
        id: z.string(),
        inquiryId: z.string(),
        userId: z.string().optional(),
        content: z.string(),
        isInternal: z.boolean(),
        attachments: z.array(z.string()).optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough();
const CreateInquiryResponseInput = z
    .object({
        inquiryId: z.string(),
        userId: z.string().optional(),
        content: z.string(),
        isInternal: z.boolean().optional(),
        attachments: z.array(z.string()).optional(),
    })
    .passthrough();

export const schemas = {
    ChatRoomStatus,
    ChatRoom,
    PaginationMeta,
    CreateChatRoomInput,
    ErrorResponse,
    ChatParticipantRole,
    ChatParticipant,
    ChatRoomWithParticipants,
    ChatMessageType,
    ChatMessage,
    SendMessageInput,
    AddParticipantInput,
    Chats_markMessagesAsRead_Body,
    CustomerStatus,
    Customer,
    CreateCustomerInput,
    UpdateCustomerInput,
    DealStatus,
    Deal,
    CreateDealInput,
    UpdateDealInput,
    LeadStatus,
    Lead,
    CreateLeadInput,
    UpdateLeadInput,
    PipelineStage,
    Pipeline,
    CreatePipelineInput,
    UpdatePipelineInput,
    CreatePipelineStageInput,
    UpdatePipelineStageInput,
    EmailStatus,
    EmailLog,
    SendEmailInput,
    Emails_sendEmailWithTemplate_Body,
    EmailTemplateCategory,
    EmailTemplate,
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
    PortfolioContent,
    Asset,
    Portfolio,
    PostContent,
    Post,
    InquiryStatus,
    InquiryPriority,
    InquiryCategory,
    Inquiry,
    CreateInquiryInput,
    UpdateInquiryInput,
    InquiryResponse,
    CreateInquiryResponseInput,
};

const endpoints = makeApi([
    {
        method: "get",
        path: "/api/chat/rooms",
        alias: "Chats_listChatRooms",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]).optional(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([
            z.array(ChatRoom),
            z.object({ data: z.array(ChatRoom), meta: PaginationMeta }).passthrough(),
        ]),
    },
    {
        method: "post",
        path: "/api/chat/rooms",
        alias: "Chats_createChatRoom",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateChatRoomInput,
            },
        ],
        response: ChatRoom,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/chat/rooms/:id",
        alias: "Chats_getChatRoomById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: ChatRoomWithParticipants,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/chat/rooms/:id/close",
        alias: "Chats_closeChatRoom",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: ChatRoom,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/chat/rooms/:id/messages",
        alias: "Chats_getChatRoomMessages",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "limit",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "before",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.array(ChatMessage),
    },
    {
        method: "post",
        path: "/api/chat/rooms/:id/messages",
        alias: "Chats_sendChatMessage",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: SendMessageInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: ChatMessage,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/chat/rooms/:id/participants",
        alias: "Chats_getChatRoomParticipants",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.array(ChatParticipant),
    },
    {
        method: "post",
        path: "/api/chat/rooms/:id/participants",
        alias: "Chats_addChatParticipant",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: AddParticipantInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: ChatParticipant,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/chat/rooms/:roomId/messages/read",
        alias: "Chats_markMessagesAsRead",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: Chats_markMessagesAsRead_Body,
            },
            {
                name: "roomId",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "participantId",
                type: "Query",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/chat/rooms/:roomId/participants/:participantId",
        alias: "Chats_removeChatParticipant",
        requestFormat: "json",
        parameters: [
            {
                name: "roomId",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "participantId",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/customers",
        alias: "Customers_listCustomers",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"]).optional(),
            },
        ],
        response: z.union([
            z.array(Customer),
            z.object({ data: z.array(Customer), meta: PaginationMeta }).passthrough(),
        ]),
    },
    {
        method: "post",
        path: "/api/crm/customers",
        alias: "Customers_createCustomer",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateCustomerInput,
            },
        ],
        response: Customer,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/customers/:id",
        alias: "Customers_getCustomerById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Customer,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/customers/:id",
        alias: "Customers_updateCustomer",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateCustomerInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Customer,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/crm/customers/:id",
        alias: "Customers_deleteCustomer",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/deals",
        alias: "Deals_listDeals",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["OPEN", "WON", "LOST", "STALLED"]).optional(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "stageId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([z.array(Deal), z.object({ data: z.array(Deal), meta: PaginationMeta }).passthrough()]),
    },
    {
        method: "post",
        path: "/api/crm/deals",
        alias: "Deals_createDeal",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateDealInput,
            },
        ],
        response: Deal,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/deals/:id",
        alias: "Deals_getDealById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Deal,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/deals/:id",
        alias: "Deals_updateDeal",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateDealInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Deal,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/crm/deals/:id",
        alias: "Deals_deleteDeal",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/crm/deals/:id/lost",
        alias: "Deals_markDealAsLost",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "reason",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: Deal,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/deals/:id/stage",
        alias: "Deals_moveDealToStage",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.object({ stageId: z.string() }).passthrough(),
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Deal,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/crm/deals/:id/won",
        alias: "Deals_markDealAsWon",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Deal,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/leads",
        alias: "Leads_listLeads",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED"]).optional(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([z.array(Lead), z.object({ data: z.array(Lead), meta: PaginationMeta }).passthrough()]),
    },
    {
        method: "post",
        path: "/api/crm/leads",
        alias: "Leads_createLead",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateLeadInput,
            },
        ],
        response: Lead,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/leads/:id",
        alias: "Leads_getLeadById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Lead,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/leads/:id",
        alias: "Leads_updateLead",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateLeadInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Lead,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/crm/leads/:id",
        alias: "Leads_deleteLead",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/crm/leads/:id/convert",
        alias: "Leads_convertLead",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Lead,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/pipelines",
        alias: "Pipelines_listPipelines",
        requestFormat: "json",
        response: z.array(Pipeline),
    },
    {
        method: "post",
        path: "/api/crm/pipelines",
        alias: "Pipelines_createPipeline",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreatePipelineInput,
            },
        ],
        response: Pipeline,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/pipelines/:id",
        alias: "Pipelines_getPipelineById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Pipeline,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/pipelines/:id",
        alias: "Pipelines_updatePipeline",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdatePipelineInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Pipeline,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/crm/pipelines/:id",
        alias: "Pipelines_deletePipeline",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/crm/pipelines/:pipelineId/stages",
        alias: "Pipelines_createPipelineStage",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreatePipelineStageInput,
            },
            {
                name: "pipelineId",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: PipelineStage,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/crm/pipelines/:pipelineId/stages/:stageId",
        alias: "Pipelines_updatePipelineStage",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdatePipelineStageInput,
            },
            {
                name: "pipelineId",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "stageId",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: PipelineStage,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/crm/pipelines/:pipelineId/stages/:stageId",
        alias: "Pipelines_deletePipelineStage",
        requestFormat: "json",
        parameters: [
            {
                name: "pipelineId",
                type: "Path",
                schema: z.string(),
            },
            {
                name: "stageId",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/crm/pipelines/default",
        alias: "Pipelines_getDefaultPipeline",
        requestFormat: "json",
        response: Pipeline,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/email/logs",
        alias: "Emails_listEmailLogs",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["PENDING", "SENT", "DELIVERED", "BOUNCED", "FAILED"]).optional(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([
            z.array(EmailLog),
            z.object({ data: z.array(EmailLog), meta: PaginationMeta }).passthrough(),
        ]),
    },
    {
        method: "get",
        path: "/api/email/logs/:id",
        alias: "Emails_getEmailLogById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: EmailLog,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/email/send",
        alias: "Emails_sendEmail",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: SendEmailInput,
            },
        ],
        response: EmailLog,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/email/send-with-template",
        alias: "Emails_sendEmailWithTemplate",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: Emails_sendEmailWithTemplate_Body.optional(),
            },
            {
                name: "templateSlug",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "toEmail",
                type: "Query",
                schema: z.string(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: EmailLog,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/email/templates",
        alias: "Emails_listEmailTemplates",
        requestFormat: "json",
        parameters: [
            {
                name: "category",
                type: "Query",
                schema: z.enum(["MARKETING", "TRANSACTIONAL", "SUPPORT", "NOTIFICATION"]).optional(),
            },
            {
                name: "isActive",
                type: "Query",
                schema: z.boolean().optional(),
            },
        ],
        response: z.array(EmailTemplate),
    },
    {
        method: "post",
        path: "/api/email/templates",
        alias: "Emails_createEmailTemplate",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateEmailTemplateInput,
            },
        ],
        response: EmailTemplate,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/email/templates/:id",
        alias: "Emails_getEmailTemplateById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: EmailTemplate,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/email/templates/:id",
        alias: "Emails_updateEmailTemplate",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateEmailTemplateInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: EmailTemplate,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/email/templates/:id",
        alias: "Emails_deleteEmailTemplate",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/email/templates/slug/:slug",
        alias: "Emails_getEmailTemplateBySlug",
        requestFormat: "json",
        parameters: [
            {
                name: "slug",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: EmailTemplate,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/portfolio/:slug",
        alias: "Portfolios_getPortfolioBySlug",
        requestFormat: "json",
        parameters: [
            {
                name: "slug",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Portfolio,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/portfolios",
        alias: "Portfolios_listPortfolios",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
        ],
        response: z.union([
            z.array(Portfolio),
            z.object({ data: z.array(Portfolio), meta: PaginationMeta }).passthrough(),
        ]),
    },
    {
        method: "post",
        path: "/api/portfolios/:portfolioId/images",
        alias: "Portfolios_uploadPortfolioImage",
        requestFormat: "binary",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: z.instanceof(File),
            },
            {
                name: "portfolioId",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.object({ url: z.string() }).passthrough(),
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/post/:slug",
        alias: "Posts_getPostBySlug",
        requestFormat: "json",
        parameters: [
            {
                name: "slug",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Post,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/posts",
        alias: "Posts_listPosts",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "tag",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([z.array(Post), z.object({ data: z.array(Post), meta: PaginationMeta }).passthrough()]),
    },
    {
        method: "get",
        path: "/api/support/inquiries",
        alias: "Inquiries_listInquiries",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "perPage",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "status",
                type: "Query",
                schema: z.enum(["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"]).optional(),
            },
            {
                name: "customerId",
                type: "Query",
                schema: z.string().optional(),
            },
            {
                name: "assigneeId",
                type: "Query",
                schema: z.string().optional(),
            },
        ],
        response: z.union([z.array(Inquiry), z.object({ data: z.array(Inquiry), meta: PaginationMeta }).passthrough()]),
    },
    {
        method: "post",
        path: "/api/support/inquiries",
        alias: "Inquiries_createInquiry",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateInquiryInput,
            },
        ],
        response: Inquiry,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/support/inquiries/:id",
        alias: "Inquiries_getInquiryById",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Inquiry,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "put",
        path: "/api/support/inquiries/:id",
        alias: "Inquiries_updateInquiry",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: UpdateInquiryInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Inquiry,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "delete",
        path: "/api/support/inquiries/:id",
        alias: "Inquiries_deleteInquiry",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/support/inquiries/:id/close",
        alias: "Inquiries_closeInquiry",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Inquiry,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "post",
        path: "/api/support/inquiries/:id/resolve",
        alias: "Inquiries_resolveInquiry",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: Inquiry,
        errors: [
            {
                status: 404,
                description: "The server cannot find the requested resource.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
    {
        method: "get",
        path: "/api/support/inquiries/:id/responses",
        alias: "Inquiries_getInquiryResponses",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: z.array(InquiryResponse),
    },
    {
        method: "post",
        path: "/api/support/inquiries/:id/responses",
        alias: "Inquiries_addInquiryResponse",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateInquiryResponseInput,
            },
            {
                name: "id",
                type: "Path",
                schema: z.string(),
            },
        ],
        response: InquiryResponse,
        errors: [
            {
                status: 400,
                description: "The server could not understand the request due to invalid syntax.",
                schema: z.object({ error: z.string(), details: z.unknown().optional() }).passthrough(),
            },
        ],
    },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
