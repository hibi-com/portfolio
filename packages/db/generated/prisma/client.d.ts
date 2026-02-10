import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Session
 *
 */
export type Session = Prisma.SessionModel;
/**
 * Model Account
 *
 */
export type Account = Prisma.AccountModel;
/**
 * Model Verification
 *
 */
export type Verification = Prisma.VerificationModel;
/**
 * Model ChatRoom
 *
 */
export type ChatRoom = Prisma.ChatRoomModel;
/**
 * Model ChatParticipant
 *
 */
export type ChatParticipant = Prisma.ChatParticipantModel;
/**
 * Model ChatMessage
 *
 */
export type ChatMessage = Prisma.ChatMessageModel;
/**
 * Model Customer
 *
 */
export type Customer = Prisma.CustomerModel;
/**
 * Model Lead
 *
 */
export type Lead = Prisma.LeadModel;
/**
 * Model Pipeline
 *
 */
export type Pipeline = Prisma.PipelineModel;
/**
 * Model PipelineStage
 *
 */
export type PipelineStage = Prisma.PipelineStageModel;
/**
 * Model Deal
 *
 */
export type Deal = Prisma.DealModel;
/**
 * Model ContactHistory
 *
 */
export type ContactHistory = Prisma.ContactHistoryModel;
/**
 * Model EmailLog
 *
 */
export type EmailLog = Prisma.EmailLogModel;
/**
 * Model EmailTemplate
 *
 */
export type EmailTemplate = Prisma.EmailTemplateModel;
/**
 * Model Inquiry
 *
 */
export type Inquiry = Prisma.InquiryModel;
/**
 * Model InquiryResponse
 *
 */
export type InquiryResponse = Prisma.InquiryResponseModel;
/**
 * Model FreeeIntegration
 *
 */
export type FreeeIntegration = Prisma.FreeeIntegrationModel;
/**
 * Model FreeeSyncLog
 *
 */
export type FreeeSyncLog = Prisma.FreeeSyncLogModel;
/**
 * Model CustomerFreeeMapping
 *
 */
export type CustomerFreeeMapping = Prisma.CustomerFreeeMappingModel;
/**
 * Model DealFreeeMapping
 *
 */
export type DealFreeeMapping = Prisma.DealFreeeMappingModel;
/**
 * Model Portfolio
 *
 */
export type Portfolio = Prisma.PortfolioModel;
/**
 * Model PortfolioImage
 *
 */
export type PortfolioImage = Prisma.PortfolioImageModel;
/**
 * Model Post
 *
 */
export type Post = Prisma.PostModel;
/**
 * Model Tag
 *
 */
export type Tag = Prisma.TagModel;
/**
 * Model PostTag
 *
 */
export type PostTag = Prisma.PostTagModel;
/**
 * Model PostImage
 *
 */
export type PostImage = Prisma.PostImageModel;
/**
 * Model UserExperience
 *
 */
export type UserExperience = Prisma.UserExperienceModel;
/**
 * Model UserSocial
 *
 */
export type UserSocial = Prisma.UserSocialModel;
//# sourceMappingURL=client.d.ts.map