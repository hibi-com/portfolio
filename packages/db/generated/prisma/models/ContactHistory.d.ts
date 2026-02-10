import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ContactHistory
 *
 */
export type ContactHistoryModel = runtime.Types.Result.DefaultSelection<Prisma.$ContactHistoryPayload>;
export type AggregateContactHistory = {
    _count: ContactHistoryCountAggregateOutputType | null;
    _min: ContactHistoryMinAggregateOutputType | null;
    _max: ContactHistoryMaxAggregateOutputType | null;
};
export type ContactHistoryMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    userId: string | null;
    type: $Enums.ContactType | null;
    subject: string | null;
    content: string | null;
    contactedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ContactHistoryMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    userId: string | null;
    type: $Enums.ContactType | null;
    subject: string | null;
    content: string | null;
    contactedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ContactHistoryCountAggregateOutputType = {
    id: number;
    customerId: number;
    userId: number;
    type: number;
    subject: number;
    content: number;
    contactedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ContactHistoryMinAggregateInputType = {
    id?: true;
    customerId?: true;
    userId?: true;
    type?: true;
    subject?: true;
    content?: true;
    contactedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ContactHistoryMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    userId?: true;
    type?: true;
    subject?: true;
    content?: true;
    contactedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ContactHistoryCountAggregateInputType = {
    id?: true;
    customerId?: true;
    userId?: true;
    type?: true;
    subject?: true;
    content?: true;
    contactedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ContactHistoryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ContactHistory to aggregate.
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ContactHistories to fetch.
     */
    orderBy?: Prisma.ContactHistoryOrderByWithRelationInput | Prisma.ContactHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ContactHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ContactHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ContactHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ContactHistories
    **/
    _count?: true | ContactHistoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ContactHistoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ContactHistoryMaxAggregateInputType;
};
export type GetContactHistoryAggregateType<T extends ContactHistoryAggregateArgs> = {
    [P in keyof T & keyof AggregateContactHistory]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateContactHistory[P]> : Prisma.GetScalarType<T[P], AggregateContactHistory[P]>;
};
export type ContactHistoryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContactHistoryWhereInput;
    orderBy?: Prisma.ContactHistoryOrderByWithAggregationInput | Prisma.ContactHistoryOrderByWithAggregationInput[];
    by: Prisma.ContactHistoryScalarFieldEnum[] | Prisma.ContactHistoryScalarFieldEnum;
    having?: Prisma.ContactHistoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ContactHistoryCountAggregateInputType | true;
    _min?: ContactHistoryMinAggregateInputType;
    _max?: ContactHistoryMaxAggregateInputType;
};
export type ContactHistoryGroupByOutputType = {
    id: string;
    customerId: string;
    userId: string | null;
    type: $Enums.ContactType;
    subject: string | null;
    content: string | null;
    contactedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: ContactHistoryCountAggregateOutputType | null;
    _min: ContactHistoryMinAggregateOutputType | null;
    _max: ContactHistoryMaxAggregateOutputType | null;
};
type GetContactHistoryGroupByPayload<T extends ContactHistoryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ContactHistoryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ContactHistoryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ContactHistoryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ContactHistoryGroupByOutputType[P]>;
}>>;
export type ContactHistoryWhereInput = {
    AND?: Prisma.ContactHistoryWhereInput | Prisma.ContactHistoryWhereInput[];
    OR?: Prisma.ContactHistoryWhereInput[];
    NOT?: Prisma.ContactHistoryWhereInput | Prisma.ContactHistoryWhereInput[];
    id?: Prisma.StringFilter<"ContactHistory"> | string;
    customerId?: Prisma.StringFilter<"ContactHistory"> | string;
    userId?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    type?: Prisma.EnumContactTypeFilter<"ContactHistory"> | $Enums.ContactType;
    subject?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    content?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    contactedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ContactHistoryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    subject?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    contactedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    _relevance?: Prisma.ContactHistoryOrderByRelevanceInput;
};
export type ContactHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ContactHistoryWhereInput | Prisma.ContactHistoryWhereInput[];
    OR?: Prisma.ContactHistoryWhereInput[];
    NOT?: Prisma.ContactHistoryWhereInput | Prisma.ContactHistoryWhereInput[];
    customerId?: Prisma.StringFilter<"ContactHistory"> | string;
    userId?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    type?: Prisma.EnumContactTypeFilter<"ContactHistory"> | $Enums.ContactType;
    subject?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    content?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    contactedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type ContactHistoryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    subject?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrderInput | Prisma.SortOrder;
    contactedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ContactHistoryCountOrderByAggregateInput;
    _max?: Prisma.ContactHistoryMaxOrderByAggregateInput;
    _min?: Prisma.ContactHistoryMinOrderByAggregateInput;
};
export type ContactHistoryScalarWhereWithAggregatesInput = {
    AND?: Prisma.ContactHistoryScalarWhereWithAggregatesInput | Prisma.ContactHistoryScalarWhereWithAggregatesInput[];
    OR?: Prisma.ContactHistoryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ContactHistoryScalarWhereWithAggregatesInput | Prisma.ContactHistoryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ContactHistory"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"ContactHistory"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"ContactHistory"> | string | null;
    type?: Prisma.EnumContactTypeWithAggregatesFilter<"ContactHistory"> | $Enums.ContactType;
    subject?: Prisma.StringNullableWithAggregatesFilter<"ContactHistory"> | string | null;
    content?: Prisma.StringNullableWithAggregatesFilter<"ContactHistory"> | string | null;
    contactedAt?: Prisma.DateTimeWithAggregatesFilter<"ContactHistory"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ContactHistory"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ContactHistory"> | Date | string;
};
export type ContactHistoryCreateInput = {
    id?: string;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutContactHistoryInput;
    user?: Prisma.UserCreateNestedOneWithoutContactHistoriesInput;
};
export type ContactHistoryUncheckedCreateInput = {
    id?: string;
    customerId: string;
    userId?: string | null;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutContactHistoryNestedInput;
    user?: Prisma.UserUpdateOneWithoutContactHistoriesNestedInput;
};
export type ContactHistoryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryCreateManyInput = {
    id?: string;
    customerId: string;
    userId?: string | null;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryListRelationFilter = {
    every?: Prisma.ContactHistoryWhereInput;
    some?: Prisma.ContactHistoryWhereInput;
    none?: Prisma.ContactHistoryWhereInput;
};
export type ContactHistoryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ContactHistoryOrderByRelevanceInput = {
    fields: Prisma.ContactHistoryOrderByRelevanceFieldEnum | Prisma.ContactHistoryOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type ContactHistoryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    contactedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ContactHistoryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    contactedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ContactHistoryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    contactedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ContactHistoryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput> | Prisma.ContactHistoryCreateWithoutUserInput[] | Prisma.ContactHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutUserInput | Prisma.ContactHistoryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ContactHistoryCreateManyUserInputEnvelope;
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
};
export type ContactHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput> | Prisma.ContactHistoryCreateWithoutUserInput[] | Prisma.ContactHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutUserInput | Prisma.ContactHistoryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ContactHistoryCreateManyUserInputEnvelope;
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
};
export type ContactHistoryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput> | Prisma.ContactHistoryCreateWithoutUserInput[] | Prisma.ContactHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutUserInput | Prisma.ContactHistoryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ContactHistoryUpsertWithWhereUniqueWithoutUserInput | Prisma.ContactHistoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ContactHistoryCreateManyUserInputEnvelope;
    set?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    disconnect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    delete?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    update?: Prisma.ContactHistoryUpdateWithWhereUniqueWithoutUserInput | Prisma.ContactHistoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ContactHistoryUpdateManyWithWhereWithoutUserInput | Prisma.ContactHistoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
};
export type ContactHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput> | Prisma.ContactHistoryCreateWithoutUserInput[] | Prisma.ContactHistoryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutUserInput | Prisma.ContactHistoryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ContactHistoryUpsertWithWhereUniqueWithoutUserInput | Prisma.ContactHistoryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ContactHistoryCreateManyUserInputEnvelope;
    set?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    disconnect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    delete?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    update?: Prisma.ContactHistoryUpdateWithWhereUniqueWithoutUserInput | Prisma.ContactHistoryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ContactHistoryUpdateManyWithWhereWithoutUserInput | Prisma.ContactHistoryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
};
export type ContactHistoryCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput> | Prisma.ContactHistoryCreateWithoutCustomerInput[] | Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput | Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ContactHistoryCreateManyCustomerInputEnvelope;
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
};
export type ContactHistoryUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput> | Prisma.ContactHistoryCreateWithoutCustomerInput[] | Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput | Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ContactHistoryCreateManyCustomerInputEnvelope;
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
};
export type ContactHistoryUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput> | Prisma.ContactHistoryCreateWithoutCustomerInput[] | Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput | Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ContactHistoryUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ContactHistoryUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ContactHistoryCreateManyCustomerInputEnvelope;
    set?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    disconnect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    delete?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    update?: Prisma.ContactHistoryUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ContactHistoryUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ContactHistoryUpdateManyWithWhereWithoutCustomerInput | Prisma.ContactHistoryUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
};
export type ContactHistoryUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput> | Prisma.ContactHistoryCreateWithoutCustomerInput[] | Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput | Prisma.ContactHistoryCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ContactHistoryUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ContactHistoryUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ContactHistoryCreateManyCustomerInputEnvelope;
    set?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    disconnect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    delete?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    connect?: Prisma.ContactHistoryWhereUniqueInput | Prisma.ContactHistoryWhereUniqueInput[];
    update?: Prisma.ContactHistoryUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ContactHistoryUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ContactHistoryUpdateManyWithWhereWithoutCustomerInput | Prisma.ContactHistoryUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
};
export type EnumContactTypeFieldUpdateOperationsInput = {
    set?: $Enums.ContactType;
};
export type ContactHistoryCreateWithoutUserInput = {
    id?: string;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutContactHistoryInput;
};
export type ContactHistoryUncheckedCreateWithoutUserInput = {
    id?: string;
    customerId: string;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryCreateOrConnectWithoutUserInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput>;
};
export type ContactHistoryCreateManyUserInputEnvelope = {
    data: Prisma.ContactHistoryCreateManyUserInput | Prisma.ContactHistoryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ContactHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContactHistoryUpdateWithoutUserInput, Prisma.ContactHistoryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ContactHistoryCreateWithoutUserInput, Prisma.ContactHistoryUncheckedCreateWithoutUserInput>;
};
export type ContactHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContactHistoryUpdateWithoutUserInput, Prisma.ContactHistoryUncheckedUpdateWithoutUserInput>;
};
export type ContactHistoryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ContactHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.ContactHistoryUpdateManyMutationInput, Prisma.ContactHistoryUncheckedUpdateManyWithoutUserInput>;
};
export type ContactHistoryScalarWhereInput = {
    AND?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
    OR?: Prisma.ContactHistoryScalarWhereInput[];
    NOT?: Prisma.ContactHistoryScalarWhereInput | Prisma.ContactHistoryScalarWhereInput[];
    id?: Prisma.StringFilter<"ContactHistory"> | string;
    customerId?: Prisma.StringFilter<"ContactHistory"> | string;
    userId?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    type?: Prisma.EnumContactTypeFilter<"ContactHistory"> | $Enums.ContactType;
    subject?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    content?: Prisma.StringNullableFilter<"ContactHistory"> | string | null;
    contactedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ContactHistory"> | Date | string;
};
export type ContactHistoryCreateWithoutCustomerInput = {
    id?: string;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutContactHistoriesInput;
};
export type ContactHistoryUncheckedCreateWithoutCustomerInput = {
    id?: string;
    userId?: string | null;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput>;
};
export type ContactHistoryCreateManyCustomerInputEnvelope = {
    data: Prisma.ContactHistoryCreateManyCustomerInput | Prisma.ContactHistoryCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ContactHistoryUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContactHistoryUpdateWithoutCustomerInput, Prisma.ContactHistoryUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ContactHistoryCreateWithoutCustomerInput, Prisma.ContactHistoryUncheckedCreateWithoutCustomerInput>;
};
export type ContactHistoryUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ContactHistoryWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContactHistoryUpdateWithoutCustomerInput, Prisma.ContactHistoryUncheckedUpdateWithoutCustomerInput>;
};
export type ContactHistoryUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ContactHistoryScalarWhereInput;
    data: Prisma.XOR<Prisma.ContactHistoryUpdateManyMutationInput, Prisma.ContactHistoryUncheckedUpdateManyWithoutCustomerInput>;
};
export type ContactHistoryCreateManyUserInput = {
    id?: string;
    customerId: string;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutContactHistoryNestedInput;
};
export type ContactHistoryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryCreateManyCustomerInput = {
    id?: string;
    userId?: string | null;
    type: $Enums.ContactType;
    subject?: string | null;
    content?: string | null;
    contactedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ContactHistoryUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutContactHistoriesNestedInput;
};
export type ContactHistoryUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistoryUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.EnumContactTypeFieldUpdateOperationsInput | $Enums.ContactType;
    subject?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contactedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ContactHistorySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    userId?: boolean;
    type?: boolean;
    subject?: boolean;
    content?: boolean;
    contactedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ContactHistory$userArgs<ExtArgs>;
}, ExtArgs["result"]["contactHistory"]>;
export type ContactHistorySelectScalar = {
    id?: boolean;
    customerId?: boolean;
    userId?: boolean;
    type?: boolean;
    subject?: boolean;
    content?: boolean;
    contactedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ContactHistoryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "userId" | "type" | "subject" | "content" | "contactedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["contactHistory"]>;
export type ContactHistoryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.ContactHistory$userArgs<ExtArgs>;
};
export type $ContactHistoryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ContactHistory";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string;
        userId: string | null;
        type: $Enums.ContactType;
        subject: string | null;
        content: string | null;
        contactedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["contactHistory"]>;
    composites: {};
};
export type ContactHistoryGetPayload<S extends boolean | null | undefined | ContactHistoryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload, S>;
export type ContactHistoryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ContactHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ContactHistoryCountAggregateInputType | true;
};
export interface ContactHistoryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ContactHistory'];
        meta: {
            name: 'ContactHistory';
        };
    };
    /**
     * Find zero or one ContactHistory that matches the filter.
     * @param {ContactHistoryFindUniqueArgs} args - Arguments to find a ContactHistory
     * @example
     * // Get one ContactHistory
     * const contactHistory = await prisma.contactHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactHistoryFindUniqueArgs>(args: Prisma.SelectSubset<T, ContactHistoryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ContactHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactHistoryFindUniqueOrThrowArgs} args - Arguments to find a ContactHistory
     * @example
     * // Get one ContactHistory
     * const contactHistory = await prisma.contactHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactHistoryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ContactHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ContactHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryFindFirstArgs} args - Arguments to find a ContactHistory
     * @example
     * // Get one ContactHistory
     * const contactHistory = await prisma.contactHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactHistoryFindFirstArgs>(args?: Prisma.SelectSubset<T, ContactHistoryFindFirstArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ContactHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryFindFirstOrThrowArgs} args - Arguments to find a ContactHistory
     * @example
     * // Get one ContactHistory
     * const contactHistory = await prisma.contactHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactHistoryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ContactHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ContactHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactHistories
     * const contactHistories = await prisma.contactHistory.findMany()
     *
     * // Get first 10 ContactHistories
     * const contactHistories = await prisma.contactHistory.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const contactHistoryWithIdOnly = await prisma.contactHistory.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ContactHistoryFindManyArgs>(args?: Prisma.SelectSubset<T, ContactHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ContactHistory.
     * @param {ContactHistoryCreateArgs} args - Arguments to create a ContactHistory.
     * @example
     * // Create one ContactHistory
     * const ContactHistory = await prisma.contactHistory.create({
     *   data: {
     *     // ... data to create a ContactHistory
     *   }
     * })
     *
     */
    create<T extends ContactHistoryCreateArgs>(args: Prisma.SelectSubset<T, ContactHistoryCreateArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ContactHistories.
     * @param {ContactHistoryCreateManyArgs} args - Arguments to create many ContactHistories.
     * @example
     * // Create many ContactHistories
     * const contactHistory = await prisma.contactHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ContactHistoryCreateManyArgs>(args?: Prisma.SelectSubset<T, ContactHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a ContactHistory.
     * @param {ContactHistoryDeleteArgs} args - Arguments to delete one ContactHistory.
     * @example
     * // Delete one ContactHistory
     * const ContactHistory = await prisma.contactHistory.delete({
     *   where: {
     *     // ... filter to delete one ContactHistory
     *   }
     * })
     *
     */
    delete<T extends ContactHistoryDeleteArgs>(args: Prisma.SelectSubset<T, ContactHistoryDeleteArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ContactHistory.
     * @param {ContactHistoryUpdateArgs} args - Arguments to update one ContactHistory.
     * @example
     * // Update one ContactHistory
     * const contactHistory = await prisma.contactHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ContactHistoryUpdateArgs>(args: Prisma.SelectSubset<T, ContactHistoryUpdateArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ContactHistories.
     * @param {ContactHistoryDeleteManyArgs} args - Arguments to filter ContactHistories to delete.
     * @example
     * // Delete a few ContactHistories
     * const { count } = await prisma.contactHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ContactHistoryDeleteManyArgs>(args?: Prisma.SelectSubset<T, ContactHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ContactHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactHistories
     * const contactHistory = await prisma.contactHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ContactHistoryUpdateManyArgs>(args: Prisma.SelectSubset<T, ContactHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one ContactHistory.
     * @param {ContactHistoryUpsertArgs} args - Arguments to update or create a ContactHistory.
     * @example
     * // Update or create a ContactHistory
     * const contactHistory = await prisma.contactHistory.upsert({
     *   create: {
     *     // ... data to create a ContactHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactHistory we want to update
     *   }
     * })
     */
    upsert<T extends ContactHistoryUpsertArgs>(args: Prisma.SelectSubset<T, ContactHistoryUpsertArgs<ExtArgs>>): Prisma.Prisma__ContactHistoryClient<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ContactHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryCountArgs} args - Arguments to filter ContactHistories to count.
     * @example
     * // Count the number of ContactHistories
     * const count = await prisma.contactHistory.count({
     *   where: {
     *     // ... the filter for the ContactHistories we want to count
     *   }
     * })
    **/
    count<T extends ContactHistoryCountArgs>(args?: Prisma.Subset<T, ContactHistoryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ContactHistoryCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ContactHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContactHistoryAggregateArgs>(args: Prisma.Subset<T, ContactHistoryAggregateArgs>): Prisma.PrismaPromise<GetContactHistoryAggregateType<T>>;
    /**
     * Group by ContactHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactHistoryGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ContactHistoryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ContactHistoryGroupByArgs['orderBy'];
    } : {
        orderBy?: ContactHistoryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ContactHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ContactHistory model
     */
    readonly fields: ContactHistoryFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ContactHistory.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ContactHistoryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.ContactHistory$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ContactHistory$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ContactHistory model
 */
export interface ContactHistoryFieldRefs {
    readonly id: Prisma.FieldRef<"ContactHistory", 'String'>;
    readonly customerId: Prisma.FieldRef<"ContactHistory", 'String'>;
    readonly userId: Prisma.FieldRef<"ContactHistory", 'String'>;
    readonly type: Prisma.FieldRef<"ContactHistory", 'ContactType'>;
    readonly subject: Prisma.FieldRef<"ContactHistory", 'String'>;
    readonly content: Prisma.FieldRef<"ContactHistory", 'String'>;
    readonly contactedAt: Prisma.FieldRef<"ContactHistory", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ContactHistory", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ContactHistory", 'DateTime'>;
}
/**
 * ContactHistory findUnique
 */
export type ContactHistoryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which ContactHistory to fetch.
     */
    where: Prisma.ContactHistoryWhereUniqueInput;
};
/**
 * ContactHistory findUniqueOrThrow
 */
export type ContactHistoryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which ContactHistory to fetch.
     */
    where: Prisma.ContactHistoryWhereUniqueInput;
};
/**
 * ContactHistory findFirst
 */
export type ContactHistoryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which ContactHistory to fetch.
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ContactHistories to fetch.
     */
    orderBy?: Prisma.ContactHistoryOrderByWithRelationInput | Prisma.ContactHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ContactHistories.
     */
    cursor?: Prisma.ContactHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ContactHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ContactHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ContactHistories.
     */
    distinct?: Prisma.ContactHistoryScalarFieldEnum | Prisma.ContactHistoryScalarFieldEnum[];
};
/**
 * ContactHistory findFirstOrThrow
 */
export type ContactHistoryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which ContactHistory to fetch.
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ContactHistories to fetch.
     */
    orderBy?: Prisma.ContactHistoryOrderByWithRelationInput | Prisma.ContactHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ContactHistories.
     */
    cursor?: Prisma.ContactHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ContactHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ContactHistories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ContactHistories.
     */
    distinct?: Prisma.ContactHistoryScalarFieldEnum | Prisma.ContactHistoryScalarFieldEnum[];
};
/**
 * ContactHistory findMany
 */
export type ContactHistoryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter, which ContactHistories to fetch.
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ContactHistories to fetch.
     */
    orderBy?: Prisma.ContactHistoryOrderByWithRelationInput | Prisma.ContactHistoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ContactHistories.
     */
    cursor?: Prisma.ContactHistoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ContactHistories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ContactHistories.
     */
    skip?: number;
    distinct?: Prisma.ContactHistoryScalarFieldEnum | Prisma.ContactHistoryScalarFieldEnum[];
};
/**
 * ContactHistory create
 */
export type ContactHistoryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a ContactHistory.
     */
    data: Prisma.XOR<Prisma.ContactHistoryCreateInput, Prisma.ContactHistoryUncheckedCreateInput>;
};
/**
 * ContactHistory createMany
 */
