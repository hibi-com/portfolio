import { z } from "zod";

export const ChatRoomStatus = z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]);
export const ChatRoom = z
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
export const PaginationMeta = z
  .object({
    page: z.number().int(),
    perPage: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .passthrough();
export const CreateChatRoomInput = z
  .object({
    customerId: z.string(),
    inquiryId: z.string(),
    name: z.string(),
    metadata: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough();
export const ErrorResponse = z
  .object({ error: z.string(), details: z.unknown().optional() })
  .passthrough();
export const ChatParticipantRole = z.enum(["CUSTOMER", "AGENT", "OBSERVER"]);
export const ChatParticipant = z
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
export const ChatRoomWithParticipants = z
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
export const ChatMessageType = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);
export const ChatMessage = z
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
export const SendMessageInput = z
  .object({
    chatRoomId: z.string(),
    participantId: z.string(),
    type: ChatMessageType.optional(),
    content: z.string(),
    metadata: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
export const AddParticipantInput = z
  .object({
    chatRoomId: z.string(),
    userId: z.string().optional(),
    name: z.string(),
    role: ChatParticipantRole.optional(),
  })
  .passthrough();
export const Chats_markMessagesAsRead_Body = z
  .object({ messageIds: z.array(z.string()) })
  .passthrough();
export const CustomerStatus = z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"]);
export const Customer = z
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
export const CreateCustomerInput = z
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
export const UpdateCustomerInput = z
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
export const DealStatus = z.enum(["OPEN", "WON", "LOST", "STALLED"]);
export const Deal = z
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
export const CreateDealInput = z
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
export const UpdateDealInput = z
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
export const LeadStatus = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "UNQUALIFIED",
  "CONVERTED",
]);
export const Lead = z
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
export const CreateLeadInput = z
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
export const UpdateLeadInput = z
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
export const PipelineStage = z
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
export const Pipeline = z
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
export const CreatePipelineInput = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
  })
  .passthrough();
export const UpdatePipelineInput = z
  .object({ name: z.string(), description: z.string(), isDefault: z.boolean() })
  .partial()
  .passthrough();
export const CreatePipelineStageInput = z
  .object({
    pipelineId: z.string(),
    name: z.string(),
    order: z.number().int(),
    probability: z.number().optional(),
    color: z.string().optional(),
  })
  .passthrough();
export const UpdatePipelineStageInput = z
  .object({
    name: z.string(),
    order: z.number().int(),
    probability: z.number(),
    color: z.string(),
  })
  .partial()
  .passthrough();
export const EmailStatus = z.enum([
  "PENDING",
  "SENT",
  "DELIVERED",
  "BOUNCED",
  "FAILED",
]);
export const EmailLog = z
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
export const SendEmailInput = z
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
    variables: z.record(z.string(), z.string()).optional(),
    metadata: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
export const Emails_sendEmailWithTemplate_Body = z
  .object({ variables: z.record(z.string(), z.string()) })
  .partial()
  .passthrough();
export const EmailTemplateCategory = z.enum([
  "MARKETING",
  "TRANSACTIONAL",
  "SUPPORT",
  "NOTIFICATION",
]);
export const EmailTemplate = z
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
export const CreateEmailTemplateInput = z
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
export const UpdateEmailTemplateInput = z
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
export const PortfolioContent = z.object({ html: z.string() }).passthrough();
export const Asset = z.object({ url: z.string() }).passthrough();
export const Portfolio = z
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
export const PostContent = z
  .object({ html: z.string(), raw: z.unknown().optional() })
  .passthrough();
export const Post = z
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
export const InquiryStatus = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "RESOLVED",
  "CLOSED",
]);
export const InquiryPriority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const InquiryCategory = z.enum([
  "GENERAL",
  "TECHNICAL",
  "BILLING",
  "SALES",
  "COMPLAINT",
  "FEATURE_REQUEST",
  "OTHER",
]);
export const Inquiry = z
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
export const CreateInquiryInput = z
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
export const UpdateInquiryInput = z
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
export const InquiryResponse = z
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
export const CreateInquiryResponseInput = z
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

