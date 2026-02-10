import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model InquiryResponse
 *
 */
export type InquiryResponseModel = runtime.Types.Result.DefaultSelection<Prisma.$InquiryResponsePayload>;
export type AggregateInquiryResponse = {
    _count: InquiryResponseCountAggregateOutputType | null;
    _min: InquiryResponseMinAggregateOutputType | null;
    _max: InquiryResponseMaxAggregateOutputType | null;
};
export type InquiryResponseMinAggregateOutputType = {
    id: string | null;
    inquiryId: string | null;
    userId: string | null;
    content: string | null;
    isInternal: boolean | null;
    attachments: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InquiryResponseMaxAggregateOutputType = {
    id: string | null;
    inquiryId: string | null;
    userId: string | null;
    content: string | null;
    isInternal: boolean | null;
    attachments: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InquiryResponseCountAggregateOutputType = {
    id: number;
    inquiryId: number;
    userId: number;
    content: number;
    isInternal: number;
    attachments: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type InquiryResponseMinAggregateInputType = {
    id?: true;
    inquiryId?: true;
    userId?: true;
    content?: true;
    isInternal?: true;
    attachments?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InquiryResponseMaxAggregateInputType = {
    id?: true;
    inquiryId?: true;
    userId?: true;
    content?: true;
    isInternal?: true;
    attachments?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InquiryResponseCountAggregateInputType = {
    id?: true;
    inquiryId?: true;
    userId?: true;
    content?: true;
    isInternal?: true;
    attachments?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type InquiryResponseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InquiryResponse to aggregate.
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InquiryResponses to fetch.
     */
    orderBy?: Prisma.InquiryResponseOrderByWithRelationInput | Prisma.InquiryResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.InquiryResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InquiryResponses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InquiryResponses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InquiryResponses
    **/
    _count?: true | InquiryResponseCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: InquiryResponseMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: InquiryResponseMaxAggregateInputType;
};
export type GetInquiryResponseAggregateType<T extends InquiryResponseAggregateArgs> = {
    [P in keyof T & keyof AggregateInquiryResponse]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInquiryResponse[P]> : Prisma.GetScalarType<T[P], AggregateInquiryResponse[P]>;
};
export type InquiryResponseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryResponseWhereInput;
    orderBy?: Prisma.InquiryResponseOrderByWithAggregationInput | Prisma.InquiryResponseOrderByWithAggregationInput[];
    by: Prisma.InquiryResponseScalarFieldEnum[] | Prisma.InquiryResponseScalarFieldEnum;
    having?: Prisma.InquiryResponseScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InquiryResponseCountAggregateInputType | true;
    _min?: InquiryResponseMinAggregateInputType;
    _max?: InquiryResponseMaxAggregateInputType;
};
export type InquiryResponseGroupByOutputType = {
    id: string;
    inquiryId: string;
    userId: string | null;
    content: string;
    isInternal: boolean;
    attachments: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: InquiryResponseCountAggregateOutputType | null;
    _min: InquiryResponseMinAggregateOutputType | null;
    _max: InquiryResponseMaxAggregateOutputType | null;
};
type GetInquiryResponseGroupByPayload<T extends InquiryResponseGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InquiryResponseGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InquiryResponseGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InquiryResponseGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InquiryResponseGroupByOutputType[P]>;
}>>;
export type InquiryResponseWhereInput = {
    AND?: Prisma.InquiryResponseWhereInput | Prisma.InquiryResponseWhereInput[];
    OR?: Prisma.InquiryResponseWhereInput[];
    NOT?: Prisma.InquiryResponseWhereInput | Prisma.InquiryResponseWhereInput[];
    id?: Prisma.StringFilter<"InquiryResponse"> | string;
    inquiryId?: Prisma.StringFilter<"InquiryResponse"> | string;
    userId?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    content?: Prisma.StringFilter<"InquiryResponse"> | string;
    isInternal?: Prisma.BoolFilter<"InquiryResponse"> | boolean;
    attachments?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
    inquiry?: Prisma.XOR<Prisma.InquiryScalarRelationFilter, Prisma.InquiryWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type InquiryResponseOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    inquiryId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isInternal?: Prisma.SortOrder;
    attachments?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inquiry?: Prisma.InquiryOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.InquiryResponseOrderByRelevanceInput;
};
export type InquiryResponseWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.InquiryResponseWhereInput | Prisma.InquiryResponseWhereInput[];
    OR?: Prisma.InquiryResponseWhereInput[];
    NOT?: Prisma.InquiryResponseWhereInput | Prisma.InquiryResponseWhereInput[];
    inquiryId?: Prisma.StringFilter<"InquiryResponse"> | string;
    userId?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    content?: Prisma.StringFilter<"InquiryResponse"> | string;
    isInternal?: Prisma.BoolFilter<"InquiryResponse"> | boolean;
    attachments?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
    inquiry?: Prisma.XOR<Prisma.InquiryScalarRelationFilter, Prisma.InquiryWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type InquiryResponseOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    inquiryId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isInternal?: Prisma.SortOrder;
    attachments?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.InquiryResponseCountOrderByAggregateInput;
    _max?: Prisma.InquiryResponseMaxOrderByAggregateInput;
    _min?: Prisma.InquiryResponseMinOrderByAggregateInput;
};
export type InquiryResponseScalarWhereWithAggregatesInput = {
    AND?: Prisma.InquiryResponseScalarWhereWithAggregatesInput | Prisma.InquiryResponseScalarWhereWithAggregatesInput[];
    OR?: Prisma.InquiryResponseScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InquiryResponseScalarWhereWithAggregatesInput | Prisma.InquiryResponseScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"InquiryResponse"> | string;
    inquiryId?: Prisma.StringWithAggregatesFilter<"InquiryResponse"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"InquiryResponse"> | string | null;
    content?: Prisma.StringWithAggregatesFilter<"InquiryResponse"> | string;
    isInternal?: Prisma.BoolWithAggregatesFilter<"InquiryResponse"> | boolean;
    attachments?: Prisma.StringNullableWithAggregatesFilter<"InquiryResponse"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"InquiryResponse"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"InquiryResponse"> | Date | string;
};
export type InquiryResponseCreateInput = {
    id?: string;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inquiry: Prisma.InquiryCreateNestedOneWithoutResponsesInput;
    user?: Prisma.UserCreateNestedOneWithoutInquiryResponsesInput;
};
export type InquiryResponseUncheckedCreateInput = {
    id?: string;
    inquiryId: string;
    userId?: string | null;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inquiry?: Prisma.InquiryUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneWithoutInquiryResponsesNestedInput;
};
export type InquiryResponseUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inquiryId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseCreateManyInput = {
    id?: string;
    inquiryId: string;
    userId?: string | null;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inquiryId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseListRelationFilter = {
    every?: Prisma.InquiryResponseWhereInput;
    some?: Prisma.InquiryResponseWhereInput;
    none?: Prisma.InquiryResponseWhereInput;
};
export type InquiryResponseOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InquiryResponseOrderByRelevanceInput = {
    fields: Prisma.InquiryResponseOrderByRelevanceFieldEnum | Prisma.InquiryResponseOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type InquiryResponseCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inquiryId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isInternal?: Prisma.SortOrder;
    attachments?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryResponseMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inquiryId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isInternal?: Prisma.SortOrder;
    attachments?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryResponseMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    inquiryId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isInternal?: Prisma.SortOrder;
    attachments?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InquiryResponseCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput> | Prisma.InquiryResponseCreateWithoutUserInput[] | Prisma.InquiryResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutUserInput | Prisma.InquiryResponseCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.InquiryResponseCreateManyUserInputEnvelope;
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
};
export type InquiryResponseUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput> | Prisma.InquiryResponseCreateWithoutUserInput[] | Prisma.InquiryResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutUserInput | Prisma.InquiryResponseCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.InquiryResponseCreateManyUserInputEnvelope;
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
};
export type InquiryResponseUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput> | Prisma.InquiryResponseCreateWithoutUserInput[] | Prisma.InquiryResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutUserInput | Prisma.InquiryResponseCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.InquiryResponseUpsertWithWhereUniqueWithoutUserInput | Prisma.InquiryResponseUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.InquiryResponseCreateManyUserInputEnvelope;
    set?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    disconnect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    delete?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    update?: Prisma.InquiryResponseUpdateWithWhereUniqueWithoutUserInput | Prisma.InquiryResponseUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.InquiryResponseUpdateManyWithWhereWithoutUserInput | Prisma.InquiryResponseUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
};
export type InquiryResponseUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput> | Prisma.InquiryResponseCreateWithoutUserInput[] | Prisma.InquiryResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutUserInput | Prisma.InquiryResponseCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.InquiryResponseUpsertWithWhereUniqueWithoutUserInput | Prisma.InquiryResponseUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.InquiryResponseCreateManyUserInputEnvelope;
    set?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    disconnect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    delete?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    update?: Prisma.InquiryResponseUpdateWithWhereUniqueWithoutUserInput | Prisma.InquiryResponseUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.InquiryResponseUpdateManyWithWhereWithoutUserInput | Prisma.InquiryResponseUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
};
export type InquiryResponseCreateNestedManyWithoutInquiryInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput> | Prisma.InquiryResponseCreateWithoutInquiryInput[] | Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput | Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput[];
    createMany?: Prisma.InquiryResponseCreateManyInquiryInputEnvelope;
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
};
export type InquiryResponseUncheckedCreateNestedManyWithoutInquiryInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput> | Prisma.InquiryResponseCreateWithoutInquiryInput[] | Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput | Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput[];
    createMany?: Prisma.InquiryResponseCreateManyInquiryInputEnvelope;
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
};
export type InquiryResponseUpdateManyWithoutInquiryNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput> | Prisma.InquiryResponseCreateWithoutInquiryInput[] | Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput | Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput[];
    upsert?: Prisma.InquiryResponseUpsertWithWhereUniqueWithoutInquiryInput | Prisma.InquiryResponseUpsertWithWhereUniqueWithoutInquiryInput[];
    createMany?: Prisma.InquiryResponseCreateManyInquiryInputEnvelope;
    set?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    disconnect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    delete?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    update?: Prisma.InquiryResponseUpdateWithWhereUniqueWithoutInquiryInput | Prisma.InquiryResponseUpdateWithWhereUniqueWithoutInquiryInput[];
    updateMany?: Prisma.InquiryResponseUpdateManyWithWhereWithoutInquiryInput | Prisma.InquiryResponseUpdateManyWithWhereWithoutInquiryInput[];
    deleteMany?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
};
export type InquiryResponseUncheckedUpdateManyWithoutInquiryNestedInput = {
    create?: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput> | Prisma.InquiryResponseCreateWithoutInquiryInput[] | Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput[];
    connectOrCreate?: Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput | Prisma.InquiryResponseCreateOrConnectWithoutInquiryInput[];
    upsert?: Prisma.InquiryResponseUpsertWithWhereUniqueWithoutInquiryInput | Prisma.InquiryResponseUpsertWithWhereUniqueWithoutInquiryInput[];
    createMany?: Prisma.InquiryResponseCreateManyInquiryInputEnvelope;
    set?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    disconnect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    delete?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    connect?: Prisma.InquiryResponseWhereUniqueInput | Prisma.InquiryResponseWhereUniqueInput[];
    update?: Prisma.InquiryResponseUpdateWithWhereUniqueWithoutInquiryInput | Prisma.InquiryResponseUpdateWithWhereUniqueWithoutInquiryInput[];
    updateMany?: Prisma.InquiryResponseUpdateManyWithWhereWithoutInquiryInput | Prisma.InquiryResponseUpdateManyWithWhereWithoutInquiryInput[];
    deleteMany?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
};
export type InquiryResponseCreateWithoutUserInput = {
    id?: string;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inquiry: Prisma.InquiryCreateNestedOneWithoutResponsesInput;
};
export type InquiryResponseUncheckedCreateWithoutUserInput = {
    id?: string;
    inquiryId: string;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseCreateOrConnectWithoutUserInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput>;
};
export type InquiryResponseCreateManyUserInputEnvelope = {
    data: Prisma.InquiryResponseCreateManyUserInput | Prisma.InquiryResponseCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type InquiryResponseUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.InquiryResponseUpdateWithoutUserInput, Prisma.InquiryResponseUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.InquiryResponseCreateWithoutUserInput, Prisma.InquiryResponseUncheckedCreateWithoutUserInput>;
};
export type InquiryResponseUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.InquiryResponseUpdateWithoutUserInput, Prisma.InquiryResponseUncheckedUpdateWithoutUserInput>;
};
export type InquiryResponseUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.InquiryResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.InquiryResponseUpdateManyMutationInput, Prisma.InquiryResponseUncheckedUpdateManyWithoutUserInput>;
};
export type InquiryResponseScalarWhereInput = {
    AND?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
    OR?: Prisma.InquiryResponseScalarWhereInput[];
    NOT?: Prisma.InquiryResponseScalarWhereInput | Prisma.InquiryResponseScalarWhereInput[];
    id?: Prisma.StringFilter<"InquiryResponse"> | string;
    inquiryId?: Prisma.StringFilter<"InquiryResponse"> | string;
    userId?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    content?: Prisma.StringFilter<"InquiryResponse"> | string;
    isInternal?: Prisma.BoolFilter<"InquiryResponse"> | boolean;
    attachments?: Prisma.StringNullableFilter<"InquiryResponse"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InquiryResponse"> | Date | string;
};
export type InquiryResponseCreateWithoutInquiryInput = {
    id?: string;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutInquiryResponsesInput;
};
export type InquiryResponseUncheckedCreateWithoutInquiryInput = {
    id?: string;
    userId?: string | null;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseCreateOrConnectWithoutInquiryInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput>;
};
export type InquiryResponseCreateManyInquiryInputEnvelope = {
    data: Prisma.InquiryResponseCreateManyInquiryInput | Prisma.InquiryResponseCreateManyInquiryInput[];
    skipDuplicates?: boolean;
};
export type InquiryResponseUpsertWithWhereUniqueWithoutInquiryInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.InquiryResponseUpdateWithoutInquiryInput, Prisma.InquiryResponseUncheckedUpdateWithoutInquiryInput>;
    create: Prisma.XOR<Prisma.InquiryResponseCreateWithoutInquiryInput, Prisma.InquiryResponseUncheckedCreateWithoutInquiryInput>;
};
export type InquiryResponseUpdateWithWhereUniqueWithoutInquiryInput = {
    where: Prisma.InquiryResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.InquiryResponseUpdateWithoutInquiryInput, Prisma.InquiryResponseUncheckedUpdateWithoutInquiryInput>;
};
export type InquiryResponseUpdateManyWithWhereWithoutInquiryInput = {
    where: Prisma.InquiryResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.InquiryResponseUpdateManyMutationInput, Prisma.InquiryResponseUncheckedUpdateManyWithoutInquiryInput>;
};
export type InquiryResponseCreateManyUserInput = {
    id?: string;
    inquiryId: string;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inquiry?: Prisma.InquiryUpdateOneRequiredWithoutResponsesNestedInput;
};
export type InquiryResponseUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inquiryId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    inquiryId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseCreateManyInquiryInput = {
    id?: string;
    userId?: string | null;
    content: string;
    isInternal?: boolean;
    attachments?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InquiryResponseUpdateWithoutInquiryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutInquiryResponsesNestedInput;
};
export type InquiryResponseUncheckedUpdateWithoutInquiryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseUncheckedUpdateManyWithoutInquiryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isInternal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attachments?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InquiryResponseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    inquiryId?: boolean;
    userId?: boolean;
    content?: boolean;
    isInternal?: boolean;
    attachments?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inquiry?: boolean | Prisma.InquiryDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.InquiryResponse$userArgs<ExtArgs>;
}, ExtArgs["result"]["inquiryResponse"]>;
export type InquiryResponseSelectScalar = {
    id?: boolean;
    inquiryId?: boolean;
    userId?: boolean;
    content?: boolean;
    isInternal?: boolean;
    attachments?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type InquiryResponseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "inquiryId" | "userId" | "content" | "isInternal" | "attachments" | "createdAt" | "updatedAt", ExtArgs["result"]["inquiryResponse"]>;
export type InquiryResponseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    inquiry?: boolean | Prisma.InquiryDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.InquiryResponse$userArgs<ExtArgs>;
};
export type $InquiryResponsePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InquiryResponse";
    objects: {
        inquiry: Prisma.$InquiryPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        inquiryId: string;
        userId: string | null;
        content: string;
        isInternal: boolean;
        attachments: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["inquiryResponse"]>;
    composites: {};
};
export type InquiryResponseGetPayload<S extends boolean | null | undefined | InquiryResponseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload, S>;
export type InquiryResponseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InquiryResponseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InquiryResponseCountAggregateInputType | true;
};
export interface InquiryResponseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InquiryResponse'];
        meta: {
            name: 'InquiryResponse';
        };
    };
    /**
     * Find zero or one InquiryResponse that matches the filter.
     * @param {InquiryResponseFindUniqueArgs} args - Arguments to find a InquiryResponse
     * @example
     * // Get one InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InquiryResponseFindUniqueArgs>(args: Prisma.SelectSubset<T, InquiryResponseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one InquiryResponse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InquiryResponseFindUniqueOrThrowArgs} args - Arguments to find a InquiryResponse
     * @example
     * // Get one InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InquiryResponseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InquiryResponseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InquiryResponse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseFindFirstArgs} args - Arguments to find a InquiryResponse
     * @example
     * // Get one InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InquiryResponseFindFirstArgs>(args?: Prisma.SelectSubset<T, InquiryResponseFindFirstArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InquiryResponse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseFindFirstOrThrowArgs} args - Arguments to find a InquiryResponse
     * @example
     * // Get one InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InquiryResponseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InquiryResponseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more InquiryResponses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InquiryResponses
     * const inquiryResponses = await prisma.inquiryResponse.findMany()
     *
     * // Get first 10 InquiryResponses
     * const inquiryResponses = await prisma.inquiryResponse.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const inquiryResponseWithIdOnly = await prisma.inquiryResponse.findMany({ select: { id: true } })
     *
     */
    findMany<T extends InquiryResponseFindManyArgs>(args?: Prisma.SelectSubset<T, InquiryResponseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a InquiryResponse.
     * @param {InquiryResponseCreateArgs} args - Arguments to create a InquiryResponse.
     * @example
     * // Create one InquiryResponse
     * const InquiryResponse = await prisma.inquiryResponse.create({
     *   data: {
     *     // ... data to create a InquiryResponse
     *   }
     * })
     *
     */
    create<T extends InquiryResponseCreateArgs>(args: Prisma.SelectSubset<T, InquiryResponseCreateArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many InquiryResponses.
     * @param {InquiryResponseCreateManyArgs} args - Arguments to create many InquiryResponses.
     * @example
     * // Create many InquiryResponses
     * const inquiryResponse = await prisma.inquiryResponse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends InquiryResponseCreateManyArgs>(args?: Prisma.SelectSubset<T, InquiryResponseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a InquiryResponse.
     * @param {InquiryResponseDeleteArgs} args - Arguments to delete one InquiryResponse.
     * @example
     * // Delete one InquiryResponse
     * const InquiryResponse = await prisma.inquiryResponse.delete({
     *   where: {
     *     // ... filter to delete one InquiryResponse
     *   }
     * })
     *
     */
    delete<T extends InquiryResponseDeleteArgs>(args: Prisma.SelectSubset<T, InquiryResponseDeleteArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one InquiryResponse.
     * @param {InquiryResponseUpdateArgs} args - Arguments to update one InquiryResponse.
     * @example
     * // Update one InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends InquiryResponseUpdateArgs>(args: Prisma.SelectSubset<T, InquiryResponseUpdateArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more InquiryResponses.
     * @param {InquiryResponseDeleteManyArgs} args - Arguments to filter InquiryResponses to delete.
     * @example
     * // Delete a few InquiryResponses
     * const { count } = await prisma.inquiryResponse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends InquiryResponseDeleteManyArgs>(args?: Prisma.SelectSubset<T, InquiryResponseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InquiryResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InquiryResponses
     * const inquiryResponse = await prisma.inquiryResponse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends InquiryResponseUpdateManyArgs>(args: Prisma.SelectSubset<T, InquiryResponseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one InquiryResponse.
     * @param {InquiryResponseUpsertArgs} args - Arguments to update or create a InquiryResponse.
     * @example
     * // Update or create a InquiryResponse
     * const inquiryResponse = await prisma.inquiryResponse.upsert({
     *   create: {
     *     // ... data to create a InquiryResponse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InquiryResponse we want to update
     *   }
     * })
     */
    upsert<T extends InquiryResponseUpsertArgs>(args: Prisma.SelectSubset<T, InquiryResponseUpsertArgs<ExtArgs>>): Prisma.Prisma__InquiryResponseClient<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of InquiryResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseCountArgs} args - Arguments to filter InquiryResponses to count.
     * @example
     * // Count the number of InquiryResponses
     * const count = await prisma.inquiryResponse.count({
     *   where: {
     *     // ... the filter for the InquiryResponses we want to count
     *   }
     * })
    **/
    count<T extends InquiryResponseCountArgs>(args?: Prisma.Subset<T, InquiryResponseCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InquiryResponseCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a InquiryResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InquiryResponseAggregateArgs>(args: Prisma.Subset<T, InquiryResponseAggregateArgs>): Prisma.PrismaPromise<GetInquiryResponseAggregateType<T>>;
    /**
     * Group by InquiryResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InquiryResponseGroupByArgs} args - Group by arguments.
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
    groupBy<T extends InquiryResponseGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InquiryResponseGroupByArgs['orderBy'];
    } : {
        orderBy?: InquiryResponseGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InquiryResponseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInquiryResponseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the InquiryResponse model
     */
    readonly fields: InquiryResponseFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for InquiryResponse.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__InquiryResponseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    inquiry<T extends Prisma.InquiryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InquiryDefaultArgs<ExtArgs>>): Prisma.Prisma__InquiryClient<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.InquiryResponse$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InquiryResponse$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the InquiryResponse model
 */
export interface InquiryResponseFieldRefs {
    readonly id: Prisma.FieldRef<"InquiryResponse", 'String'>;
    readonly inquiryId: Prisma.FieldRef<"InquiryResponse", 'String'>;
    readonly userId: Prisma.FieldRef<"InquiryResponse", 'String'>;
    readonly content: Prisma.FieldRef<"InquiryResponse", 'String'>;
    readonly isInternal: Prisma.FieldRef<"InquiryResponse", 'Boolean'>;
    readonly attachments: Prisma.FieldRef<"InquiryResponse", 'String'>;
    readonly createdAt: Prisma.FieldRef<"InquiryResponse", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"InquiryResponse", 'DateTime'>;
}
/**
 * InquiryResponse findUnique
 */
export type InquiryResponseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter, which InquiryResponse to fetch.
     */
    where: Prisma.InquiryResponseWhereUniqueInput;
};
/**
 * InquiryResponse findUniqueOrThrow
 */
export type InquiryResponseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter, which InquiryResponse to fetch.
     */
    where: Prisma.InquiryResponseWhereUniqueInput;
};
/**
 * InquiryResponse findFirst
 */
export type InquiryResponseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter, which InquiryResponse to fetch.
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InquiryResponses to fetch.
     */
    orderBy?: Prisma.InquiryResponseOrderByWithRelationInput | Prisma.InquiryResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InquiryResponses.
     */
    cursor?: Prisma.InquiryResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InquiryResponses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InquiryResponses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InquiryResponses.
     */
    distinct?: Prisma.InquiryResponseScalarFieldEnum | Prisma.InquiryResponseScalarFieldEnum[];
};
/**
 * InquiryResponse findFirstOrThrow
 */
export type InquiryResponseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter, which InquiryResponse to fetch.
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InquiryResponses to fetch.
     */
    orderBy?: Prisma.InquiryResponseOrderByWithRelationInput | Prisma.InquiryResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InquiryResponses.
     */
    cursor?: Prisma.InquiryResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InquiryResponses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InquiryResponses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InquiryResponses.
     */
    distinct?: Prisma.InquiryResponseScalarFieldEnum | Prisma.InquiryResponseScalarFieldEnum[];
};
/**
 * InquiryResponse findMany
 */
export type InquiryResponseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter, which InquiryResponses to fetch.
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InquiryResponses to fetch.
     */
    orderBy?: Prisma.InquiryResponseOrderByWithRelationInput | Prisma.InquiryResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InquiryResponses.
     */
    cursor?: Prisma.InquiryResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InquiryResponses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InquiryResponses.
     */
    skip?: number;
    distinct?: Prisma.InquiryResponseScalarFieldEnum | Prisma.InquiryResponseScalarFieldEnum[];
};
/**
 * InquiryResponse create
 */
