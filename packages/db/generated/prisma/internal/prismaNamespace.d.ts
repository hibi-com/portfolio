import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.3.0
 * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Session: "Session";
    readonly Account: "Account";
    readonly Verification: "Verification";
    readonly ChatRoom: "ChatRoom";
    readonly ChatParticipant: "ChatParticipant";
    readonly ChatMessage: "ChatMessage";
    readonly Customer: "Customer";
    readonly Lead: "Lead";
    readonly Pipeline: "Pipeline";
    readonly PipelineStage: "PipelineStage";
    readonly Deal: "Deal";
    readonly ContactHistory: "ContactHistory";
    readonly EmailLog: "EmailLog";
    readonly EmailTemplate: "EmailTemplate";
    readonly Inquiry: "Inquiry";
    readonly InquiryResponse: "InquiryResponse";
    readonly FreeeIntegration: "FreeeIntegration";
    readonly FreeeSyncLog: "FreeeSyncLog";
    readonly CustomerFreeeMapping: "CustomerFreeeMapping";
    readonly DealFreeeMapping: "DealFreeeMapping";
    readonly Portfolio: "Portfolio";
    readonly PortfolioImage: "PortfolioImage";
    readonly Post: "Post";
    readonly Tag: "Tag";
    readonly PostTag: "PostTag";
    readonly PostImage: "PostImage";
    readonly UserExperience: "UserExperience";
    readonly UserSocial: "UserSocial";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "session" | "account" | "verification" | "chatRoom" | "chatParticipant" | "chatMessage" | "customer" | "lead" | "pipeline" | "pipelineStage" | "deal" | "contactHistory" | "emailLog" | "emailTemplate" | "inquiry" | "inquiryResponse" | "freeeIntegration" | "freeeSyncLog" | "customerFreeeMapping" | "dealFreeeMapping" | "portfolio" | "portfolioImage" | "post" | "tag" | "postTag" | "postImage" | "userExperience" | "userSocial";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Session: {
            payload: Prisma.$SessionPayload<ExtArgs>;
            fields: Prisma.SessionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SessionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                findFirst: {
                    args: Prisma.SessionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                findMany: {
                    args: Prisma.SessionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>[];
                };
                create: {
                    args: Prisma.SessionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                createMany: {
                    args: Prisma.SessionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SessionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                update: {
                    args: Prisma.SessionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                deleteMany: {
                    args: Prisma.SessionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SessionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SessionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SessionPayload>;
                };
                aggregate: {
                    args: Prisma.SessionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSession>;
                };
                groupBy: {
                    args: Prisma.SessionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SessionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SessionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SessionCountAggregateOutputType> | number;
                };
            };
        };
        Account: {
            payload: Prisma.$AccountPayload<ExtArgs>;
            fields: Prisma.AccountFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AccountFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                findFirst: {
                    args: Prisma.AccountFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                findMany: {
                    args: Prisma.AccountFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>[];
                };
                create: {
                    args: Prisma.AccountCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                createMany: {
                    args: Prisma.AccountCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.AccountDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                update: {
                    args: Prisma.AccountUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                deleteMany: {
                    args: Prisma.AccountDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AccountUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.AccountUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AccountPayload>;
                };
                aggregate: {
                    args: Prisma.AccountAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAccount>;
                };
                groupBy: {
                    args: Prisma.AccountGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AccountGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AccountCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AccountCountAggregateOutputType> | number;
                };
            };
        };
        Verification: {
            payload: Prisma.$VerificationPayload<ExtArgs>;
            fields: Prisma.VerificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VerificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                findFirst: {
                    args: Prisma.VerificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                findMany: {
                    args: Prisma.VerificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>[];
                };
                create: {
                    args: Prisma.VerificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                createMany: {
                    args: Prisma.VerificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.VerificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                update: {
                    args: Prisma.VerificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                deleteMany: {
                    args: Prisma.VerificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VerificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.VerificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VerificationPayload>;
                };
                aggregate: {
                    args: Prisma.VerificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVerification>;
                };
                groupBy: {
                    args: Prisma.VerificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VerificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VerificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VerificationCountAggregateOutputType> | number;
                };
            };
        };
        ChatRoom: {
            payload: Prisma.$ChatRoomPayload<ExtArgs>;
            fields: Prisma.ChatRoomFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChatRoomFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChatRoomFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                findFirst: {
                    args: Prisma.ChatRoomFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChatRoomFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                findMany: {
                    args: Prisma.ChatRoomFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>[];
                };
                create: {
                    args: Prisma.ChatRoomCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                createMany: {
                    args: Prisma.ChatRoomCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ChatRoomDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                update: {
                    args: Prisma.ChatRoomUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                deleteMany: {
                    args: Prisma.ChatRoomDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChatRoomUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ChatRoomUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatRoomPayload>;
                };
                aggregate: {
                    args: Prisma.ChatRoomAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChatRoom>;
                };
                groupBy: {
                    args: Prisma.ChatRoomGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatRoomGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChatRoomCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatRoomCountAggregateOutputType> | number;
                };
            };
        };
        ChatParticipant: {
            payload: Prisma.$ChatParticipantPayload<ExtArgs>;
            fields: Prisma.ChatParticipantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChatParticipantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChatParticipantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                findFirst: {
                    args: Prisma.ChatParticipantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChatParticipantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                findMany: {
                    args: Prisma.ChatParticipantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>[];
                };
                create: {
                    args: Prisma.ChatParticipantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                createMany: {
                    args: Prisma.ChatParticipantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ChatParticipantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                update: {
                    args: Prisma.ChatParticipantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                deleteMany: {
                    args: Prisma.ChatParticipantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChatParticipantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ChatParticipantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatParticipantPayload>;
                };
                aggregate: {
                    args: Prisma.ChatParticipantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChatParticipant>;
                };
                groupBy: {
                    args: Prisma.ChatParticipantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatParticipantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChatParticipantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatParticipantCountAggregateOutputType> | number;
                };
            };
        };
        ChatMessage: {
            payload: Prisma.$ChatMessagePayload<ExtArgs>;
            fields: Prisma.ChatMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                findFirst: {
                    args: Prisma.ChatMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                findMany: {
                    args: Prisma.ChatMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>[];
                };
                create: {
                    args: Prisma.ChatMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                createMany: {
                    args: Prisma.ChatMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ChatMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                update: {
                    args: Prisma.ChatMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ChatMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChatMessagePayload>;
                };
                aggregate: {
                    args: Prisma.ChatMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChatMessage>;
                };
                groupBy: {
                    args: Prisma.ChatMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChatMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChatMessageCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Lead: {
            payload: Prisma.$LeadPayload<ExtArgs>;
            fields: Prisma.LeadFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LeadFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                findFirst: {
                    args: Prisma.LeadFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                findMany: {
                    args: Prisma.LeadFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>[];
                };
                create: {
                    args: Prisma.LeadCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                createMany: {
                    args: Prisma.LeadCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.LeadDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                update: {
                    args: Prisma.LeadUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                deleteMany: {
                    args: Prisma.LeadDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LeadUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.LeadUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeadPayload>;
                };
                aggregate: {
                    args: Prisma.LeadAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLead>;
                };
                groupBy: {
                    args: Prisma.LeadGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LeadGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LeadCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LeadCountAggregateOutputType> | number;
                };
            };
        };
        Pipeline: {
            payload: Prisma.$PipelinePayload<ExtArgs>;
            fields: Prisma.PipelineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PipelineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PipelineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                findFirst: {
                    args: Prisma.PipelineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PipelineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                findMany: {
                    args: Prisma.PipelineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>[];
                };
                create: {
                    args: Prisma.PipelineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                createMany: {
                    args: Prisma.PipelineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PipelineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                update: {
                    args: Prisma.PipelineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                deleteMany: {
                    args: Prisma.PipelineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PipelineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PipelineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelinePayload>;
                };
                aggregate: {
                    args: Prisma.PipelineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePipeline>;
                };
                groupBy: {
                    args: Prisma.PipelineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PipelineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PipelineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PipelineCountAggregateOutputType> | number;
                };
            };
        };
        PipelineStage: {
            payload: Prisma.$PipelineStagePayload<ExtArgs>;
            fields: Prisma.PipelineStageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PipelineStageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PipelineStageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                findFirst: {
                    args: Prisma.PipelineStageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PipelineStageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                findMany: {
                    args: Prisma.PipelineStageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>[];
                };
                create: {
                    args: Prisma.PipelineStageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                createMany: {
                    args: Prisma.PipelineStageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PipelineStageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                update: {
                    args: Prisma.PipelineStageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                deleteMany: {
                    args: Prisma.PipelineStageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PipelineStageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PipelineStageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PipelineStagePayload>;
                };
                aggregate: {
                    args: Prisma.PipelineStageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePipelineStage>;
                };
                groupBy: {
                    args: Prisma.PipelineStageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PipelineStageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PipelineStageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PipelineStageCountAggregateOutputType> | number;
                };
            };
        };
        Deal: {
            payload: Prisma.$DealPayload<ExtArgs>;
            fields: Prisma.DealFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DealFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DealFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                findFirst: {
                    args: Prisma.DealFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DealFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                findMany: {
                    args: Prisma.DealFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>[];
                };
                create: {
                    args: Prisma.DealCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                createMany: {
                    args: Prisma.DealCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.DealDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                update: {
                    args: Prisma.DealUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                deleteMany: {
                    args: Prisma.DealDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DealUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.DealUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealPayload>;
                };
                aggregate: {
                    args: Prisma.DealAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDeal>;
                };
                groupBy: {
                    args: Prisma.DealGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DealGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DealCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DealCountAggregateOutputType> | number;
                };
            };
        };
        ContactHistory: {
            payload: Prisma.$ContactHistoryPayload<ExtArgs>;
            fields: Prisma.ContactHistoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ContactHistoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ContactHistoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                findFirst: {
                    args: Prisma.ContactHistoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ContactHistoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                findMany: {
                    args: Prisma.ContactHistoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>[];
                };
                create: {
                    args: Prisma.ContactHistoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                createMany: {
                    args: Prisma.ContactHistoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ContactHistoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                update: {
                    args: Prisma.ContactHistoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                deleteMany: {
                    args: Prisma.ContactHistoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ContactHistoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ContactHistoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ContactHistoryPayload>;
                };
                aggregate: {
                    args: Prisma.ContactHistoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateContactHistory>;
                };
                groupBy: {
                    args: Prisma.ContactHistoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ContactHistoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ContactHistoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ContactHistoryCountAggregateOutputType> | number;
                };
            };
        };
        EmailLog: {
            payload: Prisma.$EmailLogPayload<ExtArgs>;
            fields: Prisma.EmailLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                findFirst: {
                    args: Prisma.EmailLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                findMany: {
                    args: Prisma.EmailLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>[];
                };
                create: {
                    args: Prisma.EmailLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                createMany: {
                    args: Prisma.EmailLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.EmailLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                update: {
                    args: Prisma.EmailLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                deleteMany: {
                    args: Prisma.EmailLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.EmailLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailLogPayload>;
                };
                aggregate: {
                    args: Prisma.EmailLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailLog>;
                };
                groupBy: {
                    args: Prisma.EmailLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailLogCountAggregateOutputType> | number;
                };
            };
        };
        EmailTemplate: {
            payload: Prisma.$EmailTemplatePayload<ExtArgs>;
            fields: Prisma.EmailTemplateFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailTemplateFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailTemplateFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                findFirst: {
                    args: Prisma.EmailTemplateFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailTemplateFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                findMany: {
                    args: Prisma.EmailTemplateFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>[];
                };
                create: {
                    args: Prisma.EmailTemplateCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                createMany: {
                    args: Prisma.EmailTemplateCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.EmailTemplateDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                update: {
                    args: Prisma.EmailTemplateUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                deleteMany: {
                    args: Prisma.EmailTemplateDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailTemplateUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.EmailTemplateUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailTemplatePayload>;
                };
                aggregate: {
                    args: Prisma.EmailTemplateAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailTemplate>;
                };
                groupBy: {
                    args: Prisma.EmailTemplateGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailTemplateGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailTemplateCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailTemplateCountAggregateOutputType> | number;
                };
            };
        };
        Inquiry: {
            payload: Prisma.$InquiryPayload<ExtArgs>;
            fields: Prisma.InquiryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InquiryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InquiryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                findFirst: {
                    args: Prisma.InquiryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InquiryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                findMany: {
                    args: Prisma.InquiryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>[];
                };
                create: {
                    args: Prisma.InquiryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                createMany: {
                    args: Prisma.InquiryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.InquiryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                update: {
                    args: Prisma.InquiryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                deleteMany: {
                    args: Prisma.InquiryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InquiryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.InquiryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryPayload>;
                };
                aggregate: {
                    args: Prisma.InquiryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInquiry>;
                };
                groupBy: {
                    args: Prisma.InquiryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InquiryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InquiryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InquiryCountAggregateOutputType> | number;
                };
            };
        };
        InquiryResponse: {
            payload: Prisma.$InquiryResponsePayload<ExtArgs>;
            fields: Prisma.InquiryResponseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InquiryResponseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InquiryResponseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                findFirst: {
                    args: Prisma.InquiryResponseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InquiryResponseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                findMany: {
                    args: Prisma.InquiryResponseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>[];
                };
                create: {
                    args: Prisma.InquiryResponseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                createMany: {
                    args: Prisma.InquiryResponseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.InquiryResponseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                update: {
                    args: Prisma.InquiryResponseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                deleteMany: {
                    args: Prisma.InquiryResponseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InquiryResponseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.InquiryResponseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InquiryResponsePayload>;
                };
                aggregate: {
                    args: Prisma.InquiryResponseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInquiryResponse>;
                };
                groupBy: {
                    args: Prisma.InquiryResponseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InquiryResponseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InquiryResponseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InquiryResponseCountAggregateOutputType> | number;
                };
            };
        };
        FreeeIntegration: {
            payload: Prisma.$FreeeIntegrationPayload<ExtArgs>;
            fields: Prisma.FreeeIntegrationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FreeeIntegrationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FreeeIntegrationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                findFirst: {
                    args: Prisma.FreeeIntegrationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FreeeIntegrationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                findMany: {
                    args: Prisma.FreeeIntegrationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>[];
                };
                create: {
                    args: Prisma.FreeeIntegrationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                createMany: {
                    args: Prisma.FreeeIntegrationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.FreeeIntegrationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                update: {
                    args: Prisma.FreeeIntegrationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                deleteMany: {
                    args: Prisma.FreeeIntegrationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FreeeIntegrationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.FreeeIntegrationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeIntegrationPayload>;
                };
                aggregate: {
                    args: Prisma.FreeeIntegrationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFreeeIntegration>;
                };
                groupBy: {
                    args: Prisma.FreeeIntegrationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FreeeIntegrationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FreeeIntegrationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FreeeIntegrationCountAggregateOutputType> | number;
                };
            };
        };
        FreeeSyncLog: {
            payload: Prisma.$FreeeSyncLogPayload<ExtArgs>;
            fields: Prisma.FreeeSyncLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FreeeSyncLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FreeeSyncLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                findFirst: {
                    args: Prisma.FreeeSyncLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FreeeSyncLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                findMany: {
                    args: Prisma.FreeeSyncLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>[];
                };
                create: {
                    args: Prisma.FreeeSyncLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                createMany: {
                    args: Prisma.FreeeSyncLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.FreeeSyncLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                update: {
                    args: Prisma.FreeeSyncLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                deleteMany: {
                    args: Prisma.FreeeSyncLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FreeeSyncLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.FreeeSyncLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FreeeSyncLogPayload>;
                };
                aggregate: {
                    args: Prisma.FreeeSyncLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFreeeSyncLog>;
                };
                groupBy: {
                    args: Prisma.FreeeSyncLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FreeeSyncLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FreeeSyncLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FreeeSyncLogCountAggregateOutputType> | number;
                };
            };
        };
        CustomerFreeeMapping: {
            payload: Prisma.$CustomerFreeeMappingPayload<ExtArgs>;
            fields: Prisma.CustomerFreeeMappingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFreeeMappingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFreeeMappingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFreeeMappingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFreeeMappingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFreeeMappingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>[];
                };
                create: {
                    args: Prisma.CustomerFreeeMappingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                createMany: {
                    args: Prisma.CustomerFreeeMappingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.CustomerFreeeMappingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                update: {
                    args: Prisma.CustomerFreeeMappingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerFreeeMappingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerFreeeMappingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.CustomerFreeeMappingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerFreeeMappingPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerFreeeMappingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerFreeeMapping>;
                };
                groupBy: {
                    args: Prisma.CustomerFreeeMappingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerFreeeMappingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerFreeeMappingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerFreeeMappingCountAggregateOutputType> | number;
                };
            };
        };
        DealFreeeMapping: {
            payload: Prisma.$DealFreeeMappingPayload<ExtArgs>;
            fields: Prisma.DealFreeeMappingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DealFreeeMappingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DealFreeeMappingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                findFirst: {
                    args: Prisma.DealFreeeMappingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DealFreeeMappingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                findMany: {
                    args: Prisma.DealFreeeMappingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>[];
                };
                create: {
                    args: Prisma.DealFreeeMappingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                createMany: {
                    args: Prisma.DealFreeeMappingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.DealFreeeMappingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                update: {
                    args: Prisma.DealFreeeMappingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                deleteMany: {
                    args: Prisma.DealFreeeMappingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DealFreeeMappingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.DealFreeeMappingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DealFreeeMappingPayload>;
                };
                aggregate: {
                    args: Prisma.DealFreeeMappingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDealFreeeMapping>;
                };
                groupBy: {
                    args: Prisma.DealFreeeMappingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DealFreeeMappingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DealFreeeMappingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DealFreeeMappingCountAggregateOutputType> | number;
                };
            };
        };
        Portfolio: {
            payload: Prisma.$PortfolioPayload<ExtArgs>;
            fields: Prisma.PortfolioFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PortfolioFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PortfolioFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findFirst: {
                    args: Prisma.PortfolioFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PortfolioFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findMany: {
                    args: Prisma.PortfolioFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>[];
                };
                create: {
                    args: Prisma.PortfolioCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                createMany: {
                    args: Prisma.PortfolioCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PortfolioDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                update: {
                    args: Prisma.PortfolioUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                deleteMany: {
                    args: Prisma.PortfolioDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PortfolioUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PortfolioUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                aggregate: {
                    args: Prisma.PortfolioAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePortfolio>;
                };
                groupBy: {
                    args: Prisma.PortfolioGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PortfolioCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioCountAggregateOutputType> | number;
                };
            };
        };
        PortfolioImage: {
            payload: Prisma.$PortfolioImagePayload<ExtArgs>;
            fields: Prisma.PortfolioImageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PortfolioImageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PortfolioImageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                findFirst: {
                    args: Prisma.PortfolioImageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PortfolioImageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                findMany: {
                    args: Prisma.PortfolioImageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>[];
                };
                create: {
                    args: Prisma.PortfolioImageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                createMany: {
                    args: Prisma.PortfolioImageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PortfolioImageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                update: {
                    args: Prisma.PortfolioImageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                deleteMany: {
                    args: Prisma.PortfolioImageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PortfolioImageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PortfolioImageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioImagePayload>;
                };
                aggregate: {
                    args: Prisma.PortfolioImageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePortfolioImage>;
                };
                groupBy: {
                    args: Prisma.PortfolioImageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioImageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PortfolioImageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioImageCountAggregateOutputType> | number;
                };
            };
        };
        Post: {
            payload: Prisma.$PostPayload<ExtArgs>;
            fields: Prisma.PostFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                findFirst: {
                    args: Prisma.PostFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                findMany: {
                    args: Prisma.PostFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>[];
                };
                create: {
                    args: Prisma.PostCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                createMany: {
                    args: Prisma.PostCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PostDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                update: {
                    args: Prisma.PostUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                deleteMany: {
                    args: Prisma.PostDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PostUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostPayload>;
                };
                aggregate: {
                    args: Prisma.PostAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePost>;
                };
                groupBy: {
                    args: Prisma.PostGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostCountAggregateOutputType> | number;
                };
            };
        };
        Tag: {
            payload: Prisma.$TagPayload<ExtArgs>;
            fields: Prisma.TagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findFirst: {
                    args: Prisma.TagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findMany: {
                    args: Prisma.TagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                create: {
                    args: Prisma.TagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                createMany: {
                    args: Prisma.TagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                update: {
                    args: Prisma.TagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                deleteMany: {
                    args: Prisma.TagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                aggregate: {
                    args: Prisma.TagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTag>;
                };
                groupBy: {
                    args: Prisma.TagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagCountAggregateOutputType> | number;
                };
            };
        };
        PostTag: {
            payload: Prisma.$PostTagPayload<ExtArgs>;
            fields: Prisma.PostTagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostTagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostTagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                findFirst: {
                    args: Prisma.PostTagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostTagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                findMany: {
                    args: Prisma.PostTagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>[];
                };
                create: {
                    args: Prisma.PostTagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                createMany: {
                    args: Prisma.PostTagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PostTagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                update: {
                    args: Prisma.PostTagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                deleteMany: {
                    args: Prisma.PostTagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostTagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PostTagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostTagPayload>;
                };
                aggregate: {
                    args: Prisma.PostTagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePostTag>;
                };
                groupBy: {
                    args: Prisma.PostTagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostTagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostTagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostTagCountAggregateOutputType> | number;
                };
            };
        };
        PostImage: {
            payload: Prisma.$PostImagePayload<ExtArgs>;
            fields: Prisma.PostImageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PostImageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PostImageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                findFirst: {
                    args: Prisma.PostImageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PostImageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                findMany: {
                    args: Prisma.PostImageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>[];
                };
                create: {
                    args: Prisma.PostImageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                createMany: {
                    args: Prisma.PostImageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PostImageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                update: {
                    args: Prisma.PostImageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                deleteMany: {
                    args: Prisma.PostImageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PostImageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PostImageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PostImagePayload>;
                };
                aggregate: {
                    args: Prisma.PostImageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePostImage>;
                };
                groupBy: {
                    args: Prisma.PostImageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostImageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PostImageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PostImageCountAggregateOutputType> | number;
                };
            };
        };
        UserExperience: {
            payload: Prisma.$UserExperiencePayload<ExtArgs>;
            fields: Prisma.UserExperienceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserExperienceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserExperienceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                findFirst: {
                    args: Prisma.UserExperienceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserExperienceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                findMany: {
                    args: Prisma.UserExperienceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>[];
                };
                create: {
                    args: Prisma.UserExperienceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                createMany: {
                    args: Prisma.UserExperienceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserExperienceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                update: {
                    args: Prisma.UserExperienceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                deleteMany: {
                    args: Prisma.UserExperienceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserExperienceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserExperienceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserExperiencePayload>;
                };
                aggregate: {
                    args: Prisma.UserExperienceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserExperience>;
                };
                groupBy: {
                    args: Prisma.UserExperienceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserExperienceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserExperienceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserExperienceCountAggregateOutputType> | number;
                };
            };
        };
        UserSocial: {
            payload: Prisma.$UserSocialPayload<ExtArgs>;
            fields: Prisma.UserSocialFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserSocialFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserSocialFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                findFirst: {
                    args: Prisma.UserSocialFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserSocialFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                findMany: {
                    args: Prisma.UserSocialFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>[];
                };
                create: {
                    args: Prisma.UserSocialCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                createMany: {
                    args: Prisma.UserSocialCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserSocialDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                update: {
                    args: Prisma.UserSocialUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                deleteMany: {
                    args: Prisma.UserSocialDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserSocialUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserSocialUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserSocialPayload>;
                };
                aggregate: {
                    args: Prisma.UserSocialAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserSocial>;
                };
                groupBy: {
                    args: Prisma.UserSocialGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserSocialGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserSocialCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserSocialCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly emailVerified: "emailVerified";
    readonly image: "image";
    readonly bio: "bio";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly expiresAt: "expiresAt";
    readonly token: "token";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly accessTokenExpiresAt: "accessTokenExpiresAt";
    readonly refreshTokenExpiresAt: "refreshTokenExpiresAt";
    readonly scope: "scope";
    readonly password: "password";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const VerificationScalarFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum];
export declare const ChatRoomScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly inquiryId: "inquiryId";
    readonly name: "name";
    readonly status: "status";
    readonly metadata: "metadata";
    readonly closedAt: "closedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChatRoomScalarFieldEnum = (typeof ChatRoomScalarFieldEnum)[keyof typeof ChatRoomScalarFieldEnum];
export declare const ChatParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly chatRoomId: "chatRoomId";
    readonly userId: "userId";
    readonly name: "name";
    readonly role: "role";
    readonly isOnline: "isOnline";
    readonly lastSeenAt: "lastSeenAt";
    readonly joinedAt: "joinedAt";
    readonly leftAt: "leftAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChatParticipantScalarFieldEnum = (typeof ChatParticipantScalarFieldEnum)[keyof typeof ChatParticipantScalarFieldEnum];
export declare const ChatMessageScalarFieldEnum: {
    readonly id: "id";
    readonly chatRoomId: "chatRoomId";
    readonly participantId: "participantId";
    readonly type: "type";
    readonly content: "content";
    readonly metadata: "metadata";
    readonly readBy: "readBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company: "company";
    readonly website: "website";
    readonly address: "address";
    readonly notes: "notes";
    readonly status: "status";
    readonly tags: "tags";
    readonly customFields: "customFields";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const LeadScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company: "company";
    readonly source: "source";
    readonly status: "status";
    readonly score: "score";
    readonly notes: "notes";
    readonly convertedAt: "convertedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum];
export declare const PipelineScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly isDefault: "isDefault";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PipelineScalarFieldEnum = (typeof PipelineScalarFieldEnum)[keyof typeof PipelineScalarFieldEnum];
export declare const PipelineStageScalarFieldEnum: {
    readonly id: "id";
    readonly pipelineId: "pipelineId";
    readonly name: "name";
    readonly order: "order";
    readonly probability: "probability";
    readonly color: "color";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PipelineStageScalarFieldEnum = (typeof PipelineStageScalarFieldEnum)[keyof typeof PipelineStageScalarFieldEnum];
export declare const DealScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly leadId: "leadId";
    readonly stageId: "stageId";
    readonly name: "name";
    readonly value: "value";
    readonly currency: "currency";
    readonly expectedCloseDate: "expectedCloseDate";
    readonly actualCloseDate: "actualCloseDate";
    readonly status: "status";
    readonly notes: "notes";
    readonly lostReason: "lostReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DealScalarFieldEnum = (typeof DealScalarFieldEnum)[keyof typeof DealScalarFieldEnum];
export declare const ContactHistoryScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly userId: "userId";
    readonly type: "type";
    readonly subject: "subject";
    readonly content: "content";
    readonly contactedAt: "contactedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ContactHistoryScalarFieldEnum = (typeof ContactHistoryScalarFieldEnum)[keyof typeof ContactHistoryScalarFieldEnum];
export declare const EmailLogScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly templateId: "templateId";
    readonly resendId: "resendId";
    readonly fromEmail: "fromEmail";
    readonly toEmail: "toEmail";
    readonly ccEmail: "ccEmail";
    readonly bccEmail: "bccEmail";
    readonly subject: "subject";
    readonly htmlContent: "htmlContent";
    readonly textContent: "textContent";
    readonly status: "status";
    readonly errorMessage: "errorMessage";
    readonly sentAt: "sentAt";
    readonly deliveredAt: "deliveredAt";
    readonly openedAt: "openedAt";
    readonly clickedAt: "clickedAt";
    readonly bouncedAt: "bouncedAt";
    readonly metadata: "metadata";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EmailLogScalarFieldEnum = (typeof EmailLogScalarFieldEnum)[keyof typeof EmailLogScalarFieldEnum];
export declare const EmailTemplateScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly category: "category";
    readonly subject: "subject";
    readonly htmlContent: "htmlContent";
    readonly textContent: "textContent";
    readonly variables: "variables";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EmailTemplateScalarFieldEnum = (typeof EmailTemplateScalarFieldEnum)[keyof typeof EmailTemplateScalarFieldEnum];
export declare const InquiryScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly assigneeId: "assigneeId";
    readonly subject: "subject";
    readonly content: "content";
    readonly status: "status";
    readonly priority: "priority";
    readonly category: "category";
    readonly tags: "tags";
    readonly source: "source";
    readonly metadata: "metadata";
    readonly resolvedAt: "resolvedAt";
    readonly closedAt: "closedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InquiryScalarFieldEnum = (typeof InquiryScalarFieldEnum)[keyof typeof InquiryScalarFieldEnum];
export declare const InquiryResponseScalarFieldEnum: {
    readonly id: "id";
    readonly inquiryId: "inquiryId";
    readonly userId: "userId";
    readonly content: "content";
    readonly isInternal: "isInternal";
    readonly attachments: "attachments";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InquiryResponseScalarFieldEnum = (typeof InquiryResponseScalarFieldEnum)[keyof typeof InquiryResponseScalarFieldEnum];
export declare const FreeeIntegrationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly companyId: "companyId";
    readonly companyName: "companyName";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly tokenExpiresAt: "tokenExpiresAt";
    readonly scopes: "scopes";
    readonly isActive: "isActive";
    readonly lastSyncAt: "lastSyncAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FreeeIntegrationScalarFieldEnum = (typeof FreeeIntegrationScalarFieldEnum)[keyof typeof FreeeIntegrationScalarFieldEnum];
export declare const FreeeSyncLogScalarFieldEnum: {
    readonly id: "id";
    readonly integrationId: "integrationId";
    readonly direction: "direction";
    readonly status: "status";
    readonly entityType: "entityType";
    readonly totalRecords: "totalRecords";
    readonly successCount: "successCount";
    readonly errorCount: "errorCount";
    readonly errorDetails: "errorDetails";
    readonly startedAt: "startedAt";
    readonly completedAt: "completedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FreeeSyncLogScalarFieldEnum = (typeof FreeeSyncLogScalarFieldEnum)[keyof typeof FreeeSyncLogScalarFieldEnum];
export declare const CustomerFreeeMappingScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly freeePartnerId: "freeePartnerId";
    readonly freeeCompanyId: "freeeCompanyId";
    readonly lastSyncAt: "lastSyncAt";
    readonly syncHash: "syncHash";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerFreeeMappingScalarFieldEnum = (typeof CustomerFreeeMappingScalarFieldEnum)[keyof typeof CustomerFreeeMappingScalarFieldEnum];
export declare const DealFreeeMappingScalarFieldEnum: {
    readonly id: "id";
    readonly dealId: "dealId";
    readonly freeeDealId: "freeeDealId";
    readonly freeeCompanyId: "freeeCompanyId";
    readonly lastSyncAt: "lastSyncAt";
    readonly syncHash: "syncHash";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DealFreeeMappingScalarFieldEnum = (typeof DealFreeeMappingScalarFieldEnum)[keyof typeof DealFreeeMappingScalarFieldEnum];
export declare const PortfolioScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly company: "company";
    readonly date: "date";
    readonly current: "current";
    readonly overview: "overview";
    readonly description: "description";
    readonly content: "content";
    readonly thumbnailTemp: "thumbnailTemp";
    readonly intro: "intro";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PortfolioScalarFieldEnum = (typeof PortfolioScalarFieldEnum)[keyof typeof PortfolioScalarFieldEnum];
export declare const PortfolioImageScalarFieldEnum: {
    readonly id: "id";
    readonly portfolioId: "portfolioId";
    readonly url: "url";
};
export type PortfolioImageScalarFieldEnum = (typeof PortfolioImageScalarFieldEnum)[keyof typeof PortfolioImageScalarFieldEnum];
export declare const PostScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly date: "date";
    readonly description: "description";
    readonly content: "content";
    readonly contentRaw: "contentRaw";
    readonly imageTemp: "imageTemp";
    readonly sticky: "sticky";
    readonly intro: "intro";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum];
export declare const TagScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
};
export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum];
export declare const PostTagScalarFieldEnum: {
    readonly postId: "postId";
    readonly tagId: "tagId";
};
export type PostTagScalarFieldEnum = (typeof PostTagScalarFieldEnum)[keyof typeof PostTagScalarFieldEnum];
export declare const PostImageScalarFieldEnum: {
    readonly id: "id";
    readonly postId: "postId";
    readonly url: "url";
};
export type PostImageScalarFieldEnum = (typeof PostImageScalarFieldEnum)[keyof typeof PostImageScalarFieldEnum];
export declare const UserExperienceScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly company: "company";
    readonly companyUrl: "companyUrl";
    readonly contract: "contract";
    readonly date: "date";
    readonly dateStart: "dateStart";
    readonly dateEnd: "dateEnd";
    readonly description: "description";
    readonly highlights: "highlights";
    readonly image: "image";
    readonly tags: "tags";
    readonly title: "title";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserExperienceScalarFieldEnum = (typeof UserExperienceScalarFieldEnum)[keyof typeof UserExperienceScalarFieldEnum];
export declare const UserSocialScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly icon: "icon";
    readonly title: "title";
    readonly url: "url";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserSocialScalarFieldEnum = (typeof UserSocialScalarFieldEnum)[keyof typeof UserSocialScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly image: "image";
    readonly bio: "bio";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const SessionOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly token: "token";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly userId: "userId";
};
export type SessionOrderByRelevanceFieldEnum = (typeof SessionOrderByRelevanceFieldEnum)[keyof typeof SessionOrderByRelevanceFieldEnum];
export declare const AccountOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly accountId: "accountId";
    readonly providerId: "providerId";
    readonly userId: "userId";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly idToken: "idToken";
    readonly scope: "scope";
    readonly password: "password";
};
export type AccountOrderByRelevanceFieldEnum = (typeof AccountOrderByRelevanceFieldEnum)[keyof typeof AccountOrderByRelevanceFieldEnum];
export declare const VerificationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly identifier: "identifier";
    readonly value: "value";
};
export type VerificationOrderByRelevanceFieldEnum = (typeof VerificationOrderByRelevanceFieldEnum)[keyof typeof VerificationOrderByRelevanceFieldEnum];
export declare const ChatRoomOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly inquiryId: "inquiryId";
    readonly name: "name";
    readonly metadata: "metadata";
};
export type ChatRoomOrderByRelevanceFieldEnum = (typeof ChatRoomOrderByRelevanceFieldEnum)[keyof typeof ChatRoomOrderByRelevanceFieldEnum];
export declare const ChatParticipantOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly chatRoomId: "chatRoomId";
    readonly userId: "userId";
    readonly name: "name";
};
export type ChatParticipantOrderByRelevanceFieldEnum = (typeof ChatParticipantOrderByRelevanceFieldEnum)[keyof typeof ChatParticipantOrderByRelevanceFieldEnum];
export declare const ChatMessageOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly chatRoomId: "chatRoomId";
    readonly participantId: "participantId";
    readonly content: "content";
    readonly metadata: "metadata";
    readonly readBy: "readBy";
};
export type ChatMessageOrderByRelevanceFieldEnum = (typeof ChatMessageOrderByRelevanceFieldEnum)[keyof typeof ChatMessageOrderByRelevanceFieldEnum];
export declare const CustomerOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company: "company";
    readonly website: "website";
    readonly address: "address";
    readonly notes: "notes";
    readonly tags: "tags";
    readonly customFields: "customFields";
};
export type CustomerOrderByRelevanceFieldEnum = (typeof CustomerOrderByRelevanceFieldEnum)[keyof typeof CustomerOrderByRelevanceFieldEnum];
export declare const LeadOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company: "company";
    readonly source: "source";
    readonly notes: "notes";
};
export type LeadOrderByRelevanceFieldEnum = (typeof LeadOrderByRelevanceFieldEnum)[keyof typeof LeadOrderByRelevanceFieldEnum];
export declare const PipelineOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
};
export type PipelineOrderByRelevanceFieldEnum = (typeof PipelineOrderByRelevanceFieldEnum)[keyof typeof PipelineOrderByRelevanceFieldEnum];
export declare const PipelineStageOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly pipelineId: "pipelineId";
    readonly name: "name";
    readonly color: "color";
};
export type PipelineStageOrderByRelevanceFieldEnum = (typeof PipelineStageOrderByRelevanceFieldEnum)[keyof typeof PipelineStageOrderByRelevanceFieldEnum];
export declare const DealOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly leadId: "leadId";
    readonly stageId: "stageId";
    readonly name: "name";
    readonly currency: "currency";
    readonly notes: "notes";
    readonly lostReason: "lostReason";
};
export type DealOrderByRelevanceFieldEnum = (typeof DealOrderByRelevanceFieldEnum)[keyof typeof DealOrderByRelevanceFieldEnum];
export declare const ContactHistoryOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly userId: "userId";
    readonly subject: "subject";
    readonly content: "content";
};
export type ContactHistoryOrderByRelevanceFieldEnum = (typeof ContactHistoryOrderByRelevanceFieldEnum)[keyof typeof ContactHistoryOrderByRelevanceFieldEnum];
export declare const EmailLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly templateId: "templateId";
    readonly resendId: "resendId";
    readonly fromEmail: "fromEmail";
    readonly toEmail: "toEmail";
    readonly ccEmail: "ccEmail";
    readonly bccEmail: "bccEmail";
    readonly subject: "subject";
    readonly htmlContent: "htmlContent";
    readonly textContent: "textContent";
    readonly errorMessage: "errorMessage";
    readonly metadata: "metadata";
};
export type EmailLogOrderByRelevanceFieldEnum = (typeof EmailLogOrderByRelevanceFieldEnum)[keyof typeof EmailLogOrderByRelevanceFieldEnum];
export declare const EmailTemplateOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly description: "description";
    readonly subject: "subject";
    readonly htmlContent: "htmlContent";
    readonly textContent: "textContent";
    readonly variables: "variables";
};
export type EmailTemplateOrderByRelevanceFieldEnum = (typeof EmailTemplateOrderByRelevanceFieldEnum)[keyof typeof EmailTemplateOrderByRelevanceFieldEnum];
export declare const InquiryOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly assigneeId: "assigneeId";
    readonly subject: "subject";
    readonly content: "content";
    readonly tags: "tags";
    readonly source: "source";
    readonly metadata: "metadata";
};
export type InquiryOrderByRelevanceFieldEnum = (typeof InquiryOrderByRelevanceFieldEnum)[keyof typeof InquiryOrderByRelevanceFieldEnum];
export declare const InquiryResponseOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly inquiryId: "inquiryId";
    readonly userId: "userId";
    readonly content: "content";
    readonly attachments: "attachments";
};
export type InquiryResponseOrderByRelevanceFieldEnum = (typeof InquiryResponseOrderByRelevanceFieldEnum)[keyof typeof InquiryResponseOrderByRelevanceFieldEnum];
export declare const FreeeIntegrationOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly companyName: "companyName";
    readonly accessToken: "accessToken";
    readonly refreshToken: "refreshToken";
    readonly scopes: "scopes";
};
export type FreeeIntegrationOrderByRelevanceFieldEnum = (typeof FreeeIntegrationOrderByRelevanceFieldEnum)[keyof typeof FreeeIntegrationOrderByRelevanceFieldEnum];
export declare const FreeeSyncLogOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly integrationId: "integrationId";
    readonly entityType: "entityType";
    readonly errorDetails: "errorDetails";
};
export type FreeeSyncLogOrderByRelevanceFieldEnum = (typeof FreeeSyncLogOrderByRelevanceFieldEnum)[keyof typeof FreeeSyncLogOrderByRelevanceFieldEnum];
export declare const CustomerFreeeMappingOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly syncHash: "syncHash";
};
export type CustomerFreeeMappingOrderByRelevanceFieldEnum = (typeof CustomerFreeeMappingOrderByRelevanceFieldEnum)[keyof typeof CustomerFreeeMappingOrderByRelevanceFieldEnum];
export declare const DealFreeeMappingOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly dealId: "dealId";
    readonly syncHash: "syncHash";
};
export type DealFreeeMappingOrderByRelevanceFieldEnum = (typeof DealFreeeMappingOrderByRelevanceFieldEnum)[keyof typeof DealFreeeMappingOrderByRelevanceFieldEnum];
export declare const PortfolioOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly company: "company";
    readonly overview: "overview";
    readonly description: "description";
    readonly content: "content";
    readonly thumbnailTemp: "thumbnailTemp";
    readonly intro: "intro";
};
export type PortfolioOrderByRelevanceFieldEnum = (typeof PortfolioOrderByRelevanceFieldEnum)[keyof typeof PortfolioOrderByRelevanceFieldEnum];
export declare const PortfolioImageOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly portfolioId: "portfolioId";
    readonly url: "url";
};
export type PortfolioImageOrderByRelevanceFieldEnum = (typeof PortfolioImageOrderByRelevanceFieldEnum)[keyof typeof PortfolioImageOrderByRelevanceFieldEnum];
export declare const PostOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly slug: "slug";
    readonly description: "description";
    readonly content: "content";
    readonly contentRaw: "contentRaw";
    readonly imageTemp: "imageTemp";
    readonly intro: "intro";
};
export type PostOrderByRelevanceFieldEnum = (typeof PostOrderByRelevanceFieldEnum)[keyof typeof PostOrderByRelevanceFieldEnum];
export declare const TagOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly name: "name";
};
export type TagOrderByRelevanceFieldEnum = (typeof TagOrderByRelevanceFieldEnum)[keyof typeof TagOrderByRelevanceFieldEnum];
export declare const PostTagOrderByRelevanceFieldEnum: {
    readonly postId: "postId";
    readonly tagId: "tagId";
};
export type PostTagOrderByRelevanceFieldEnum = (typeof PostTagOrderByRelevanceFieldEnum)[keyof typeof PostTagOrderByRelevanceFieldEnum];
export declare const PostImageOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly postId: "postId";
    readonly url: "url";
};
export type PostImageOrderByRelevanceFieldEnum = (typeof PostImageOrderByRelevanceFieldEnum)[keyof typeof PostImageOrderByRelevanceFieldEnum];
export declare const UserExperienceOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly company: "company";
    readonly companyUrl: "companyUrl";
    readonly date: "date";
    readonly description: "description";
    readonly highlights: "highlights";
    readonly image: "image";
    readonly tags: "tags";
    readonly title: "title";
};
export type UserExperienceOrderByRelevanceFieldEnum = (typeof UserExperienceOrderByRelevanceFieldEnum)[keyof typeof UserExperienceOrderByRelevanceFieldEnum];
export declare const UserSocialOrderByRelevanceFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly icon: "icon";
    readonly title: "title";
    readonly url: "url";
};
export type UserSocialOrderByRelevanceFieldEnum = (typeof UserSocialOrderByRelevanceFieldEnum)[keyof typeof UserSocialOrderByRelevanceFieldEnum];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'ChatRoomStatus'
 */
export type EnumChatRoomStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatRoomStatus'>;
/**
 * Reference to a field of type 'ChatParticipantRole'
 */
export type EnumChatParticipantRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatParticipantRole'>;
/**
 * Reference to a field of type 'ChatMessageType'
 */
export type EnumChatMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatMessageType'>;
/**
 * Reference to a field of type 'CustomerStatus'
 */
export type EnumCustomerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CustomerStatus'>;
/**
 * Reference to a field of type 'LeadStatus'
 */
export type EnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'DealStatus'
 */
export type EnumDealStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DealStatus'>;
/**
 * Reference to a field of type 'ContactType'
 */
export type EnumContactTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContactType'>;
/**
 * Reference to a field of type 'EmailStatus'
 */
export type EnumEmailStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmailStatus'>;
/**
 * Reference to a field of type 'EmailTemplateCategory'
 */
export type EnumEmailTemplateCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmailTemplateCategory'>;
/**
 * Reference to a field of type 'InquiryStatus'
 */
export type EnumInquiryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryStatus'>;
/**
 * Reference to a field of type 'InquiryPriority'
 */
export type EnumInquiryPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryPriority'>;
/**
 * Reference to a field of type 'InquiryCategory'
 */
export type EnumInquiryCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryCategory'>;
/**
 * Reference to a field of type 'SyncDirection'
 */
export type EnumSyncDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SyncDirection'>;
/**
 * Reference to a field of type 'SyncStatus'
 */
export type EnumSyncStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SyncStatus'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    session?: Prisma.SessionOmit;
    account?: Prisma.AccountOmit;
    verification?: Prisma.VerificationOmit;
    chatRoom?: Prisma.ChatRoomOmit;
    chatParticipant?: Prisma.ChatParticipantOmit;
    chatMessage?: Prisma.ChatMessageOmit;
    customer?: Prisma.CustomerOmit;
    lead?: Prisma.LeadOmit;
    pipeline?: Prisma.PipelineOmit;
    pipelineStage?: Prisma.PipelineStageOmit;
    deal?: Prisma.DealOmit;
    contactHistory?: Prisma.ContactHistoryOmit;
    emailLog?: Prisma.EmailLogOmit;
    emailTemplate?: Prisma.EmailTemplateOmit;
    inquiry?: Prisma.InquiryOmit;
    inquiryResponse?: Prisma.InquiryResponseOmit;
    freeeIntegration?: Prisma.FreeeIntegrationOmit;
    freeeSyncLog?: Prisma.FreeeSyncLogOmit;
    customerFreeeMapping?: Prisma.CustomerFreeeMappingOmit;
    dealFreeeMapping?: Prisma.DealFreeeMappingOmit;
    portfolio?: Prisma.PortfolioOmit;
    portfolioImage?: Prisma.PortfolioImageOmit;
    post?: Prisma.PostOmit;
    tag?: Prisma.TagOmit;
    postTag?: Prisma.PostTagOmit;
    postImage?: Prisma.PostImageOmit;
    userExperience?: Prisma.UserExperienceOmit;
    userSocial?: Prisma.UserSocialOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map