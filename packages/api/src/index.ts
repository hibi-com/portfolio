// Portfolio & Posts
export { posts, listPosts, getPostBySlug } from "./clients/posts";
export { portfolios, listPortfolios, getPortfolioBySlug } from "./clients/portfolios";

// CRM
export { customers } from "./clients/customers";
export { leads } from "./clients/leads";
export { deals } from "./clients/deals";
export { pipelines } from "./clients/pipelines";

// Communication
export { inquiries } from "./clients/inquiries";
export { chats } from "./clients/chats";
export { emails } from "./clients/emails";

// Custom instance
export { customInstance } from "@generated/mutator";

// Types - Portfolio & Posts
export type {
    Asset,
    ErrorResponse,
    PaginationMeta,
    Portfolio,
    PortfolioContent,
    Post,
    PostContent,
    PostsListPostsParams,
    PostsListPosts200,
    PortfoliosListPortfoliosParams,
    PortfoliosListPortfolios200,
} from "@generated/api.schemas";

// Types - CRM
export type {
    Customer,
    CustomerStatus,
    CreateCustomerInput,
    UpdateCustomerInput,
    CustomersListCustomersParams,
    CustomersListCustomers200,
    Lead,
    LeadStatus,
    CreateLeadInput,
    UpdateLeadInput,
    LeadsListLeadsParams,
    LeadsListLeads200,
    Deal,
    DealStatus,
    CreateDealInput,
    UpdateDealInput,
    DealsListDealsParams,
    DealsListDeals200,
    Pipeline,
    PipelineStage,
    CreatePipelineInput,
    UpdatePipelineInput,
    CreatePipelineStageInput,
    UpdatePipelineStageInput,
} from "@generated/api.schemas";

// Types - Communication
export type {
    Inquiry,
    InquiryStatus,
    InquiryResponse,
    CreateInquiryInput,
    UpdateInquiryInput,
    CreateInquiryResponseInput,
    InquiriesListInquiriesParams,
    InquiriesListInquiries200,
    ChatRoom,
    ChatRoomWithParticipants,
    ChatParticipant,
    ChatMessage,
    ChatRoomStatus,
    CreateChatRoomInput,
    AddParticipantInput,
    SendMessageInput,
    ChatsListChatRoomsParams,
    ChatsListChatRooms200,
    ChatsGetChatRoomMessagesParams,
    EmailLog,
    EmailTemplate,
    EmailStatus,
    EmailTemplateCategory,
    SendEmailInput,
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
    EmailsListEmailLogsParams,
    EmailsListEmailLogs200,
    EmailsListEmailTemplatesParams,
    EmailsSendEmailWithTemplateParams,
} from "@generated/api.schemas";