export type InquiryResponseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * The data needed to create a InquiryResponse.
     */
    data: Prisma.XOR<Prisma.InquiryResponseCreateInput, Prisma.InquiryResponseUncheckedCreateInput>;
};
/**
 * InquiryResponse createMany
 */
export type InquiryResponseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many InquiryResponses.
     */
    data: Prisma.InquiryResponseCreateManyInput | Prisma.InquiryResponseCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * InquiryResponse update
 */
export type InquiryResponseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * The data needed to update a InquiryResponse.
     */
    data: Prisma.XOR<Prisma.InquiryResponseUpdateInput, Prisma.InquiryResponseUncheckedUpdateInput>;
    /**
     * Choose, which InquiryResponse to update.
     */
    where: Prisma.InquiryResponseWhereUniqueInput;
};
/**
 * InquiryResponse updateMany
 */
export type InquiryResponseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update InquiryResponses.
     */
    data: Prisma.XOR<Prisma.InquiryResponseUpdateManyMutationInput, Prisma.InquiryResponseUncheckedUpdateManyInput>;
    /**
     * Filter which InquiryResponses to update
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * Limit how many InquiryResponses to update.
     */
    limit?: number;
};
/**
 * InquiryResponse upsert
 */
export type InquiryResponseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * The filter to search for the InquiryResponse to update in case it exists.
     */
    where: Prisma.InquiryResponseWhereUniqueInput;
    /**
     * In case the InquiryResponse found by the `where` argument doesn't exist, create a new InquiryResponse with this data.
     */
    create: Prisma.XOR<Prisma.InquiryResponseCreateInput, Prisma.InquiryResponseUncheckedCreateInput>;
    /**
     * In case the InquiryResponse was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.InquiryResponseUpdateInput, Prisma.InquiryResponseUncheckedUpdateInput>;
};
/**
 * InquiryResponse delete
 */
export type InquiryResponseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
    /**
     * Filter which InquiryResponse to delete.
     */
    where: Prisma.InquiryResponseWhereUniqueInput;
};
/**
 * InquiryResponse deleteMany
 */
export type InquiryResponseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InquiryResponses to delete
     */
    where?: Prisma.InquiryResponseWhereInput;
    /**
     * Limit how many InquiryResponses to delete.
     */
    limit?: number;
};
/**
 * InquiryResponse.user
 */
export type InquiryResponse$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
/**
 * InquiryResponse without action
 */
export type InquiryResponseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InquiryResponse
     */
    select?: Prisma.InquiryResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InquiryResponse
     */
    omit?: Prisma.InquiryResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryResponseInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=InquiryResponse.d.ts.map