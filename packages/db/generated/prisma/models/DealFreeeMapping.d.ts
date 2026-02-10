import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model DealFreeeMapping
 *
 */
export type DealFreeeMappingModel = runtime.Types.Result.DefaultSelection<Prisma.$DealFreeeMappingPayload>;
export type AggregateDealFreeeMapping = {
    _count: DealFreeeMappingCountAggregateOutputType | null;
    _avg: DealFreeeMappingAvgAggregateOutputType | null;
    _sum: DealFreeeMappingSumAggregateOutputType | null;
    _min: DealFreeeMappingMinAggregateOutputType | null;
    _max: DealFreeeMappingMaxAggregateOutputType | null;
};
export type DealFreeeMappingAvgAggregateOutputType = {
    freeeDealId: number | null;
    freeeCompanyId: number | null;
};
export type DealFreeeMappingSumAggregateOutputType = {
    freeeDealId: number | null;
    freeeCompanyId: number | null;
};
export type DealFreeeMappingMinAggregateOutputType = {
    id: string | null;
    dealId: string | null;
    freeeDealId: number | null;
    freeeCompanyId: number | null;
    lastSyncAt: Date | null;
    syncHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DealFreeeMappingMaxAggregateOutputType = {
    id: string | null;
    dealId: string | null;
    freeeDealId: number | null;
    freeeCompanyId: number | null;
    lastSyncAt: Date | null;
    syncHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DealFreeeMappingCountAggregateOutputType = {
    id: number;
    dealId: number;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: number;
    syncHash: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DealFreeeMappingAvgAggregateInputType = {
    freeeDealId?: true;
    freeeCompanyId?: true;
};
export type DealFreeeMappingSumAggregateInputType = {
    freeeDealId?: true;
    freeeCompanyId?: true;
};
export type DealFreeeMappingMinAggregateInputType = {
    id?: true;
    dealId?: true;
    freeeDealId?: true;
    freeeCompanyId?: true;
    lastSyncAt?: true;
    syncHash?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DealFreeeMappingMaxAggregateInputType = {
    id?: true;
    dealId?: true;
    freeeDealId?: true;
    freeeCompanyId?: true;
    lastSyncAt?: true;
    syncHash?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DealFreeeMappingCountAggregateInputType = {
    id?: true;
    dealId?: true;
    freeeDealId?: true;
    freeeCompanyId?: true;
    lastSyncAt?: true;
    syncHash?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DealFreeeMappingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DealFreeeMapping to aggregate.
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DealFreeeMappings to fetch.
     */
    orderBy?: Prisma.DealFreeeMappingOrderByWithRelationInput | Prisma.DealFreeeMappingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.DealFreeeMappingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DealFreeeMappings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DealFreeeMappings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned DealFreeeMappings
    **/
    _count?: true | DealFreeeMappingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: DealFreeeMappingAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: DealFreeeMappingSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: DealFreeeMappingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: DealFreeeMappingMaxAggregateInputType;
};
export type GetDealFreeeMappingAggregateType<T extends DealFreeeMappingAggregateArgs> = {
    [P in keyof T & keyof AggregateDealFreeeMapping]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDealFreeeMapping[P]> : Prisma.GetScalarType<T[P], AggregateDealFreeeMapping[P]>;
};
export type DealFreeeMappingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DealFreeeMappingWhereInput;
    orderBy?: Prisma.DealFreeeMappingOrderByWithAggregationInput | Prisma.DealFreeeMappingOrderByWithAggregationInput[];
    by: Prisma.DealFreeeMappingScalarFieldEnum[] | Prisma.DealFreeeMappingScalarFieldEnum;
    having?: Prisma.DealFreeeMappingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DealFreeeMappingCountAggregateInputType | true;
    _avg?: DealFreeeMappingAvgAggregateInputType;
    _sum?: DealFreeeMappingSumAggregateInputType;
    _min?: DealFreeeMappingMinAggregateInputType;
    _max?: DealFreeeMappingMaxAggregateInputType;
};
export type DealFreeeMappingGroupByOutputType = {
    id: string;
    dealId: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date;
    syncHash: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: DealFreeeMappingCountAggregateOutputType | null;
    _avg: DealFreeeMappingAvgAggregateOutputType | null;
    _sum: DealFreeeMappingSumAggregateOutputType | null;
    _min: DealFreeeMappingMinAggregateOutputType | null;
    _max: DealFreeeMappingMaxAggregateOutputType | null;
};
type GetDealFreeeMappingGroupByPayload<T extends DealFreeeMappingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DealFreeeMappingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DealFreeeMappingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DealFreeeMappingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DealFreeeMappingGroupByOutputType[P]>;
}>>;
export type DealFreeeMappingWhereInput = {
    AND?: Prisma.DealFreeeMappingWhereInput | Prisma.DealFreeeMappingWhereInput[];
    OR?: Prisma.DealFreeeMappingWhereInput[];
    NOT?: Prisma.DealFreeeMappingWhereInput | Prisma.DealFreeeMappingWhereInput[];
    id?: Prisma.StringFilter<"DealFreeeMapping"> | string;
    dealId?: Prisma.StringFilter<"DealFreeeMapping"> | string;
    freeeDealId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    freeeCompanyId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    lastSyncAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    syncHash?: Prisma.StringNullableFilter<"DealFreeeMapping"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    deal?: Prisma.XOR<Prisma.DealScalarRelationFilter, Prisma.DealWhereInput>;
};
export type DealFreeeMappingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    dealId?: Prisma.SortOrder;
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
    lastSyncAt?: Prisma.SortOrder;
    syncHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deal?: Prisma.DealOrderByWithRelationInput;
    _relevance?: Prisma.DealFreeeMappingOrderByRelevanceInput;
};
export type DealFreeeMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    dealId_freeeCompanyId?: Prisma.DealFreeeMappingDealIdFreeeCompanyIdCompoundUniqueInput;
    freeeDealId_freeeCompanyId?: Prisma.DealFreeeMappingFreeeDealIdFreeeCompanyIdCompoundUniqueInput;
    AND?: Prisma.DealFreeeMappingWhereInput | Prisma.DealFreeeMappingWhereInput[];
    OR?: Prisma.DealFreeeMappingWhereInput[];
    NOT?: Prisma.DealFreeeMappingWhereInput | Prisma.DealFreeeMappingWhereInput[];
    dealId?: Prisma.StringFilter<"DealFreeeMapping"> | string;
    freeeDealId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    freeeCompanyId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    lastSyncAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    syncHash?: Prisma.StringNullableFilter<"DealFreeeMapping"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    deal?: Prisma.XOR<Prisma.DealScalarRelationFilter, Prisma.DealWhereInput>;
}, "id" | "dealId_freeeCompanyId" | "freeeDealId_freeeCompanyId">;
export type DealFreeeMappingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    dealId?: Prisma.SortOrder;
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
    lastSyncAt?: Prisma.SortOrder;
    syncHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DealFreeeMappingCountOrderByAggregateInput;
    _avg?: Prisma.DealFreeeMappingAvgOrderByAggregateInput;
    _max?: Prisma.DealFreeeMappingMaxOrderByAggregateInput;
    _min?: Prisma.DealFreeeMappingMinOrderByAggregateInput;
    _sum?: Prisma.DealFreeeMappingSumOrderByAggregateInput;
};
export type DealFreeeMappingScalarWhereWithAggregatesInput = {
    AND?: Prisma.DealFreeeMappingScalarWhereWithAggregatesInput | Prisma.DealFreeeMappingScalarWhereWithAggregatesInput[];
    OR?: Prisma.DealFreeeMappingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DealFreeeMappingScalarWhereWithAggregatesInput | Prisma.DealFreeeMappingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DealFreeeMapping"> | string;
    dealId?: Prisma.StringWithAggregatesFilter<"DealFreeeMapping"> | string;
    freeeDealId?: Prisma.IntWithAggregatesFilter<"DealFreeeMapping"> | number;
    freeeCompanyId?: Prisma.IntWithAggregatesFilter<"DealFreeeMapping"> | number;
    lastSyncAt?: Prisma.DateTimeWithAggregatesFilter<"DealFreeeMapping"> | Date | string;
    syncHash?: Prisma.StringNullableWithAggregatesFilter<"DealFreeeMapping"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DealFreeeMapping"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DealFreeeMapping"> | Date | string;
};
export type DealFreeeMappingCreateInput = {
    id?: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deal: Prisma.DealCreateNestedOneWithoutFreeeMappingsInput;
};
export type DealFreeeMappingUncheckedCreateInput = {
    id?: string;
    dealId: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealFreeeMappingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deal?: Prisma.DealUpdateOneRequiredWithoutFreeeMappingsNestedInput;
};
export type DealFreeeMappingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dealId?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingCreateManyInput = {
    id?: string;
    dealId: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealFreeeMappingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dealId?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingListRelationFilter = {
    every?: Prisma.DealFreeeMappingWhereInput;
    some?: Prisma.DealFreeeMappingWhereInput;
    none?: Prisma.DealFreeeMappingWhereInput;
};
export type DealFreeeMappingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DealFreeeMappingOrderByRelevanceInput = {
    fields: Prisma.DealFreeeMappingOrderByRelevanceFieldEnum | Prisma.DealFreeeMappingOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type DealFreeeMappingDealIdFreeeCompanyIdCompoundUniqueInput = {
    dealId: string;
    freeeCompanyId: number;
};
export type DealFreeeMappingFreeeDealIdFreeeCompanyIdCompoundUniqueInput = {
    freeeDealId: number;
    freeeCompanyId: number;
};
export type DealFreeeMappingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dealId?: Prisma.SortOrder;
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
    lastSyncAt?: Prisma.SortOrder;
    syncHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealFreeeMappingAvgOrderByAggregateInput = {
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
};
export type DealFreeeMappingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dealId?: Prisma.SortOrder;
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
    lastSyncAt?: Prisma.SortOrder;
    syncHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealFreeeMappingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dealId?: Prisma.SortOrder;
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
    lastSyncAt?: Prisma.SortOrder;
    syncHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealFreeeMappingSumOrderByAggregateInput = {
    freeeDealId?: Prisma.SortOrder;
    freeeCompanyId?: Prisma.SortOrder;
};
export type DealFreeeMappingCreateNestedManyWithoutDealInput = {
    create?: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput> | Prisma.DealFreeeMappingCreateWithoutDealInput[] | Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput[];
    connectOrCreate?: Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput | Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput[];
    createMany?: Prisma.DealFreeeMappingCreateManyDealInputEnvelope;
    connect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
};
export type DealFreeeMappingUncheckedCreateNestedManyWithoutDealInput = {
    create?: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput> | Prisma.DealFreeeMappingCreateWithoutDealInput[] | Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput[];
    connectOrCreate?: Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput | Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput[];
    createMany?: Prisma.DealFreeeMappingCreateManyDealInputEnvelope;
    connect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
};
export type DealFreeeMappingUpdateManyWithoutDealNestedInput = {
    create?: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput> | Prisma.DealFreeeMappingCreateWithoutDealInput[] | Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput[];
    connectOrCreate?: Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput | Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput[];
    upsert?: Prisma.DealFreeeMappingUpsertWithWhereUniqueWithoutDealInput | Prisma.DealFreeeMappingUpsertWithWhereUniqueWithoutDealInput[];
    createMany?: Prisma.DealFreeeMappingCreateManyDealInputEnvelope;
    set?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    disconnect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    delete?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    connect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    update?: Prisma.DealFreeeMappingUpdateWithWhereUniqueWithoutDealInput | Prisma.DealFreeeMappingUpdateWithWhereUniqueWithoutDealInput[];
    updateMany?: Prisma.DealFreeeMappingUpdateManyWithWhereWithoutDealInput | Prisma.DealFreeeMappingUpdateManyWithWhereWithoutDealInput[];
    deleteMany?: Prisma.DealFreeeMappingScalarWhereInput | Prisma.DealFreeeMappingScalarWhereInput[];
};
export type DealFreeeMappingUncheckedUpdateManyWithoutDealNestedInput = {
    create?: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput> | Prisma.DealFreeeMappingCreateWithoutDealInput[] | Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput[];
    connectOrCreate?: Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput | Prisma.DealFreeeMappingCreateOrConnectWithoutDealInput[];
    upsert?: Prisma.DealFreeeMappingUpsertWithWhereUniqueWithoutDealInput | Prisma.DealFreeeMappingUpsertWithWhereUniqueWithoutDealInput[];
    createMany?: Prisma.DealFreeeMappingCreateManyDealInputEnvelope;
    set?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    disconnect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    delete?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    connect?: Prisma.DealFreeeMappingWhereUniqueInput | Prisma.DealFreeeMappingWhereUniqueInput[];
    update?: Prisma.DealFreeeMappingUpdateWithWhereUniqueWithoutDealInput | Prisma.DealFreeeMappingUpdateWithWhereUniqueWithoutDealInput[];
    updateMany?: Prisma.DealFreeeMappingUpdateManyWithWhereWithoutDealInput | Prisma.DealFreeeMappingUpdateManyWithWhereWithoutDealInput[];
    deleteMany?: Prisma.DealFreeeMappingScalarWhereInput | Prisma.DealFreeeMappingScalarWhereInput[];
};
export type DealFreeeMappingCreateWithoutDealInput = {
    id?: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealFreeeMappingUncheckedCreateWithoutDealInput = {
    id?: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealFreeeMappingCreateOrConnectWithoutDealInput = {
    where: Prisma.DealFreeeMappingWhereUniqueInput;
    create: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput>;
};
export type DealFreeeMappingCreateManyDealInputEnvelope = {
    data: Prisma.DealFreeeMappingCreateManyDealInput | Prisma.DealFreeeMappingCreateManyDealInput[];
    skipDuplicates?: boolean;
};
export type DealFreeeMappingUpsertWithWhereUniqueWithoutDealInput = {
    where: Prisma.DealFreeeMappingWhereUniqueInput;
    update: Prisma.XOR<Prisma.DealFreeeMappingUpdateWithoutDealInput, Prisma.DealFreeeMappingUncheckedUpdateWithoutDealInput>;
    create: Prisma.XOR<Prisma.DealFreeeMappingCreateWithoutDealInput, Prisma.DealFreeeMappingUncheckedCreateWithoutDealInput>;
};
export type DealFreeeMappingUpdateWithWhereUniqueWithoutDealInput = {
    where: Prisma.DealFreeeMappingWhereUniqueInput;
    data: Prisma.XOR<Prisma.DealFreeeMappingUpdateWithoutDealInput, Prisma.DealFreeeMappingUncheckedUpdateWithoutDealInput>;
};
export type DealFreeeMappingUpdateManyWithWhereWithoutDealInput = {
    where: Prisma.DealFreeeMappingScalarWhereInput;
    data: Prisma.XOR<Prisma.DealFreeeMappingUpdateManyMutationInput, Prisma.DealFreeeMappingUncheckedUpdateManyWithoutDealInput>;
};
export type DealFreeeMappingScalarWhereInput = {
    AND?: Prisma.DealFreeeMappingScalarWhereInput | Prisma.DealFreeeMappingScalarWhereInput[];
    OR?: Prisma.DealFreeeMappingScalarWhereInput[];
    NOT?: Prisma.DealFreeeMappingScalarWhereInput | Prisma.DealFreeeMappingScalarWhereInput[];
    id?: Prisma.StringFilter<"DealFreeeMapping"> | string;
    dealId?: Prisma.StringFilter<"DealFreeeMapping"> | string;
    freeeDealId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    freeeCompanyId?: Prisma.IntFilter<"DealFreeeMapping"> | number;
    lastSyncAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    syncHash?: Prisma.StringNullableFilter<"DealFreeeMapping"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DealFreeeMapping"> | Date | string;
};
export type DealFreeeMappingCreateManyDealInput = {
    id?: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date | string;
    syncHash?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealFreeeMappingUpdateWithoutDealInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingUncheckedUpdateWithoutDealInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingUncheckedUpdateManyWithoutDealInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    freeeDealId?: Prisma.IntFieldUpdateOperationsInput | number;
    freeeCompanyId?: Prisma.IntFieldUpdateOperationsInput | number;
    lastSyncAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    syncHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealFreeeMappingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dealId?: boolean;
    freeeDealId?: boolean;
    freeeCompanyId?: boolean;
    lastSyncAt?: boolean;
    syncHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deal?: boolean | Prisma.DealDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dealFreeeMapping"]>;
export type DealFreeeMappingSelectScalar = {
    id?: boolean;
    dealId?: boolean;
    freeeDealId?: boolean;
    freeeCompanyId?: boolean;
    lastSyncAt?: boolean;
    syncHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DealFreeeMappingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "dealId" | "freeeDealId" | "freeeCompanyId" | "lastSyncAt" | "syncHash" | "createdAt" | "updatedAt", ExtArgs["result"]["dealFreeeMapping"]>;
export type DealFreeeMappingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    deal?: boolean | Prisma.DealDefaultArgs<ExtArgs>;
};
export type $DealFreeeMappingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DealFreeeMapping";
    objects: {
        deal: Prisma.$DealPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        dealId: string;
        freeeDealId: number;
        freeeCompanyId: number;
        lastSyncAt: Date;
        syncHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["dealFreeeMapping"]>;
    composites: {};
};
export type DealFreeeMappingGetPayload<S extends boolean | null | undefined | DealFreeeMappingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload, S>;
export type DealFreeeMappingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DealFreeeMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DealFreeeMappingCountAggregateInputType | true;
};
export interface DealFreeeMappingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DealFreeeMapping'];
        meta: {
            name: 'DealFreeeMapping';
        };
    };
    /**
     * Find zero or one DealFreeeMapping that matches the filter.
     * @param {DealFreeeMappingFindUniqueArgs} args - Arguments to find a DealFreeeMapping
     * @example
     * // Get one DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DealFreeeMappingFindUniqueArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one DealFreeeMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DealFreeeMappingFindUniqueOrThrowArgs} args - Arguments to find a DealFreeeMapping
     * @example
     * // Get one DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DealFreeeMappingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DealFreeeMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingFindFirstArgs} args - Arguments to find a DealFreeeMapping
     * @example
     * // Get one DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DealFreeeMappingFindFirstArgs>(args?: Prisma.SelectSubset<T, DealFreeeMappingFindFirstArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first DealFreeeMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingFindFirstOrThrowArgs} args - Arguments to find a DealFreeeMapping
     * @example
     * // Get one DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DealFreeeMappingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DealFreeeMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more DealFreeeMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DealFreeeMappings
     * const dealFreeeMappings = await prisma.dealFreeeMapping.findMany()
     *
     * // Get first 10 DealFreeeMappings
     * const dealFreeeMappings = await prisma.dealFreeeMapping.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const dealFreeeMappingWithIdOnly = await prisma.dealFreeeMapping.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DealFreeeMappingFindManyArgs>(args?: Prisma.SelectSubset<T, DealFreeeMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a DealFreeeMapping.
     * @param {DealFreeeMappingCreateArgs} args - Arguments to create a DealFreeeMapping.
     * @example
     * // Create one DealFreeeMapping
     * const DealFreeeMapping = await prisma.dealFreeeMapping.create({
     *   data: {
     *     // ... data to create a DealFreeeMapping
     *   }
     * })
     *
     */
    create<T extends DealFreeeMappingCreateArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingCreateArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many DealFreeeMappings.
     * @param {DealFreeeMappingCreateManyArgs} args - Arguments to create many DealFreeeMappings.
     * @example
     * // Create many DealFreeeMappings
     * const dealFreeeMapping = await prisma.dealFreeeMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DealFreeeMappingCreateManyArgs>(args?: Prisma.SelectSubset<T, DealFreeeMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a DealFreeeMapping.
     * @param {DealFreeeMappingDeleteArgs} args - Arguments to delete one DealFreeeMapping.
     * @example
     * // Delete one DealFreeeMapping
     * const DealFreeeMapping = await prisma.dealFreeeMapping.delete({
     *   where: {
     *     // ... filter to delete one DealFreeeMapping
     *   }
     * })
     *
     */
    delete<T extends DealFreeeMappingDeleteArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingDeleteArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one DealFreeeMapping.
     * @param {DealFreeeMappingUpdateArgs} args - Arguments to update one DealFreeeMapping.
     * @example
     * // Update one DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DealFreeeMappingUpdateArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingUpdateArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more DealFreeeMappings.
     * @param {DealFreeeMappingDeleteManyArgs} args - Arguments to filter DealFreeeMappings to delete.
     * @example
     * // Delete a few DealFreeeMappings
     * const { count } = await prisma.dealFreeeMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DealFreeeMappingDeleteManyArgs>(args?: Prisma.SelectSubset<T, DealFreeeMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more DealFreeeMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DealFreeeMappings
     * const dealFreeeMapping = await prisma.dealFreeeMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DealFreeeMappingUpdateManyArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one DealFreeeMapping.
     * @param {DealFreeeMappingUpsertArgs} args - Arguments to update or create a DealFreeeMapping.
     * @example
     * // Update or create a DealFreeeMapping
     * const dealFreeeMapping = await prisma.dealFreeeMapping.upsert({
     *   create: {
     *     // ... data to create a DealFreeeMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DealFreeeMapping we want to update
     *   }
     * })
     */
    upsert<T extends DealFreeeMappingUpsertArgs>(args: Prisma.SelectSubset<T, DealFreeeMappingUpsertArgs<ExtArgs>>): Prisma.Prisma__DealFreeeMappingClient<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of DealFreeeMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingCountArgs} args - Arguments to filter DealFreeeMappings to count.
     * @example
     * // Count the number of DealFreeeMappings
     * const count = await prisma.dealFreeeMapping.count({
     *   where: {
     *     // ... the filter for the DealFreeeMappings we want to count
     *   }
     * })
    **/
    count<T extends DealFreeeMappingCountArgs>(args?: Prisma.Subset<T, DealFreeeMappingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DealFreeeMappingCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a DealFreeeMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DealFreeeMappingAggregateArgs>(args: Prisma.Subset<T, DealFreeeMappingAggregateArgs>): Prisma.PrismaPromise<GetDealFreeeMappingAggregateType<T>>;
    /**
     * Group by DealFreeeMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFreeeMappingGroupByArgs} args - Group by arguments.
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
    groupBy<T extends DealFreeeMappingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DealFreeeMappingGroupByArgs['orderBy'];
    } : {
        orderBy?: DealFreeeMappingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DealFreeeMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDealFreeeMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the DealFreeeMapping model
     */
    readonly fields: DealFreeeMappingFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for DealFreeeMapping.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__DealFreeeMappingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    deal<T extends Prisma.DealDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DealDefaultArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the DealFreeeMapping model
 */
export interface DealFreeeMappingFieldRefs {
    readonly id: Prisma.FieldRef<"DealFreeeMapping", 'String'>;
    readonly dealId: Prisma.FieldRef<"DealFreeeMapping", 'String'>;
    readonly freeeDealId: Prisma.FieldRef<"DealFreeeMapping", 'Int'>;
    readonly freeeCompanyId: Prisma.FieldRef<"DealFreeeMapping", 'Int'>;
    readonly lastSyncAt: Prisma.FieldRef<"DealFreeeMapping", 'DateTime'>;
    readonly syncHash: Prisma.FieldRef<"DealFreeeMapping", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DealFreeeMapping", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DealFreeeMapping", 'DateTime'>;
}
/**
 * DealFreeeMapping findUnique
 */
export type DealFreeeMappingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter, which DealFreeeMapping to fetch.
     */
    where: Prisma.DealFreeeMappingWhereUniqueInput;
};
/**
 * DealFreeeMapping findUniqueOrThrow
 */
export type DealFreeeMappingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter, which DealFreeeMapping to fetch.
     */
    where: Prisma.DealFreeeMappingWhereUniqueInput;
};
/**
 * DealFreeeMapping findFirst
 */
export type DealFreeeMappingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter, which DealFreeeMapping to fetch.
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DealFreeeMappings to fetch.
     */
    orderBy?: Prisma.DealFreeeMappingOrderByWithRelationInput | Prisma.DealFreeeMappingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DealFreeeMappings.
     */
    cursor?: Prisma.DealFreeeMappingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DealFreeeMappings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DealFreeeMappings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DealFreeeMappings.
     */
    distinct?: Prisma.DealFreeeMappingScalarFieldEnum | Prisma.DealFreeeMappingScalarFieldEnum[];
};
/**
 * DealFreeeMapping findFirstOrThrow
 */
export type DealFreeeMappingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter, which DealFreeeMapping to fetch.
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DealFreeeMappings to fetch.
     */
    orderBy?: Prisma.DealFreeeMappingOrderByWithRelationInput | Prisma.DealFreeeMappingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DealFreeeMappings.
     */
    cursor?: Prisma.DealFreeeMappingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DealFreeeMappings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DealFreeeMappings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DealFreeeMappings.
     */
    distinct?: Prisma.DealFreeeMappingScalarFieldEnum | Prisma.DealFreeeMappingScalarFieldEnum[];
};
/**
 * DealFreeeMapping findMany
 */
export type DealFreeeMappingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter, which DealFreeeMappings to fetch.
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DealFreeeMappings to fetch.
     */
    orderBy?: Prisma.DealFreeeMappingOrderByWithRelationInput | Prisma.DealFreeeMappingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing DealFreeeMappings.
     */
    cursor?: Prisma.DealFreeeMappingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DealFreeeMappings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DealFreeeMappings.
     */
    skip?: number;
    distinct?: Prisma.DealFreeeMappingScalarFieldEnum | Prisma.DealFreeeMappingScalarFieldEnum[];
};
/**
 * DealFreeeMapping create
 */
