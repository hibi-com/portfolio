import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.session`: Exposes CRUD operations for the **Session** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Sessions
      * const sessions = await prisma.session.findMany()
      * ```
      */
    get session(): Prisma.SessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.account`: Exposes CRUD operations for the **Account** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Accounts
      * const accounts = await prisma.account.findMany()
      * ```
      */
    get account(): Prisma.AccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Verifications
      * const verifications = await prisma.verification.findMany()
      * ```
      */
    get verification(): Prisma.VerificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatRoom`: Exposes CRUD operations for the **ChatRoom** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatRooms
      * const chatRooms = await prisma.chatRoom.findMany()
      * ```
      */
    get chatRoom(): Prisma.ChatRoomDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatParticipant`: Exposes CRUD operations for the **ChatParticipant** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatParticipants
      * const chatParticipants = await prisma.chatParticipant.findMany()
      * ```
      */
    get chatParticipant(): Prisma.ChatParticipantDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatMessages
      * const chatMessages = await prisma.chatMessage.findMany()
      * ```
      */
    get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Customers
      * const customers = await prisma.customer.findMany()
      * ```
      */
    get customer(): Prisma.CustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Leads
      * const leads = await prisma.lead.findMany()
      * ```
      */
    get lead(): Prisma.LeadDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.pipeline`: Exposes CRUD operations for the **Pipeline** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Pipelines
      * const pipelines = await prisma.pipeline.findMany()
      * ```
      */
    get pipeline(): Prisma.PipelineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.pipelineStage`: Exposes CRUD operations for the **PipelineStage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PipelineStages
      * const pipelineStages = await prisma.pipelineStage.findMany()
      * ```
      */
    get pipelineStage(): Prisma.PipelineStageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.deal`: Exposes CRUD operations for the **Deal** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Deals
      * const deals = await prisma.deal.findMany()
      * ```
      */
    get deal(): Prisma.DealDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.contactHistory`: Exposes CRUD operations for the **ContactHistory** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ContactHistories
      * const contactHistories = await prisma.contactHistory.findMany()
      * ```
      */
    get contactHistory(): Prisma.ContactHistoryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.emailLog`: Exposes CRUD operations for the **EmailLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more EmailLogs
      * const emailLogs = await prisma.emailLog.findMany()
      * ```
      */
    get emailLog(): Prisma.EmailLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.emailTemplate`: Exposes CRUD operations for the **EmailTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more EmailTemplates
      * const emailTemplates = await prisma.emailTemplate.findMany()
      * ```
      */
    get emailTemplate(): Prisma.EmailTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inquiry`: Exposes CRUD operations for the **Inquiry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Inquiries
      * const inquiries = await prisma.inquiry.findMany()
      * ```
      */
    get inquiry(): Prisma.InquiryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inquiryResponse`: Exposes CRUD operations for the **InquiryResponse** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InquiryResponses
      * const inquiryResponses = await prisma.inquiryResponse.findMany()
      * ```
      */
    get inquiryResponse(): Prisma.InquiryResponseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.freeeIntegration`: Exposes CRUD operations for the **FreeeIntegration** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FreeeIntegrations
      * const freeeIntegrations = await prisma.freeeIntegration.findMany()
      * ```
      */
    get freeeIntegration(): Prisma.FreeeIntegrationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.freeeSyncLog`: Exposes CRUD operations for the **FreeeSyncLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FreeeSyncLogs
      * const freeeSyncLogs = await prisma.freeeSyncLog.findMany()
      * ```
      */
    get freeeSyncLog(): Prisma.FreeeSyncLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.customerFreeeMapping`: Exposes CRUD operations for the **CustomerFreeeMapping** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CustomerFreeeMappings
      * const customerFreeeMappings = await prisma.customerFreeeMapping.findMany()
      * ```
      */
    get customerFreeeMapping(): Prisma.CustomerFreeeMappingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dealFreeeMapping`: Exposes CRUD operations for the **DealFreeeMapping** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DealFreeeMappings
      * const dealFreeeMappings = await prisma.dealFreeeMapping.findMany()
      * ```
      */
    get dealFreeeMapping(): Prisma.DealFreeeMappingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.portfolio`: Exposes CRUD operations for the **Portfolio** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Portfolios
      * const portfolios = await prisma.portfolio.findMany()
      * ```
      */
    get portfolio(): Prisma.PortfolioDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.portfolioImage`: Exposes CRUD operations for the **PortfolioImage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PortfolioImages
      * const portfolioImages = await prisma.portfolioImage.findMany()
      * ```
      */
    get portfolioImage(): Prisma.PortfolioImageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.post`: Exposes CRUD operations for the **Post** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Posts
      * const posts = await prisma.post.findMany()
      * ```
      */
    get post(): Prisma.PostDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tags
      * const tags = await prisma.tag.findMany()
      * ```
      */
    get tag(): Prisma.TagDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.postTag`: Exposes CRUD operations for the **PostTag** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PostTags
      * const postTags = await prisma.postTag.findMany()
      * ```
      */
    get postTag(): Prisma.PostTagDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.postImage`: Exposes CRUD operations for the **PostImage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PostImages
      * const postImages = await prisma.postImage.findMany()
      * ```
      */
    get postImage(): Prisma.PostImageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userExperience`: Exposes CRUD operations for the **UserExperience** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserExperiences
      * const userExperiences = await prisma.userExperience.findMany()
      * ```
      */
    get userExperience(): Prisma.UserExperienceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userSocial`: Exposes CRUD operations for the **UserSocial** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserSocials
      * const userSocials = await prisma.userSocial.findMany()
      * ```
      */
    get userSocial(): Prisma.UserSocialDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map