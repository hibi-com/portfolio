export declare const ChatRoomStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
    readonly CLOSED: "CLOSED";
};
export type ChatRoomStatus = (typeof ChatRoomStatus)[keyof typeof ChatRoomStatus];
export declare const ChatParticipantRole: {
    readonly CUSTOMER: "CUSTOMER";
    readonly AGENT: "AGENT";
    readonly OBSERVER: "OBSERVER";
};
export type ChatParticipantRole = (typeof ChatParticipantRole)[keyof typeof ChatParticipantRole];
export declare const ChatMessageType: {
    readonly TEXT: "TEXT";
    readonly IMAGE: "IMAGE";
    readonly FILE: "FILE";
    readonly SYSTEM: "SYSTEM";
};
export type ChatMessageType = (typeof ChatMessageType)[keyof typeof ChatMessageType];
export declare const CustomerStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly PROSPECT: "PROSPECT";
    readonly CHURNED: "CHURNED";
};
export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];
export declare const LeadStatus: {
    readonly NEW: "NEW";
    readonly CONTACTED: "CONTACTED";
    readonly QUALIFIED: "QUALIFIED";
    readonly UNQUALIFIED: "UNQUALIFIED";
    readonly CONVERTED: "CONVERTED";
};
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];
export declare const DealStatus: {
    readonly OPEN: "OPEN";
    readonly WON: "WON";
    readonly LOST: "LOST";
    readonly STALLED: "STALLED";
};
export type DealStatus = (typeof DealStatus)[keyof typeof DealStatus];
export declare const ContactType: {
    readonly EMAIL: "EMAIL";
    readonly PHONE: "PHONE";
    readonly MEETING: "MEETING";
    readonly CHAT: "CHAT";
    readonly NOTE: "NOTE";
    readonly OTHER: "OTHER";
};
export type ContactType = (typeof ContactType)[keyof typeof ContactType];
export declare const EmailStatus: {
    readonly PENDING: "PENDING";
    readonly SENT: "SENT";
    readonly DELIVERED: "DELIVERED";
    readonly BOUNCED: "BOUNCED";
    readonly FAILED: "FAILED";
};
export type EmailStatus = (typeof EmailStatus)[keyof typeof EmailStatus];
export declare const EmailTemplateCategory: {
    readonly MARKETING: "MARKETING";
    readonly TRANSACTIONAL: "TRANSACTIONAL";
    readonly SUPPORT: "SUPPORT";
    readonly NOTIFICATION: "NOTIFICATION";
};
export type EmailTemplateCategory = (typeof EmailTemplateCategory)[keyof typeof EmailTemplateCategory];
export declare const InquiryStatus: {
    readonly OPEN: "OPEN";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly WAITING_CUSTOMER: "WAITING_CUSTOMER";
    readonly RESOLVED: "RESOLVED";
    readonly CLOSED: "CLOSED";
};
export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus];
export declare const InquiryPriority: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly URGENT: "URGENT";
};
export type InquiryPriority = (typeof InquiryPriority)[keyof typeof InquiryPriority];
export declare const InquiryCategory: {
    readonly GENERAL: "GENERAL";
    readonly TECHNICAL: "TECHNICAL";
    readonly BILLING: "BILLING";
    readonly SALES: "SALES";
    readonly COMPLAINT: "COMPLAINT";
    readonly FEATURE_REQUEST: "FEATURE_REQUEST";
    readonly OTHER: "OTHER";
};
export type InquiryCategory = (typeof InquiryCategory)[keyof typeof InquiryCategory];
export declare const SyncStatus: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus];
export declare const SyncDirection: {
    readonly IMPORT: "IMPORT";
    readonly EXPORT: "EXPORT";
    readonly BIDIRECTIONAL: "BIDIRECTIONAL";
};
export type SyncDirection = (typeof SyncDirection)[keyof typeof SyncDirection];
//# sourceMappingURL=enums.d.ts.map