export type DealFreeeMappingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * The data needed to create a DealFreeeMapping.
     */
    data: Prisma.XOR<Prisma.DealFreeeMappingCreateInput, Prisma.DealFreeeMappingUncheckedCreateInput>;
};
/**
 * DealFreeeMapping createMany
 */
export type DealFreeeMappingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many DealFreeeMappings.
     */
    data: Prisma.DealFreeeMappingCreateManyInput | Prisma.DealFreeeMappingCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * DealFreeeMapping update
 */
export type DealFreeeMappingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * The data needed to update a DealFreeeMapping.
     */
    data: Prisma.XOR<Prisma.DealFreeeMappingUpdateInput, Prisma.DealFreeeMappingUncheckedUpdateInput>;
    /**
     * Choose, which DealFreeeMapping to update.
     */
    where: Prisma.DealFreeeMappingWhereUniqueInput;
};
/**
 * DealFreeeMapping updateMany
 */
export type DealFreeeMappingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update DealFreeeMappings.
     */
    data: Prisma.XOR<Prisma.DealFreeeMappingUpdateManyMutationInput, Prisma.DealFreeeMappingUncheckedUpdateManyInput>;
    /**
     * Filter which DealFreeeMappings to update
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * Limit how many DealFreeeMappings to update.
     */
    limit?: number;
};
/**
 * DealFreeeMapping upsert
 */