// Type inference exports
export type ChatRoomStatusType = z.infer<typeof ChatRoomStatus>;
export type ChatRoomType = z.infer<typeof ChatRoom>;
export type PaginationMetaType = z.infer<typeof PaginationMeta>;
export type CreateChatRoomInputType = z.infer<typeof CreateChatRoomInput>;
export type ErrorResponseType = z.infer<typeof ErrorResponse>;
export type ChatParticipantRoleType = z.infer<typeof ChatParticipantRole>;
export type ChatParticipantType = z.infer<typeof ChatParticipant>;
export type ChatRoomWithParticipantsType = z.infer<typeof ChatRoomWithParticipants>;
export type ChatMessageTypeType = z.infer<typeof ChatMessageType>;
export type ChatMessageType = z.infer<typeof ChatMessage>;
export type SendMessageInputType = z.infer<typeof SendMessageInput>;
export type AddParticipantInputType = z.infer<typeof AddParticipantInput>;
export type Chats_markMessagesAsRead_BodyType = z.infer<typeof Chats_markMessagesAsRead_Body>;
export type CustomerStatusType = z.infer<typeof CustomerStatus>;
export type CustomerType = z.infer<typeof Customer>;
export type CreateCustomerInputType = z.infer<typeof CreateCustomerInput>;
export type UpdateCustomerInputType = z.infer<typeof UpdateCustomerInput>;
export type DealStatusType = z.infer<typeof DealStatus>;
export type DealType = z.infer<typeof Deal>;
export type CreateDealInputType = z.infer<typeof CreateDealInput>;
export type UpdateDealInputType = z.infer<typeof UpdateDealInput>;
export type LeadStatusType = z.infer<typeof LeadStatus>;
export type LeadType = z.infer<typeof Lead>;
export type CreateLeadInputType = z.infer<typeof CreateLeadInput>;
export type UpdateLeadInputType = z.infer<typeof UpdateLeadInput>;
export type PipelineStageType = z.infer<typeof PipelineStage>;
export type PipelineType = z.infer<typeof Pipeline>;
export type CreatePipelineInputType = z.infer<typeof CreatePipelineInput>;
export type UpdatePipelineInputType = z.infer<typeof UpdatePipelineInput>;
export type CreatePipelineStageInputType = z.infer<typeof CreatePipelineStageInput>;
export type UpdatePipelineStageInputType = z.infer<typeof UpdatePipelineStageInput>;
export type EmailStatusType = z.infer<typeof EmailStatus>;
export type EmailLogType = z.infer<typeof EmailLog>;
export type SendEmailInputType = z.infer<typeof SendEmailInput>;
export type Emails_sendEmailWithTemplate_BodyType = z.infer<typeof Emails_sendEmailWithTemplate_Body>;
export type EmailTemplateCategoryType = z.infer<typeof EmailTemplateCategory>;
export type EmailTemplateType = z.infer<typeof EmailTemplate>;
export type CreateEmailTemplateInputType = z.infer<typeof CreateEmailTemplateInput>;
export type UpdateEmailTemplateInputType = z.infer<typeof UpdateEmailTemplateInput>;
export type PortfolioContentType = z.infer<typeof PortfolioContent>;
export type AssetType = z.infer<typeof Asset>;
export type PortfolioType = z.infer<typeof Portfolio>;
export type PostContentType = z.infer<typeof PostContent>;
export type PostType = z.infer<typeof Post>;
export type InquiryStatusType = z.infer<typeof InquiryStatus>;
export type InquiryPriorityType = z.infer<typeof InquiryPriority>;
export type InquiryCategoryType = z.infer<typeof InquiryCategory>;
export type InquiryType = z.infer<typeof Inquiry>;
export type CreateInquiryInputType = z.infer<typeof CreateInquiryInput>;
export type UpdateInquiryInputType = z.infer<typeof UpdateInquiryInput>;
export type InquiryResponseType = z.infer<typeof InquiryResponse>;
export type CreateInquiryResponseInputType = z.infer<typeof CreateInquiryResponseInput>;
