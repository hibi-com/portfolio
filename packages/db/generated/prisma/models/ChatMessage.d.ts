import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ChatMessage
 *
 */
export type ChatMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$ChatMessagePayload>;
export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
export type ChatMessageMinAggregateOutputType = {
    id: string | null;
    chatRoomId: string | null;
    participantId: string | null;
    type: $Enums.ChatMessageType | null;
    content: string | null;
    metadata: string | null;
    readBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChatMessageMaxAggregateOutputType = {
    id: string | null;
    chatRoomId: string | null;
    participantId: string | null;
    type: $Enums.ChatMessageType | null;
    content: string | null;
    metadata: string | null;
    readBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChatMessageCountAggregateOutputType = {
    id: number;
    chatRoomId: number;
    participantId: number;
    type: number;
    content: number;
    metadata: number;
    readBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ChatMessageMinAggregateInputType = {
    id?: true;
    chatRoomId?: true;
    participantId?: true;
    type?: true;
    content?: true;
    metadata?: true;
    readBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChatMessageMaxAggregateInputType = {
    id?: true;
    chatRoomId?: true;
    participantId?: true;
    type?: true;
    content?: true;
    metadata?: true;
    readBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChatMessageCountAggregateInputType = {
    id?: true;
    chatRoomId?: true;
    participantId?: true;
    type?: true;
    content?: true;
    metadata?: true;
    readBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ChatMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChatMessages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType;
};
export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChatMessage[P]> : Prisma.GetScalarType<T[P], AggregateChatMessage[P]>;
};
export type ChatMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithAggregationInput | Prisma.ChatMessageOrderByWithAggregationInput[];
    by: Prisma.ChatMessageScalarFieldEnum[] | Prisma.ChatMessageScalarFieldEnum;
    having?: Prisma.ChatMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChatMessageCountAggregateInputType | true;
    _min?: ChatMessageMinAggregateInputType;
    _max?: ChatMessageMaxAggregateInputType;
};
export type ChatMessageGroupByOutputType = {
    id: string;
    chatRoomId: string;
    participantId: string;
    type: $Enums.ChatMessageType;
    content: string;
    metadata: string | null;
    readBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ChatMessageCountAggregateOutputType | null;
    _min: ChatMessageMinAggregateOutputType | null;
    _max: ChatMessageMaxAggregateOutputType | null;
};
type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChatMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChatMessageGroupByOutputType[P]>;
}>>;
export type ChatMessageWhereInput = {
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    id?: Prisma.StringFilter<"ChatMessage"> | string;
    chatRoomId?: Prisma.StringFilter<"ChatMessage"> | string;
    participantId?: Prisma.StringFilter<"ChatMessage"> | string;
    type?: Prisma.EnumChatMessageTypeFilter<"ChatMessage"> | $Enums.ChatMessageType;
    content?: Prisma.StringFilter<"ChatMessage"> | string;
    metadata?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    readBy?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    chatRoom?: Prisma.XOR<Prisma.ChatRoomScalarRelationFilter, Prisma.ChatRoomWhereInput>;
    participant?: Prisma.XOR<Prisma.ChatParticipantScalarRelationFilter, Prisma.ChatParticipantWhereInput>;
};
export type ChatMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    chatRoomId?: Prisma.SortOrder;
    participantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    readBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    chatRoom?: Prisma.ChatRoomOrderByWithRelationInput;
    participant?: Prisma.ChatParticipantOrderByWithRelationInput;
    _relevance?: Prisma.ChatMessageOrderByRelevanceInput;
};
export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    OR?: Prisma.ChatMessageWhereInput[];
    NOT?: Prisma.ChatMessageWhereInput | Prisma.ChatMessageWhereInput[];
    chatRoomId?: Prisma.StringFilter<"ChatMessage"> | string;
    participantId?: Prisma.StringFilter<"ChatMessage"> | string;
    type?: Prisma.EnumChatMessageTypeFilter<"ChatMessage"> | $Enums.ChatMessageType;
    content?: Prisma.StringFilter<"ChatMessage"> | string;
    metadata?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    readBy?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    chatRoom?: Prisma.XOR<Prisma.ChatRoomScalarRelationFilter, Prisma.ChatRoomWhereInput>;
    participant?: Prisma.XOR<Prisma.ChatParticipantScalarRelationFilter, Prisma.ChatParticipantWhereInput>;
}, "id">;
export type ChatMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    chatRoomId?: Prisma.SortOrder;
    participantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    readBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ChatMessageCountOrderByAggregateInput;
    _max?: Prisma.ChatMessageMaxOrderByAggregateInput;
    _min?: Prisma.ChatMessageMinOrderByAggregateInput;
};
export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChatMessageScalarWhereWithAggregatesInput | Prisma.ChatMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    chatRoomId?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    participantId?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    type?: Prisma.EnumChatMessageTypeWithAggregatesFilter<"ChatMessage"> | $Enums.ChatMessageType;
    content?: Prisma.StringWithAggregatesFilter<"ChatMessage"> | string;
    metadata?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    readBy?: Prisma.StringNullableWithAggregatesFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string;
};
export type ChatMessageCreateInput = {
    id?: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    chatRoom: Prisma.ChatRoomCreateNestedOneWithoutMessagesInput;
    participant: Prisma.ChatParticipantCreateNestedOneWithoutMessagesInput;
};
export type ChatMessageUncheckedCreateInput = {
    id?: string;
    chatRoomId: string;
    participantId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    chatRoom?: Prisma.ChatRoomUpdateOneRequiredWithoutMessagesNestedInput;
    participant?: Prisma.ChatParticipantUpdateOneRequiredWithoutMessagesNestedInput;
};
export type ChatMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatRoomId?: Prisma.StringFieldUpdateOperationsInput | string;
    participantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageCreateManyInput = {
    id?: string;
    chatRoomId: string;
    participantId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatRoomId?: Prisma.StringFieldUpdateOperationsInput | string;
    participantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageListRelationFilter = {
    every?: Prisma.ChatMessageWhereInput;
    some?: Prisma.ChatMessageWhereInput;
    none?: Prisma.ChatMessageWhereInput;
};
export type ChatMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChatMessageOrderByRelevanceInput = {
    fields: Prisma.ChatMessageOrderByRelevanceFieldEnum | Prisma.ChatMessageOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ChatMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chatRoomId?: Prisma.SortOrder;
    participantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChatMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chatRoomId?: Prisma.SortOrder;
    participantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChatMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    chatRoomId?: Prisma.SortOrder;
    participantId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    readBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChatMessageCreateNestedManyWithoutChatRoomInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput> | Prisma.ChatMessageCreateWithoutChatRoomInput[] | Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput | Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput[];
    createMany?: Prisma.ChatMessageCreateManyChatRoomInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUncheckedCreateNestedManyWithoutChatRoomInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput> | Prisma.ChatMessageCreateWithoutChatRoomInput[] | Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput | Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput[];
    createMany?: Prisma.ChatMessageCreateManyChatRoomInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUpdateManyWithoutChatRoomNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput> | Prisma.ChatMessageCreateWithoutChatRoomInput[] | Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput | Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutChatRoomInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutChatRoomInput[];
    createMany?: Prisma.ChatMessageCreateManyChatRoomInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutChatRoomInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutChatRoomInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutChatRoomInput | Prisma.ChatMessageUpdateManyWithWhereWithoutChatRoomInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageUncheckedUpdateManyWithoutChatRoomNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput> | Prisma.ChatMessageCreateWithoutChatRoomInput[] | Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput | Prisma.ChatMessageCreateOrConnectWithoutChatRoomInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutChatRoomInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutChatRoomInput[];
    createMany?: Prisma.ChatMessageCreateManyChatRoomInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutChatRoomInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutChatRoomInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutChatRoomInput | Prisma.ChatMessageUpdateManyWithWhereWithoutChatRoomInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageCreateNestedManyWithoutParticipantInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput> | Prisma.ChatMessageCreateWithoutParticipantInput[] | Prisma.ChatMessageUncheckedCreateWithoutParticipantInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutParticipantInput | Prisma.ChatMessageCreateOrConnectWithoutParticipantInput[];
    createMany?: Prisma.ChatMessageCreateManyParticipantInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput> | Prisma.ChatMessageCreateWithoutParticipantInput[] | Prisma.ChatMessageUncheckedCreateWithoutParticipantInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutParticipantInput | Prisma.ChatMessageCreateOrConnectWithoutParticipantInput[];
    createMany?: Prisma.ChatMessageCreateManyParticipantInputEnvelope;
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
};
export type ChatMessageUpdateManyWithoutParticipantNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput> | Prisma.ChatMessageCreateWithoutParticipantInput[] | Prisma.ChatMessageUncheckedCreateWithoutParticipantInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutParticipantInput | Prisma.ChatMessageCreateOrConnectWithoutParticipantInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutParticipantInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutParticipantInput[];
    createMany?: Prisma.ChatMessageCreateManyParticipantInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutParticipantInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutParticipantInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutParticipantInput | Prisma.ChatMessageUpdateManyWithWhereWithoutParticipantInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type ChatMessageUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput> | Prisma.ChatMessageCreateWithoutParticipantInput[] | Prisma.ChatMessageUncheckedCreateWithoutParticipantInput[];
    connectOrCreate?: Prisma.ChatMessageCreateOrConnectWithoutParticipantInput | Prisma.ChatMessageCreateOrConnectWithoutParticipantInput[];
    upsert?: Prisma.ChatMessageUpsertWithWhereUniqueWithoutParticipantInput | Prisma.ChatMessageUpsertWithWhereUniqueWithoutParticipantInput[];
    createMany?: Prisma.ChatMessageCreateManyParticipantInputEnvelope;
    set?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    disconnect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    delete?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    connect?: Prisma.ChatMessageWhereUniqueInput | Prisma.ChatMessageWhereUniqueInput[];
    update?: Prisma.ChatMessageUpdateWithWhereUniqueWithoutParticipantInput | Prisma.ChatMessageUpdateWithWhereUniqueWithoutParticipantInput[];
    updateMany?: Prisma.ChatMessageUpdateManyWithWhereWithoutParticipantInput | Prisma.ChatMessageUpdateManyWithWhereWithoutParticipantInput[];
    deleteMany?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
};
export type EnumChatMessageTypeFieldUpdateOperationsInput = {
    set?: $Enums.ChatMessageType;
};
export type ChatMessageCreateWithoutChatRoomInput = {
    id?: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    participant: Prisma.ChatParticipantCreateNestedOneWithoutMessagesInput;
};
export type ChatMessageUncheckedCreateWithoutChatRoomInput = {
    id?: string;
    participantId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageCreateOrConnectWithoutChatRoomInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput>;
};
export type ChatMessageCreateManyChatRoomInputEnvelope = {
    data: Prisma.ChatMessageCreateManyChatRoomInput | Prisma.ChatMessageCreateManyChatRoomInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageUpsertWithWhereUniqueWithoutChatRoomInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChatMessageUpdateWithoutChatRoomInput, Prisma.ChatMessageUncheckedUpdateWithoutChatRoomInput>;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutChatRoomInput, Prisma.ChatMessageUncheckedCreateWithoutChatRoomInput>;
};
export type ChatMessageUpdateWithWhereUniqueWithoutChatRoomInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateWithoutChatRoomInput, Prisma.ChatMessageUncheckedUpdateWithoutChatRoomInput>;
};
export type ChatMessageUpdateManyWithWhereWithoutChatRoomInput = {
    where: Prisma.ChatMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyWithoutChatRoomInput>;
};
export type ChatMessageScalarWhereInput = {
    AND?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    OR?: Prisma.ChatMessageScalarWhereInput[];
    NOT?: Prisma.ChatMessageScalarWhereInput | Prisma.ChatMessageScalarWhereInput[];
    id?: Prisma.StringFilter<"ChatMessage"> | string;
    chatRoomId?: Prisma.StringFilter<"ChatMessage"> | string;
    participantId?: Prisma.StringFilter<"ChatMessage"> | string;
    type?: Prisma.EnumChatMessageTypeFilter<"ChatMessage"> | $Enums.ChatMessageType;
    content?: Prisma.StringFilter<"ChatMessage"> | string;
    metadata?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    readBy?: Prisma.StringNullableFilter<"ChatMessage"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ChatMessage"> | Date | string;
};
export type ChatMessageCreateWithoutParticipantInput = {
    id?: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    chatRoom: Prisma.ChatRoomCreateNestedOneWithoutMessagesInput;
};
export type ChatMessageUncheckedCreateWithoutParticipantInput = {
    id?: string;
    chatRoomId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageCreateOrConnectWithoutParticipantInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput>;
};
export type ChatMessageCreateManyParticipantInputEnvelope = {
    data: Prisma.ChatMessageCreateManyParticipantInput | Prisma.ChatMessageCreateManyParticipantInput[];
    skipDuplicates?: boolean;
};
export type ChatMessageUpsertWithWhereUniqueWithoutParticipantInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChatMessageUpdateWithoutParticipantInput, Prisma.ChatMessageUncheckedUpdateWithoutParticipantInput>;
    create: Prisma.XOR<Prisma.ChatMessageCreateWithoutParticipantInput, Prisma.ChatMessageUncheckedCreateWithoutParticipantInput>;
};
export type ChatMessageUpdateWithWhereUniqueWithoutParticipantInput = {
    where: Prisma.ChatMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateWithoutParticipantInput, Prisma.ChatMessageUncheckedUpdateWithoutParticipantInput>;
};
export type ChatMessageUpdateManyWithWhereWithoutParticipantInput = {
    where: Prisma.ChatMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyWithoutParticipantInput>;
};
export type ChatMessageCreateManyChatRoomInput = {
    id?: string;
    participantId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageUpdateWithoutChatRoomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    participant?: Prisma.ChatParticipantUpdateOneRequiredWithoutMessagesNestedInput;
};
export type ChatMessageUncheckedUpdateWithoutChatRoomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    participantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateManyWithoutChatRoomInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    participantId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageCreateManyParticipantInput = {
    id?: string;
    chatRoomId: string;
    type?: $Enums.ChatMessageType;
    content: string;
    metadata?: string | null;
    readBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChatMessageUpdateWithoutParticipantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    chatRoom?: Prisma.ChatRoomUpdateOneRequiredWithoutMessagesNestedInput;
};
export type ChatMessageUncheckedUpdateWithoutParticipantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatRoomId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageUncheckedUpdateManyWithoutParticipantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    chatRoomId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumChatMessageTypeFieldUpdateOperationsInput | $Enums.ChatMessageType;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    readBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChatMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    chatRoomId?: boolean;
    participantId?: boolean;
    type?: boolean;
    content?: boolean;
    metadata?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    chatRoom?: boolean | Prisma.ChatRoomDefaultArgs<ExtArgs>;
    participant?: boolean | Prisma.ChatParticipantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["chatMessage"]>;