export type DealFreeeMappingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * The filter to search for the DealFreeeMapping to update in case it exists.
     */
    where: Prisma.DealFreeeMappingWhereUniqueInput;
    /**
     * In case the DealFreeeMapping found by the `where` argument doesn't exist, create a new DealFreeeMapping with this data.
     */
    create: Prisma.XOR<Prisma.DealFreeeMappingCreateInput, Prisma.DealFreeeMappingUncheckedCreateInput>;
    /**
     * In case the DealFreeeMapping was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.DealFreeeMappingUpdateInput, Prisma.DealFreeeMappingUncheckedUpdateInput>;
};
/**
 * DealFreeeMapping delete
 */
export type DealFreeeMappingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
    /**
     * Filter which DealFreeeMapping to delete.
     */
    where: Prisma.DealFreeeMappingWhereUniqueInput;
};
/**
 * DealFreeeMapping deleteMany
 */
export type DealFreeeMappingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which DealFreeeMappings to delete
     */
    where?: Prisma.DealFreeeMappingWhereInput;
    /**
     * Limit how many DealFreeeMappings to delete.
     */
    limit?: number;
};
/**
 * DealFreeeMapping without action
 */
export type DealFreeeMappingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealFreeeMapping
     */
    select?: Prisma.DealFreeeMappingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the DealFreeeMapping
     */
    omit?: Prisma.DealFreeeMappingOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealFreeeMappingInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=DealFreeeMapping.d.ts.map