export type ContactHistoryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactHistories.
     */
    data: Prisma.ContactHistoryCreateManyInput | Prisma.ContactHistoryCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ContactHistory update
 */
export type ContactHistoryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a ContactHistory.
     */
    data: Prisma.XOR<Prisma.ContactHistoryUpdateInput, Prisma.ContactHistoryUncheckedUpdateInput>;
    /**
     * Choose, which ContactHistory to update.
     */
    where: Prisma.ContactHistoryWhereUniqueInput;
};
/**
 * ContactHistory updateMany
 */
export type ContactHistoryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactHistories.
     */
    data: Prisma.XOR<Prisma.ContactHistoryUpdateManyMutationInput, Prisma.ContactHistoryUncheckedUpdateManyInput>;
    /**
     * Filter which ContactHistories to update
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * Limit how many ContactHistories to update.
     */
    limit?: number;
};
/**
 * ContactHistory upsert
 */
export type ContactHistoryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the ContactHistory to update in case it exists.
     */
    where: Prisma.ContactHistoryWhereUniqueInput;
    /**
     * In case the ContactHistory found by the `where` argument doesn't exist, create a new ContactHistory with this data.
     */
    create: Prisma.XOR<Prisma.ContactHistoryCreateInput, Prisma.ContactHistoryUncheckedCreateInput>;
    /**
     * In case the ContactHistory was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ContactHistoryUpdateInput, Prisma.ContactHistoryUncheckedUpdateInput>;
};
/**
 * ContactHistory delete
 */
export type ContactHistoryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
    /**
     * Filter which ContactHistory to delete.
     */
    where: Prisma.ContactHistoryWhereUniqueInput;
};
/**
 * ContactHistory deleteMany
 */
export type ContactHistoryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ContactHistories to delete
     */
    where?: Prisma.ContactHistoryWhereInput;
    /**
     * Limit how many ContactHistories to delete.
     */
    limit?: number;
};
/**
 * ContactHistory.user
 */
export type ContactHistory$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * ContactHistory without action
 */
export type ContactHistoryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactHistory
     */
    select?: Prisma.ContactHistorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ContactHistory
     */
    omit?: Prisma.ContactHistoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ContactHistoryInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=ContactHistory.d.ts.map