export type ChatMessageSelectScalar = {
    id?: boolean;
    chatRoomId?: boolean;
    participantId?: boolean;
    type?: boolean;
    content?: boolean;
    metadata?: boolean;
    readBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ChatMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "chatRoomId" | "participantId" | "type" | "content" | "metadata" | "readBy" | "createdAt" | "updatedAt", ExtArgs["result"]["chatMessage"]>;
export type ChatMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    chatRoom?: boolean | Prisma.ChatRoomDefaultArgs<ExtArgs>;
    participant?: boolean | Prisma.ChatParticipantDefaultArgs<ExtArgs>;
};
export type $ChatMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChatMessage";
    objects: {
        chatRoom: Prisma.$ChatRoomPayload<ExtArgs>;
        participant: Prisma.$ChatParticipantPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        chatRoomId: string;
        participantId: string;
        type: $Enums.ChatMessageType;
        content: string;
        metadata: string | null;
        readBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["chatMessage"]>;
    composites: {};
};
export type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload, S>;
export type ChatMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChatMessageCountAggregateInputType | true;
};
export interface ChatMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'];
        meta: {
            name: 'ChatMessage';
        };
    };
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     *
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     *
     */
    create<T extends ChatMessageCreateArgs>(args: Prisma.SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     *
     */
    delete<T extends ChatMessageDeleteArgs>(args: Prisma.SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ChatMessageUpdateArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: Prisma.SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__ChatMessageClient<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(args?: Prisma.Subset<T, ChatMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChatMessageCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Prisma.Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>;
    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends ChatMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChatMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: ChatMessageGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ChatMessage model
     */
    readonly fields: ChatMessageFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ChatMessage.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    chatRoom<T extends Prisma.ChatRoomDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChatRoomDefaultArgs<ExtArgs>>): Prisma.Prisma__ChatRoomClient<runtime.Types.Result.GetResult<Prisma.$ChatRoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    participant<T extends Prisma.ChatParticipantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChatParticipantDefaultArgs<ExtArgs>>): Prisma.Prisma__ChatParticipantClient<runtime.Types.Result.GetResult<Prisma.$ChatParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the ChatMessage model
 */
export interface ChatMessageFieldRefs {
    readonly id: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly chatRoomId: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly participantId: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly type: Prisma.FieldRef<"ChatMessage", 'ChatMessageType'>;
    readonly content: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly metadata: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly readBy: Prisma.FieldRef<"ChatMessage", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ChatMessage", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ChatMessage", 'DateTime'>;
}
/**
 * ChatMessage findUnique
 */
export type ChatMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: Prisma.ChatMessageWhereUniqueInput;
};
/**
 * ChatMessage findUniqueOrThrow
 */
