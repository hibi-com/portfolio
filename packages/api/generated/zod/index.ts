import { z } from "zod";

export const ChatRoomStatusSchema = z.enum(["ACTIVE", "ARCHIVED", "CLOSED"]);
export const ChatRoomSchema = z
  .object({
    id: z.string(),
    customerId: z.string().optional(),
    inquiryId: z.string().optional(),
    name: z.string().optional(),
    status: ChatRoomStatusSchema,
    metadata: z.object({}).partial().passthrough().optional(),
    closedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const PaginationMetaSchema = z
  .object({
    page: z.number().int(),
    perPage: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .passthrough();
export const CreateChatRoomInputSchema = z
  .object({
    customerId: z.string(),
    inquiryId: z.string(),
    name: z.string(),
    metadata: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough();
export const ErrorResponseSchema = z
  .object({ error: z.string(), details: z.unknown().optional() })
  .passthrough();
export const ChatParticipantRoleSchema = z.enum(["CUSTOMER", "AGENT", "OBSERVER"]);
export const ChatParticipantSchema = z
  .object({
    id: z.string(),
    chatRoomId: z.string(),
    userId: z.string().optional(),
    name: z.string(),
    role: ChatParticipantRoleSchema,
    isOnline: z.boolean(),
    lastSeenAt: z.string().optional(),
    joinedAt: z.string(),
    leftAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const ChatRoomWithParticipantsSchema = z
  .object({
    id: z.string(),
    customerId: z.string().optional(),
    inquiryId: z.string().optional(),
    name: z.string().optional(),
    status: ChatRoomStatusSchema,
    metadata: z.object({}).partial().passthrough().optional(),
    closedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    participants: z.array(ChatParticipantSchema),
  })
  .passthrough();
export const ChatMessageTypeSchema = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);
export const ChatMessageSchema = z
  .object({
    id: z.string(),
    chatRoomId: z.string(),
    participantId: z.string(),
    type: ChatMessageTypeSchema,
    content: z.string(),
    metadata: z.object({}).partial().passthrough().optional(),
    readBy: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const SendMessageInputSchema = z
  .object({
    chatRoomId: z.string(),
    participantId: z.string(),
    type: ChatMessageTypeSchema.optional(),
    content: z.string(),
    metadata: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
export const AddParticipantInputSchema = z
  .object({
    chatRoomId: z.string(),
    userId: z.string().optional(),
    name: z.string(),
    role: ChatParticipantRoleSchema.optional(),
  })
  .passthrough();
export const Chats_markMessagesAsRead_BodySchema = z
  .object({ messageIds: z.array(z.string()) })
  .passthrough();
export const CustomerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"]);
export const CustomerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    status: CustomerStatusSchema,
    tags: z.array(z.string()).optional(),
    customFields: z.object({}).partial().passthrough().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateCustomerInputSchema = z
  .object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    status: CustomerStatusSchema.optional(),
    tags: z.array(z.string()).optional(),
    customFields: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
export const UpdateCustomerInputSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    company: z.string(),
    website: z.string(),
    address: z.string(),
    notes: z.string(),
    status: CustomerStatusSchema,
    tags: z.array(z.string()),
    customFields: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough();
export const DealStatusSchema = z.enum(["OPEN", "WON", "LOST", "STALLED"]);
export const DealSchema = z
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
    status: DealStatusSchema,
    notes: z.string().optional(),
    lostReason: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateDealInputSchema = z
  .object({
    customerId: z.string().optional(),
    leadId: z.string().optional(),
    stageId: z.string(),
    name: z.string(),
    value: z.number().optional(),
    currency: z.string().optional(),
    expectedCloseDate: z.string().optional(),
    status: DealStatusSchema.optional(),
    notes: z.string().optional(),
  })
  .passthrough();
export const UpdateDealInputSchema = z
  .object({
    customerId: z.string(),
    stageId: z.string(),
    name: z.string(),
    value: z.number(),
    currency: z.string(),
    expectedCloseDate: z.string(),
    actualCloseDate: z.string(),
    status: DealStatusSchema,
    notes: z.string(),
    lostReason: z.string(),
  })
  .partial()
  .passthrough();
export const LeadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "UNQUALIFIED",
  "CONVERTED",
]);
export const LeadSchema = z
  .object({
    id: z.string(),
    customerId: z.string().optional(),
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: LeadStatusSchema,
    score: z.number().int().optional(),
    notes: z.string().optional(),
    convertedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateLeadInputSchema = z
  .object({
    customerId: z.string().optional(),
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: LeadStatusSchema.optional(),
    score: z.number().int().optional(),
    notes: z.string().optional(),
  })
  .passthrough();
export const UpdateLeadInputSchema = z
  .object({
    customerId: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    company: z.string(),
    source: z.string(),
    status: LeadStatusSchema,
    score: z.number().int(),
    notes: z.string(),
  })
  .partial()
  .passthrough();
export const PipelineStageSchema = z
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
export const PipelineSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    isDefault: z.boolean(),
    stages: z.array(PipelineStageSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreatePipelineInputSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
  })
  .passthrough();
export const UpdatePipelineInputSchema = z
  .object({ name: z.string(), description: z.string(), isDefault: z.boolean() })
  .partial()
  .passthrough();
export const CreatePipelineStageInputSchema = z
  .object({
    pipelineId: z.string(),
    name: z.string(),
    order: z.number().int(),
    probability: z.number().optional(),
    color: z.string().optional(),
  })
  .passthrough();
export const UpdatePipelineStageInputSchema = z
  .object({
    name: z.string(),
    order: z.number().int(),
    probability: z.number(),
    color: z.string(),
  })
  .partial()
  .passthrough();
export const EmailStatusSchema = z.enum([
  "PENDING",
  "SENT",
  "DELIVERED",
  "BOUNCED",
  "FAILED",
]);
export const EmailLogSchema = z
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
    status: EmailStatusSchema,
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
export const SendEmailInputSchema = z
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
export const Emails_sendEmailWithTemplate_BodySchema = z
  .object({ variables: z.record(z.string(), z.string()) })
  .partial()
  .passthrough();
export const EmailTemplateCategorySchema = z.enum([
  "MARKETING",
  "TRANSACTIONAL",
  "SUPPORT",
  "NOTIFICATION",
]);
export const EmailTemplateSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    category: EmailTemplateCategorySchema,
    subject: z.string(),
    htmlContent: z.string(),
    textContent: z.string().optional(),
    variables: z.array(z.string()).optional(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateEmailTemplateInputSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    category: EmailTemplateCategorySchema.optional(),
    subject: z.string(),
    htmlContent: z.string(),
    textContent: z.string().optional(),
    variables: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();
export const UpdateEmailTemplateInputSchema = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    category: EmailTemplateCategorySchema,
    subject: z.string(),
    htmlContent: z.string(),
    textContent: z.string(),
    variables: z.array(z.string()),
    isActive: z.boolean(),
  })
  .partial()
  .passthrough();
export const PortfolioContentSchema = z.object({ html: z.string() }).passthrough();
export const AssetSchema = z.object({ url: z.string() }).passthrough();
export const PortfolioSchema = z
  .object({
    id: z.string().optional(),
    title: z.string(),
    slug: z.string(),
    company: z.string(),
    date: z.string(),
    current: z.boolean(),
    overview: z.string().optional(),
    description: z.string().optional(),
    content: PortfolioContentSchema.optional(),
    thumbnailTemp: z.string().optional(),
    images: z.array(AssetSchema).optional(),
    intro: z.string().optional(),
  })
  .passthrough();
export const PostContentSchema = z
  .object({ html: z.string(), raw: z.unknown().optional() })
  .passthrough();
export const PostSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    description: z.string().optional(),
    content: PostContentSchema,
    imageTemp: z.string(),
    tags: z.array(z.string()),
    sticky: z.boolean(),
    intro: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    images: z.array(AssetSchema).optional(),
  })
  .passthrough();
export const InquiryStatusSchema = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "WAITING_CUSTOMER",
  "RESOLVED",
  "CLOSED",
]);
export const InquiryPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const InquiryCategorySchema = z.enum([
  "GENERAL",
  "TECHNICAL",
  "BILLING",
  "SALES",
  "COMPLAINT",
  "FEATURE_REQUEST",
  "OTHER",
]);
export const InquirySchema = z
  .object({
    id: z.string(),
    customerId: z.string().optional(),
    assigneeId: z.string().optional(),
    subject: z.string(),
    content: z.string(),
    status: InquiryStatusSchema,
    priority: InquiryPrioritySchema,
    category: InquiryCategorySchema,
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    metadata: z.object({}).partial().passthrough().optional(),
    resolvedAt: z.string().optional(),
    closedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateInquiryInputSchema = z
  .object({
    customerId: z.string().optional(),
    assigneeId: z.string().optional(),
    subject: z.string(),
    content: z.string(),
    status: InquiryStatusSchema.optional(),
    priority: InquiryPrioritySchema.optional(),
    category: InquiryCategorySchema.optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    metadata: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
export const UpdateInquiryInputSchema = z
  .object({
    customerId: z.string(),
    assigneeId: z.string(),
    subject: z.string(),
    content: z.string(),
    status: InquiryStatusSchema,
    priority: InquiryPrioritySchema,
    category: InquiryCategorySchema,
    tags: z.array(z.string()),
    source: z.string(),
    metadata: z.object({}).partial().passthrough(),
  })
  .partial()
  .passthrough();
export const InquiryResponseSchema = z
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
export const CreateInquiryResponseInputSchema = z
  .object({
    inquiryId: z.string(),
    userId: z.string().optional(),
    content: z.string(),
    isInternal: z.boolean().optional(),
    attachments: z.array(z.string()).optional(),
  })
  .passthrough();
export const FreeeCallbackInputSchema = z
  .object({ code: z.string(), state: z.string() })
  .passthrough();
export const FreeeIntegrationSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    companyId: z.number().int(),
    companyName: z.string().optional(),
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenExpiresAt: z.string(),
    scopes: z.array(z.string()).optional(),
    isActive: z.boolean(),
    lastSyncAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const FreeeAuthUrlResponseSchema = z.object({ url: z.string() }).passthrough();
export const FreeeCompanySchema = z
  .object({ id: z.number().int(), displayName: z.string(), role: z.string() })
  .passthrough();
export const CreateFreeeIntegrationInputSchema = z
  .object({
    userId: z.string(),
    companyId: z.number().int(),
    companyName: z.string().optional(),
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenExpiresAt: z.string(),
    scopes: z.array(z.string()).optional(),
  })
  .passthrough();
export const CustomerFreeeMappingSchema = z
  .object({
    id: z.string(),
    customerId: z.string(),
    freeePartnerId: z.number().int(),
    freeeCompanyId: z.number().int(),
    lastSyncAt: z.string(),
    syncHash: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateCustomerMappingInputSchema = z
  .object({
    customerId: z.string(),
    freeePartnerId: z.number().int(),
    freeeCompanyId: z.number().int(),
    syncHash: z.string().optional(),
  })
  .passthrough();
export const DealFreeeMappingSchema = z
  .object({
    id: z.string(),
    dealId: z.string(),
    freeeDealId: z.number().int(),
    freeeCompanyId: z.number().int(),
    lastSyncAt: z.string(),
    syncHash: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateDealMappingInputSchema = z
  .object({
    dealId: z.string(),
    freeeDealId: z.number().int(),
    freeeCompanyId: z.number().int(),
    syncHash: z.string().optional(),
  })
  .passthrough();
export const FreeePartnerSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    code: z.string().optional(),
    shortcut1: z.string().optional(),
    shortcut2: z.string().optional(),
    orgCode: z.number().int().optional(),
    countryCode: z.string().optional(),
    addressRegionCode: z.string().optional(),
    streetName1: z.string().optional(),
    streetName2: z.string().optional(),
    zipcode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .passthrough();
export const SyncDirectionSchema = z.enum(["IMPORT", "EXPORT", "BIDIRECTIONAL"]);
export const SyncStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]);
export const SyncErrorDetailSchema = z
  .object({ record: z.string(), error: z.string() })
  .passthrough();
export const FreeeSyncLogSchema = z
  .object({
    id: z.string(),
    integrationId: z.string(),
    direction: SyncDirectionSchema,
    status: SyncStatusSchema,
    entityType: z.string(),
    totalRecords: z.number().int().optional(),
    successCount: z.number().int().optional(),
    errorCount: z.number().int().optional(),
    errorDetails: z.array(SyncErrorDetailSchema).optional(),
    startedAt: z.string().optional(),
    completedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
export const CreateSyncLogInputSchema = z
  .object({
    integrationId: z.string(),
    direction: SyncDirectionSchema,
    entityType: z.string(),
  })
  .passthrough();
export const UpdateSyncLogInputSchema = z
  .object({
    status: SyncStatusSchema,
    totalRecords: z.number().int(),
    successCount: z.number().int(),
    errorCount: z.number().int(),
    errorDetails: z.array(SyncErrorDetailSchema),
    startedAt: z.string(),
    completedAt: z.string(),
  })
  .partial()
  .passthrough();
export const UpdateFreeeTokensInputSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenExpiresAt: z.string(),
  })
  .passthrough();
export const FreeeOAuthTokensSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().int(),
    tokenType: z.string(),
    scope: z.string(),
    createdAt: z.number().int(),
  })
  .passthrough();

export const schemas = {
    ChatRoomStatus: ChatRoomStatusSchema,
    ChatRoom: ChatRoomSchema,
    PaginationMeta: PaginationMetaSchema,
    CreateChatRoomInput: CreateChatRoomInputSchema,
    ErrorResponse: ErrorResponseSchema,
    ChatParticipantRole: ChatParticipantRoleSchema,
    ChatParticipant: ChatParticipantSchema,
    ChatRoomWithParticipants: ChatRoomWithParticipantsSchema,
    ChatMessageType: ChatMessageTypeSchema,
    ChatMessage: ChatMessageSchema,
    SendMessageInput: SendMessageInputSchema,
    AddParticipantInput: AddParticipantInputSchema,
    Chats_markMessagesAsRead_Body: Chats_markMessagesAsRead_BodySchema,
    CustomerStatus: CustomerStatusSchema,
    Customer: CustomerSchema,
    CreateCustomerInput: CreateCustomerInputSchema,
    UpdateCustomerInput: UpdateCustomerInputSchema,
    DealStatus: DealStatusSchema,
    Deal: DealSchema,
    CreateDealInput: CreateDealInputSchema,
    UpdateDealInput: UpdateDealInputSchema,
    LeadStatus: LeadStatusSchema,
    Lead: LeadSchema,
    CreateLeadInput: CreateLeadInputSchema,
    UpdateLeadInput: UpdateLeadInputSchema,
    PipelineStage: PipelineStageSchema,
    Pipeline: PipelineSchema,
    CreatePipelineInput: CreatePipelineInputSchema,
    UpdatePipelineInput: UpdatePipelineInputSchema,
    CreatePipelineStageInput: CreatePipelineStageInputSchema,
    UpdatePipelineStageInput: UpdatePipelineStageInputSchema,
    EmailStatus: EmailStatusSchema,
    EmailLog: EmailLogSchema,
    SendEmailInput: SendEmailInputSchema,
    Emails_sendEmailWithTemplate_Body: Emails_sendEmailWithTemplate_BodySchema,
    EmailTemplateCategory: EmailTemplateCategorySchema,
    EmailTemplate: EmailTemplateSchema,
    CreateEmailTemplateInput: CreateEmailTemplateInputSchema,
    UpdateEmailTemplateInput: UpdateEmailTemplateInputSchema,
    PortfolioContent: PortfolioContentSchema,
    Asset: AssetSchema,
    Portfolio: PortfolioSchema,
    PostContent: PostContentSchema,
    Post: PostSchema,
    InquiryStatus: InquiryStatusSchema,
    InquiryPriority: InquiryPrioritySchema,
    InquiryCategory: InquiryCategorySchema,
    Inquiry: InquirySchema,
    CreateInquiryInput: CreateInquiryInputSchema,
    UpdateInquiryInput: UpdateInquiryInputSchema,
    InquiryResponse: InquiryResponseSchema,
    CreateInquiryResponseInput: CreateInquiryResponseInputSchema,
    FreeeCallbackInput: FreeeCallbackInputSchema,
    FreeeIntegration: FreeeIntegrationSchema,
    FreeeAuthUrlResponse: FreeeAuthUrlResponseSchema,
    FreeeCompany: FreeeCompanySchema,
    CreateFreeeIntegrationInput: CreateFreeeIntegrationInputSchema,
    CustomerFreeeMapping: CustomerFreeeMappingSchema,
    CreateCustomerMappingInput: CreateCustomerMappingInputSchema,
    DealFreeeMapping: DealFreeeMappingSchema,
    CreateDealMappingInput: CreateDealMappingInputSchema,
    FreeePartner: FreeePartnerSchema,
    SyncDirection: SyncDirectionSchema,
    SyncStatus: SyncStatusSchema,
    SyncErrorDetail: SyncErrorDetailSchema,
    FreeeSyncLog: FreeeSyncLogSchema,
    CreateSyncLogInput: CreateSyncLogInputSchema,
    UpdateSyncLogInput: UpdateSyncLogInputSchema,
    UpdateFreeeTokensInput: UpdateFreeeTokensInputSchema,
    FreeeOAuthTokens: FreeeOAuthTokensSchema,
};

// Type inference exports
export type ChatRoomStatus = z.infer<typeof ChatRoomStatusSchema>;
export type ChatRoom = z.infer<typeof ChatRoomSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type CreateChatRoomInput = z.infer<typeof CreateChatRoomInputSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ChatParticipantRole = z.infer<typeof ChatParticipantRoleSchema>;
export type ChatParticipant = z.infer<typeof ChatParticipantSchema>;
export type ChatRoomWithParticipants = z.infer<typeof ChatRoomWithParticipantsSchema>;
export type ChatMessageType = z.infer<typeof ChatMessageTypeSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type AddParticipantInput = z.infer<typeof AddParticipantInputSchema>;
export type Chats_markMessagesAsRead_Body = z.infer<typeof Chats_markMessagesAsRead_BodySchema>;
export type CustomerStatus = z.infer<typeof CustomerStatusSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
export type DealStatus = z.infer<typeof DealStatusSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type CreateDealInput = z.infer<typeof CreateDealInputSchema>;
export type UpdateDealInput = z.infer<typeof UpdateDealInputSchema>;
export type LeadStatus = z.infer<typeof LeadStatusSchema>;
export type Lead = z.infer<typeof LeadSchema>;
export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type Pipeline = z.infer<typeof PipelineSchema>;
export type CreatePipelineInput = z.infer<typeof CreatePipelineInputSchema>;
export type UpdatePipelineInput = z.infer<typeof UpdatePipelineInputSchema>;
export type CreatePipelineStageInput = z.infer<typeof CreatePipelineStageInputSchema>;
export type UpdatePipelineStageInput = z.infer<typeof UpdatePipelineStageInputSchema>;
export type EmailStatus = z.infer<typeof EmailStatusSchema>;
export type EmailLog = z.infer<typeof EmailLogSchema>;
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;
export type Emails_sendEmailWithTemplate_Body = z.infer<typeof Emails_sendEmailWithTemplate_BodySchema>;
export type EmailTemplateCategory = z.infer<typeof EmailTemplateCategorySchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
export type CreateEmailTemplateInput = z.infer<typeof CreateEmailTemplateInputSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof UpdateEmailTemplateInputSchema>;
export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type PostContent = z.infer<typeof PostContentSchema>;
export type Post = z.infer<typeof PostSchema>;
export type InquiryStatus = z.infer<typeof InquiryStatusSchema>;
export type InquiryPriority = z.infer<typeof InquiryPrioritySchema>;
export type InquiryCategory = z.infer<typeof InquiryCategorySchema>;
export type Inquiry = z.infer<typeof InquirySchema>;
export type CreateInquiryInput = z.infer<typeof CreateInquiryInputSchema>;
export type UpdateInquiryInput = z.infer<typeof UpdateInquiryInputSchema>;
export type InquiryResponse = z.infer<typeof InquiryResponseSchema>;
export type CreateInquiryResponseInput = z.infer<typeof CreateInquiryResponseInputSchema>;
export type FreeeCallbackInput = z.infer<typeof FreeeCallbackInputSchema>;
export type FreeeIntegration = z.infer<typeof FreeeIntegrationSchema>;
export type FreeeAuthUrlResponse = z.infer<typeof FreeeAuthUrlResponseSchema>;
export type FreeeCompany = z.infer<typeof FreeeCompanySchema>;
export type CreateFreeeIntegrationInput = z.infer<typeof CreateFreeeIntegrationInputSchema>;
export type CustomerFreeeMapping = z.infer<typeof CustomerFreeeMappingSchema>;
export type CreateCustomerMappingInput = z.infer<typeof CreateCustomerMappingInputSchema>;
export type DealFreeeMapping = z.infer<typeof DealFreeeMappingSchema>;
export type CreateDealMappingInput = z.infer<typeof CreateDealMappingInputSchema>;
export type FreeePartner = z.infer<typeof FreeePartnerSchema>;
export type SyncDirection = z.infer<typeof SyncDirectionSchema>;
export type SyncStatus = z.infer<typeof SyncStatusSchema>;
export type SyncErrorDetail = z.infer<typeof SyncErrorDetailSchema>;
export type FreeeSyncLog = z.infer<typeof FreeeSyncLogSchema>;
export type CreateSyncLogInput = z.infer<typeof CreateSyncLogInputSchema>;
export type UpdateSyncLogInput = z.infer<typeof UpdateSyncLogInputSchema>;
export type UpdateFreeeTokensInput = z.infer<typeof UpdateFreeeTokensInputSchema>;
export type FreeeOAuthTokens = z.infer<typeof FreeeOAuthTokensSchema>;