export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: Prisma.ChatMessageWhereUniqueInput;
};
/**
 * ChatMessage findFirst
 */
export type ChatMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ChatMessages.
     */
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChatMessages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
/**
 * ChatMessage findFirstOrThrow
 */
export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ChatMessages.
     */
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChatMessages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
/**
 * ChatMessage findMany
 */
export type ChatMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ChatMessages.
     */
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ChatMessages.
     */
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
/**
 * ChatMessage create
 */
export type ChatMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * The data needed to create a ChatMessage.
     */
    data: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
};
/**
 * ChatMessage createMany
 */
export type ChatMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: Prisma.ChatMessageCreateManyInput | Prisma.ChatMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ChatMessage update
 */
export type ChatMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * The data needed to update a ChatMessage.
     */
    data: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
    /**
     * Choose, which ChatMessage to update.
     */
    where: Prisma.ChatMessageWhereUniqueInput;
};
/**
 * ChatMessage updateMany
 */
export type ChatMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: Prisma.XOR<Prisma.ChatMessageUpdateManyMutationInput, Prisma.ChatMessageUncheckedUpdateManyInput>;
    /**
     * Filter which ChatMessages to update
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number;
};
/**
 * ChatMessage upsert
 */
export type ChatMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: Prisma.ChatMessageWhereUniqueInput;
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: Prisma.XOR<Prisma.ChatMessageCreateInput, Prisma.ChatMessageUncheckedCreateInput>;
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ChatMessageUpdateInput, Prisma.ChatMessageUncheckedUpdateInput>;
};
/**
 * ChatMessage delete
 */
export type ChatMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    /**
     * Filter which ChatMessage to delete.
     */
    where: Prisma.ChatMessageWhereUniqueInput;
};
/**
 * ChatMessage deleteMany
 */
export type ChatMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: Prisma.ChatMessageWhereInput;
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number;
};
/**
 * ChatMessage without action
 */
export type ChatMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=ChatMessage.d.ts.map