import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Deal
 *
 */
export type DealModel = runtime.Types.Result.DefaultSelection<Prisma.$DealPayload>;
export type AggregateDeal = {
    _count: DealCountAggregateOutputType | null;
    _avg: DealAvgAggregateOutputType | null;
    _sum: DealSumAggregateOutputType | null;
    _min: DealMinAggregateOutputType | null;
    _max: DealMaxAggregateOutputType | null;
};
export type DealAvgAggregateOutputType = {
    value: runtime.Decimal | null;
};
export type DealSumAggregateOutputType = {
    value: runtime.Decimal | null;
};
export type DealMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    leadId: string | null;
    stageId: string | null;
    name: string | null;
    value: runtime.Decimal | null;
    currency: string | null;
    expectedCloseDate: Date | null;
    actualCloseDate: Date | null;
    status: $Enums.DealStatus | null;
    notes: string | null;
    lostReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DealMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    leadId: string | null;
    stageId: string | null;
    name: string | null;
    value: runtime.Decimal | null;
    currency: string | null;
    expectedCloseDate: Date | null;
    actualCloseDate: Date | null;
    status: $Enums.DealStatus | null;
    notes: string | null;
    lostReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DealCountAggregateOutputType = {
    id: number;
    customerId: number;
    leadId: number;
    stageId: number;
    name: number;
    value: number;
    currency: number;
    expectedCloseDate: number;
    actualCloseDate: number;
    status: number;
    notes: number;
    lostReason: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DealAvgAggregateInputType = {
    value?: true;
};
export type DealSumAggregateInputType = {
    value?: true;
};
export type DealMinAggregateInputType = {
    id?: true;
    customerId?: true;
    leadId?: true;
    stageId?: true;
    name?: true;
    value?: true;
    currency?: true;
    expectedCloseDate?: true;
    actualCloseDate?: true;
    status?: true;
    notes?: true;
    lostReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DealMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    leadId?: true;
    stageId?: true;
    name?: true;
    value?: true;
    currency?: true;
    expectedCloseDate?: true;
    actualCloseDate?: true;
    status?: true;
    notes?: true;
    lostReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DealCountAggregateInputType = {
    id?: true;
    customerId?: true;
    leadId?: true;
    stageId?: true;
    name?: true;
    value?: true;
    currency?: true;
    expectedCloseDate?: true;
    actualCloseDate?: true;
    status?: true;
    notes?: true;
    lostReason?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DealAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Deal to aggregate.
     */
    where?: Prisma.DealWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Deals to fetch.
     */
    orderBy?: Prisma.DealOrderByWithRelationInput | Prisma.DealOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.DealWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Deals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Deals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Deals
    **/
    _count?: true | DealCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: DealAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: DealSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: DealMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: DealMaxAggregateInputType;
};
export type GetDealAggregateType<T extends DealAggregateArgs> = {
    [P in keyof T & keyof AggregateDeal]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDeal[P]> : Prisma.GetScalarType<T[P], AggregateDeal[P]>;
};
export type DealGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DealWhereInput;
    orderBy?: Prisma.DealOrderByWithAggregationInput | Prisma.DealOrderByWithAggregationInput[];
    by: Prisma.DealScalarFieldEnum[] | Prisma.DealScalarFieldEnum;
    having?: Prisma.DealScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DealCountAggregateInputType | true;
    _avg?: DealAvgAggregateInputType;
    _sum?: DealSumAggregateInputType;
    _min?: DealMinAggregateInputType;
    _max?: DealMaxAggregateInputType;
};
export type DealGroupByOutputType = {
    id: string;
    customerId: string | null;
    leadId: string | null;
    stageId: string;
    name: string;
    value: runtime.Decimal | null;
    currency: string;
    expectedCloseDate: Date | null;
    actualCloseDate: Date | null;
    status: $Enums.DealStatus;
    notes: string | null;
    lostReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: DealCountAggregateOutputType | null;
    _avg: DealAvgAggregateOutputType | null;
    _sum: DealSumAggregateOutputType | null;
    _min: DealMinAggregateOutputType | null;
    _max: DealMaxAggregateOutputType | null;
};
type GetDealGroupByPayload<T extends DealGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DealGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DealGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DealGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DealGroupByOutputType[P]>;
}>>;
export type DealWhereInput = {
    AND?: Prisma.DealWhereInput | Prisma.DealWhereInput[];
    OR?: Prisma.DealWhereInput[];
    NOT?: Prisma.DealWhereInput | Prisma.DealWhereInput[];
    id?: Prisma.StringFilter<"Deal"> | string;
    customerId?: Prisma.StringNullableFilter<"Deal"> | string | null;
    leadId?: Prisma.StringNullableFilter<"Deal"> | string | null;
    stageId?: Prisma.StringFilter<"Deal"> | string;
    name?: Prisma.StringFilter<"Deal"> | string;
    value?: Prisma.DecimalNullableFilter<"Deal"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFilter<"Deal"> | string;
    expectedCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    actualCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    status?: Prisma.EnumDealStatusFilter<"Deal"> | $Enums.DealStatus;
    notes?: Prisma.StringNullableFilter<"Deal"> | string | null;
    lostReason?: Prisma.StringNullableFilter<"Deal"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    lead?: Prisma.XOR<Prisma.LeadNullableScalarRelationFilter, Prisma.LeadWhereInput> | null;
    stage?: Prisma.XOR<Prisma.PipelineStageScalarRelationFilter, Prisma.PipelineStageWhereInput>;
    freeeMappings?: Prisma.DealFreeeMappingListRelationFilter;
};
export type DealOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    leadId?: Prisma.SortOrderInput | Prisma.SortOrder;
    stageId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    value?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    expectedCloseDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    actualCloseDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    lostReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    lead?: Prisma.LeadOrderByWithRelationInput;
    stage?: Prisma.PipelineStageOrderByWithRelationInput;
    freeeMappings?: Prisma.DealFreeeMappingOrderByRelationAggregateInput;
    _relevance?: Prisma.DealOrderByRelevanceInput;
};
export type DealWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    leadId?: string;
    AND?: Prisma.DealWhereInput | Prisma.DealWhereInput[];
    OR?: Prisma.DealWhereInput[];
    NOT?: Prisma.DealWhereInput | Prisma.DealWhereInput[];
    customerId?: Prisma.StringNullableFilter<"Deal"> | string | null;
    stageId?: Prisma.StringFilter<"Deal"> | string;
    name?: Prisma.StringFilter<"Deal"> | string;
    value?: Prisma.DecimalNullableFilter<"Deal"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFilter<"Deal"> | string;
    expectedCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    actualCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    status?: Prisma.EnumDealStatusFilter<"Deal"> | $Enums.DealStatus;
    notes?: Prisma.StringNullableFilter<"Deal"> | string | null;
    lostReason?: Prisma.StringNullableFilter<"Deal"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    lead?: Prisma.XOR<Prisma.LeadNullableScalarRelationFilter, Prisma.LeadWhereInput> | null;
    stage?: Prisma.XOR<Prisma.PipelineStageScalarRelationFilter, Prisma.PipelineStageWhereInput>;
    freeeMappings?: Prisma.DealFreeeMappingListRelationFilter;
}, "id" | "leadId">;
export type DealOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    leadId?: Prisma.SortOrderInput | Prisma.SortOrder;
    stageId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    value?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    expectedCloseDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    actualCloseDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    lostReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DealCountOrderByAggregateInput;
    _avg?: Prisma.DealAvgOrderByAggregateInput;
    _max?: Prisma.DealMaxOrderByAggregateInput;
    _min?: Prisma.DealMinOrderByAggregateInput;
    _sum?: Prisma.DealSumOrderByAggregateInput;
};
export type DealScalarWhereWithAggregatesInput = {
    AND?: Prisma.DealScalarWhereWithAggregatesInput | Prisma.DealScalarWhereWithAggregatesInput[];
    OR?: Prisma.DealScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DealScalarWhereWithAggregatesInput | Prisma.DealScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Deal"> | string;
    customerId?: Prisma.StringNullableWithAggregatesFilter<"Deal"> | string | null;
    leadId?: Prisma.StringNullableWithAggregatesFilter<"Deal"> | string | null;
    stageId?: Prisma.StringWithAggregatesFilter<"Deal"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Deal"> | string;
    value?: Prisma.DecimalNullableWithAggregatesFilter<"Deal"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringWithAggregatesFilter<"Deal"> | string;
    expectedCloseDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Deal"> | Date | string | null;
    actualCloseDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Deal"> | Date | string | null;
    status?: Prisma.EnumDealStatusWithAggregatesFilter<"Deal"> | $Enums.DealStatus;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Deal"> | string | null;
    lostReason?: Prisma.StringNullableWithAggregatesFilter<"Deal"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Deal"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Deal"> | Date | string;
};
export type DealCreateInput = {
    id?: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutDealsInput;
    lead?: Prisma.LeadCreateNestedOneWithoutDealInput;
    stage: Prisma.PipelineStageCreateNestedOneWithoutDealsInput;
    freeeMappings?: Prisma.DealFreeeMappingCreateNestedManyWithoutDealInput;
};
export type DealUncheckedCreateInput = {
    id?: string;
    customerId?: string | null;
    leadId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedCreateNestedManyWithoutDealInput;
};
export type DealUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutDealsNestedInput;
    lead?: Prisma.LeadUpdateOneWithoutDealNestedInput;
    stage?: Prisma.PipelineStageUpdateOneRequiredWithoutDealsNestedInput;
    freeeMappings?: Prisma.DealFreeeMappingUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedUpdateManyWithoutDealNestedInput;
};
export type DealCreateManyInput = {
    id?: string;
    customerId?: string | null;
    leadId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealListRelationFilter = {
    every?: Prisma.DealWhereInput;
    some?: Prisma.DealWhereInput;
    none?: Prisma.DealWhereInput;
};
export type DealOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DealNullableScalarRelationFilter = {
    is?: Prisma.DealWhereInput | null;
    isNot?: Prisma.DealWhereInput | null;
};
export type DealOrderByRelevanceInput = {
    fields: Prisma.DealOrderByRelevanceFieldEnum | Prisma.DealOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type DealCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    stageId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    expectedCloseDate?: Prisma.SortOrder;
    actualCloseDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    lostReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealAvgOrderByAggregateInput = {
    value?: Prisma.SortOrder;
};
export type DealMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    stageId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    expectedCloseDate?: Prisma.SortOrder;
    actualCloseDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    lostReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    stageId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    expectedCloseDate?: Prisma.SortOrder;
    actualCloseDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    lostReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DealSumOrderByAggregateInput = {
    value?: Prisma.SortOrder;
};
export type DealScalarRelationFilter = {
    is?: Prisma.DealWhereInput;
    isNot?: Prisma.DealWhereInput;
};
export type DealCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput> | Prisma.DealCreateWithoutCustomerInput[] | Prisma.DealUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutCustomerInput | Prisma.DealCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.DealCreateManyCustomerInputEnvelope;
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
};
export type DealUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput> | Prisma.DealCreateWithoutCustomerInput[] | Prisma.DealUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutCustomerInput | Prisma.DealCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.DealCreateManyCustomerInputEnvelope;
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
};
export type DealUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput> | Prisma.DealCreateWithoutCustomerInput[] | Prisma.DealUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutCustomerInput | Prisma.DealCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.DealUpsertWithWhereUniqueWithoutCustomerInput | Prisma.DealUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.DealCreateManyCustomerInputEnvelope;
    set?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    disconnect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    delete?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    update?: Prisma.DealUpdateWithWhereUniqueWithoutCustomerInput | Prisma.DealUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.DealUpdateManyWithWhereWithoutCustomerInput | Prisma.DealUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
};
export type DealUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput> | Prisma.DealCreateWithoutCustomerInput[] | Prisma.DealUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutCustomerInput | Prisma.DealCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.DealUpsertWithWhereUniqueWithoutCustomerInput | Prisma.DealUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.DealCreateManyCustomerInputEnvelope;
    set?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    disconnect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    delete?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    update?: Prisma.DealUpdateWithWhereUniqueWithoutCustomerInput | Prisma.DealUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.DealUpdateManyWithWhereWithoutCustomerInput | Prisma.DealUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
};
export type DealCreateNestedOneWithoutLeadInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutLeadInput;
    connect?: Prisma.DealWhereUniqueInput;
};
export type DealUncheckedCreateNestedOneWithoutLeadInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutLeadInput;
    connect?: Prisma.DealWhereUniqueInput;
};
export type DealUpdateOneWithoutLeadNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutLeadInput;
    upsert?: Prisma.DealUpsertWithoutLeadInput;
    disconnect?: Prisma.DealWhereInput | boolean;
    delete?: Prisma.DealWhereInput | boolean;
    connect?: Prisma.DealWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DealUpdateToOneWithWhereWithoutLeadInput, Prisma.DealUpdateWithoutLeadInput>, Prisma.DealUncheckedUpdateWithoutLeadInput>;
};
export type DealUncheckedUpdateOneWithoutLeadNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutLeadInput;
    upsert?: Prisma.DealUpsertWithoutLeadInput;
    disconnect?: Prisma.DealWhereInput | boolean;
    delete?: Prisma.DealWhereInput | boolean;
    connect?: Prisma.DealWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DealUpdateToOneWithWhereWithoutLeadInput, Prisma.DealUpdateWithoutLeadInput>, Prisma.DealUncheckedUpdateWithoutLeadInput>;
};
export type DealCreateNestedManyWithoutStageInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput> | Prisma.DealCreateWithoutStageInput[] | Prisma.DealUncheckedCreateWithoutStageInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutStageInput | Prisma.DealCreateOrConnectWithoutStageInput[];
    createMany?: Prisma.DealCreateManyStageInputEnvelope;
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
};
export type DealUncheckedCreateNestedManyWithoutStageInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput> | Prisma.DealCreateWithoutStageInput[] | Prisma.DealUncheckedCreateWithoutStageInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutStageInput | Prisma.DealCreateOrConnectWithoutStageInput[];
    createMany?: Prisma.DealCreateManyStageInputEnvelope;
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
};
export type DealUpdateManyWithoutStageNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput> | Prisma.DealCreateWithoutStageInput[] | Prisma.DealUncheckedCreateWithoutStageInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutStageInput | Prisma.DealCreateOrConnectWithoutStageInput[];
    upsert?: Prisma.DealUpsertWithWhereUniqueWithoutStageInput | Prisma.DealUpsertWithWhereUniqueWithoutStageInput[];
    createMany?: Prisma.DealCreateManyStageInputEnvelope;
    set?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    disconnect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    delete?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    update?: Prisma.DealUpdateWithWhereUniqueWithoutStageInput | Prisma.DealUpdateWithWhereUniqueWithoutStageInput[];
    updateMany?: Prisma.DealUpdateManyWithWhereWithoutStageInput | Prisma.DealUpdateManyWithWhereWithoutStageInput[];
    deleteMany?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
};
export type DealUncheckedUpdateManyWithoutStageNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput> | Prisma.DealCreateWithoutStageInput[] | Prisma.DealUncheckedCreateWithoutStageInput[];
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutStageInput | Prisma.DealCreateOrConnectWithoutStageInput[];
    upsert?: Prisma.DealUpsertWithWhereUniqueWithoutStageInput | Prisma.DealUpsertWithWhereUniqueWithoutStageInput[];
    createMany?: Prisma.DealCreateManyStageInputEnvelope;
    set?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    disconnect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    delete?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    connect?: Prisma.DealWhereUniqueInput | Prisma.DealWhereUniqueInput[];
    update?: Prisma.DealUpdateWithWhereUniqueWithoutStageInput | Prisma.DealUpdateWithWhereUniqueWithoutStageInput[];
    updateMany?: Prisma.DealUpdateManyWithWhereWithoutStageInput | Prisma.DealUpdateManyWithWhereWithoutStageInput[];
    deleteMany?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumDealStatusFieldUpdateOperationsInput = {
    set?: $Enums.DealStatus;
};
export type DealCreateNestedOneWithoutFreeeMappingsInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutFreeeMappingsInput, Prisma.DealUncheckedCreateWithoutFreeeMappingsInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutFreeeMappingsInput;
    connect?: Prisma.DealWhereUniqueInput;
};
export type DealUpdateOneRequiredWithoutFreeeMappingsNestedInput = {
    create?: Prisma.XOR<Prisma.DealCreateWithoutFreeeMappingsInput, Prisma.DealUncheckedCreateWithoutFreeeMappingsInput>;
    connectOrCreate?: Prisma.DealCreateOrConnectWithoutFreeeMappingsInput;
    upsert?: Prisma.DealUpsertWithoutFreeeMappingsInput;
    connect?: Prisma.DealWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DealUpdateToOneWithWhereWithoutFreeeMappingsInput, Prisma.DealUpdateWithoutFreeeMappingsInput>, Prisma.DealUncheckedUpdateWithoutFreeeMappingsInput>;
};
export type DealCreateWithoutCustomerInput = {
    id?: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lead?: Prisma.LeadCreateNestedOneWithoutDealInput;
    stage: Prisma.PipelineStageCreateNestedOneWithoutDealsInput;
    freeeMappings?: Prisma.DealFreeeMappingCreateNestedManyWithoutDealInput;
};
export type DealUncheckedCreateWithoutCustomerInput = {
    id?: string;
    leadId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedCreateNestedManyWithoutDealInput;
};
export type DealCreateOrConnectWithoutCustomerInput = {
    where: Prisma.DealWhereUniqueInput;
    create: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput>;
};
export type DealCreateManyCustomerInputEnvelope = {
    data: Prisma.DealCreateManyCustomerInput | Prisma.DealCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type DealUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.DealWhereUniqueInput;
    update: Prisma.XOR<Prisma.DealUpdateWithoutCustomerInput, Prisma.DealUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.DealCreateWithoutCustomerInput, Prisma.DealUncheckedCreateWithoutCustomerInput>;
};
export type DealUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.DealWhereUniqueInput;
    data: Prisma.XOR<Prisma.DealUpdateWithoutCustomerInput, Prisma.DealUncheckedUpdateWithoutCustomerInput>;
};
export type DealUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.DealScalarWhereInput;
    data: Prisma.XOR<Prisma.DealUpdateManyMutationInput, Prisma.DealUncheckedUpdateManyWithoutCustomerInput>;
};
export type DealScalarWhereInput = {
    AND?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
    OR?: Prisma.DealScalarWhereInput[];
    NOT?: Prisma.DealScalarWhereInput | Prisma.DealScalarWhereInput[];
    id?: Prisma.StringFilter<"Deal"> | string;
    customerId?: Prisma.StringNullableFilter<"Deal"> | string | null;
    leadId?: Prisma.StringNullableFilter<"Deal"> | string | null;
    stageId?: Prisma.StringFilter<"Deal"> | string;
    name?: Prisma.StringFilter<"Deal"> | string;
    value?: Prisma.DecimalNullableFilter<"Deal"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFilter<"Deal"> | string;
    expectedCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    actualCloseDate?: Prisma.DateTimeNullableFilter<"Deal"> | Date | string | null;
    status?: Prisma.EnumDealStatusFilter<"Deal"> | $Enums.DealStatus;
    notes?: Prisma.StringNullableFilter<"Deal"> | string | null;
    lostReason?: Prisma.StringNullableFilter<"Deal"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Deal"> | Date | string;
};
export type DealCreateWithoutLeadInput = {
    id?: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutDealsInput;
    stage: Prisma.PipelineStageCreateNestedOneWithoutDealsInput;
    freeeMappings?: Prisma.DealFreeeMappingCreateNestedManyWithoutDealInput;
};
export type DealUncheckedCreateWithoutLeadInput = {
    id?: string;
    customerId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedCreateNestedManyWithoutDealInput;
};
export type DealCreateOrConnectWithoutLeadInput = {
    where: Prisma.DealWhereUniqueInput;
    create: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
};
export type DealUpsertWithoutLeadInput = {
    update: Prisma.XOR<Prisma.DealUpdateWithoutLeadInput, Prisma.DealUncheckedUpdateWithoutLeadInput>;
    create: Prisma.XOR<Prisma.DealCreateWithoutLeadInput, Prisma.DealUncheckedCreateWithoutLeadInput>;
    where?: Prisma.DealWhereInput;
};
export type DealUpdateToOneWithWhereWithoutLeadInput = {
    where?: Prisma.DealWhereInput;
    data: Prisma.XOR<Prisma.DealUpdateWithoutLeadInput, Prisma.DealUncheckedUpdateWithoutLeadInput>;
};
export type DealUpdateWithoutLeadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutDealsNestedInput;
    stage?: Prisma.PipelineStageUpdateOneRequiredWithoutDealsNestedInput;
    freeeMappings?: Prisma.DealFreeeMappingUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateWithoutLeadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedUpdateManyWithoutDealNestedInput;
};
export type DealCreateWithoutStageInput = {
    id?: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutDealsInput;
    lead?: Prisma.LeadCreateNestedOneWithoutDealInput;
    freeeMappings?: Prisma.DealFreeeMappingCreateNestedManyWithoutDealInput;
};
export type DealUncheckedCreateWithoutStageInput = {
    id?: string;
    customerId?: string | null;
    leadId?: string | null;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedCreateNestedManyWithoutDealInput;
};
export type DealCreateOrConnectWithoutStageInput = {
    where: Prisma.DealWhereUniqueInput;
    create: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput>;
};
export type DealCreateManyStageInputEnvelope = {
    data: Prisma.DealCreateManyStageInput | Prisma.DealCreateManyStageInput[];
    skipDuplicates?: boolean;
};
export type DealUpsertWithWhereUniqueWithoutStageInput = {
    where: Prisma.DealWhereUniqueInput;
    update: Prisma.XOR<Prisma.DealUpdateWithoutStageInput, Prisma.DealUncheckedUpdateWithoutStageInput>;
    create: Prisma.XOR<Prisma.DealCreateWithoutStageInput, Prisma.DealUncheckedCreateWithoutStageInput>;
};
export type DealUpdateWithWhereUniqueWithoutStageInput = {
    where: Prisma.DealWhereUniqueInput;
    data: Prisma.XOR<Prisma.DealUpdateWithoutStageInput, Prisma.DealUncheckedUpdateWithoutStageInput>;
};
export type DealUpdateManyWithWhereWithoutStageInput = {
    where: Prisma.DealScalarWhereInput;
    data: Prisma.XOR<Prisma.DealUpdateManyMutationInput, Prisma.DealUncheckedUpdateManyWithoutStageInput>;
};
export type DealCreateWithoutFreeeMappingsInput = {
    id?: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutDealsInput;
    lead?: Prisma.LeadCreateNestedOneWithoutDealInput;
    stage: Prisma.PipelineStageCreateNestedOneWithoutDealsInput;
};
export type DealUncheckedCreateWithoutFreeeMappingsInput = {
    id?: string;
    customerId?: string | null;
    leadId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealCreateOrConnectWithoutFreeeMappingsInput = {
    where: Prisma.DealWhereUniqueInput;
    create: Prisma.XOR<Prisma.DealCreateWithoutFreeeMappingsInput, Prisma.DealUncheckedCreateWithoutFreeeMappingsInput>;
};
export type DealUpsertWithoutFreeeMappingsInput = {
    update: Prisma.XOR<Prisma.DealUpdateWithoutFreeeMappingsInput, Prisma.DealUncheckedUpdateWithoutFreeeMappingsInput>;
    create: Prisma.XOR<Prisma.DealCreateWithoutFreeeMappingsInput, Prisma.DealUncheckedCreateWithoutFreeeMappingsInput>;
    where?: Prisma.DealWhereInput;
};
export type DealUpdateToOneWithWhereWithoutFreeeMappingsInput = {
    where?: Prisma.DealWhereInput;
    data: Prisma.XOR<Prisma.DealUpdateWithoutFreeeMappingsInput, Prisma.DealUncheckedUpdateWithoutFreeeMappingsInput>;
};
export type DealUpdateWithoutFreeeMappingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutDealsNestedInput;
    lead?: Prisma.LeadUpdateOneWithoutDealNestedInput;
    stage?: Prisma.PipelineStageUpdateOneRequiredWithoutDealsNestedInput;
};
export type DealUncheckedUpdateWithoutFreeeMappingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealCreateManyCustomerInput = {
    id?: string;
    leadId?: string | null;
    stageId: string;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.LeadUpdateOneWithoutDealNestedInput;
    stage?: Prisma.PipelineStageUpdateOneRequiredWithoutDealsNestedInput;
    freeeMappings?: Prisma.DealFreeeMappingUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stageId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DealCreateManyStageInput = {
    id?: string;
    customerId?: string | null;
    leadId?: string | null;
    name: string;
    value?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: string;
    expectedCloseDate?: Date | string | null;
    actualCloseDate?: Date | string | null;
    status?: $Enums.DealStatus;
    notes?: string | null;
    lostReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DealUpdateWithoutStageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutDealsNestedInput;
    lead?: Prisma.LeadUpdateOneWithoutDealNestedInput;
    freeeMappings?: Prisma.DealFreeeMappingUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateWithoutStageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    freeeMappings?: Prisma.DealFreeeMappingUncheckedUpdateManyWithoutDealNestedInput;
};
export type DealUncheckedUpdateManyWithoutStageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    leadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    expectedCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    actualCloseDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumDealStatusFieldUpdateOperationsInput | $Enums.DealStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lostReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type DealCountOutputType
 */
export type DealCountOutputType = {
    freeeMappings: number;
};
export type DealCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    freeeMappings?: boolean | DealCountOutputTypeCountFreeeMappingsArgs;
};
/**
 * DealCountOutputType without action
 */
export type DealCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DealCountOutputType
     */
    select?: Prisma.DealCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * DealCountOutputType without action
 */
export type DealCountOutputTypeCountFreeeMappingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DealFreeeMappingWhereInput;
};
export type DealSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    leadId?: boolean;
    stageId?: boolean;
    name?: boolean;
    value?: boolean;
    currency?: boolean;
    expectedCloseDate?: boolean;
    actualCloseDate?: boolean;
    status?: boolean;
    notes?: boolean;
    lostReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.Deal$customerArgs<ExtArgs>;
    lead?: boolean | Prisma.Deal$leadArgs<ExtArgs>;
    stage?: boolean | Prisma.PipelineStageDefaultArgs<ExtArgs>;
    freeeMappings?: boolean | Prisma.Deal$freeeMappingsArgs<ExtArgs>;
    _count?: boolean | Prisma.DealCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["deal"]>;
export type DealSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    leadId?: boolean;
    stageId?: boolean;
    name?: boolean;
    value?: boolean;
    currency?: boolean;
    expectedCloseDate?: boolean;
    actualCloseDate?: boolean;
    status?: boolean;
    notes?: boolean;
    lostReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DealOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "leadId" | "stageId" | "name" | "value" | "currency" | "expectedCloseDate" | "actualCloseDate" | "status" | "notes" | "lostReason" | "createdAt" | "updatedAt", ExtArgs["result"]["deal"]>;
export type DealInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.Deal$customerArgs<ExtArgs>;
    lead?: boolean | Prisma.Deal$leadArgs<ExtArgs>;
    stage?: boolean | Prisma.PipelineStageDefaultArgs<ExtArgs>;
    freeeMappings?: boolean | Prisma.Deal$freeeMappingsArgs<ExtArgs>;
    _count?: boolean | Prisma.DealCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $DealPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Deal";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        lead: Prisma.$LeadPayload<ExtArgs> | null;
        stage: Prisma.$PipelineStagePayload<ExtArgs>;
        freeeMappings: Prisma.$DealFreeeMappingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string | null;
        leadId: string | null;
        stageId: string;
        name: string;
        value: runtime.Decimal | null;
        currency: string;
        expectedCloseDate: Date | null;
        actualCloseDate: Date | null;
        status: $Enums.DealStatus;
        notes: string | null;
        lostReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["deal"]>;
    composites: {};
};
export type DealGetPayload<S extends boolean | null | undefined | DealDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DealPayload, S>;
export type DealCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DealFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DealCountAggregateInputType | true;
};
export interface DealDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Deal'];
        meta: {
            name: 'Deal';
        };
    };
    /**
     * Find zero or one Deal that matches the filter.
     * @param {DealFindUniqueArgs} args - Arguments to find a Deal
     * @example
     * // Get one Deal
     * const deal = await prisma.deal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DealFindUniqueArgs>(args: Prisma.SelectSubset<T, DealFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Deal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DealFindUniqueOrThrowArgs} args - Arguments to find a Deal
     * @example
     * // Get one Deal
     * const deal = await prisma.deal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DealFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DealFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Deal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFindFirstArgs} args - Arguments to find a Deal
     * @example
     * // Get one Deal
     * const deal = await prisma.deal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DealFindFirstArgs>(args?: Prisma.SelectSubset<T, DealFindFirstArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Deal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFindFirstOrThrowArgs} args - Arguments to find a Deal
     * @example
     * // Get one Deal
     * const deal = await prisma.deal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DealFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DealFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Deals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deals
     * const deals = await prisma.deal.findMany()
     *
     * // Get first 10 Deals
     * const deals = await prisma.deal.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const dealWithIdOnly = await prisma.deal.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DealFindManyArgs>(args?: Prisma.SelectSubset<T, DealFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Deal.
     * @param {DealCreateArgs} args - Arguments to create a Deal.
     * @example
     * // Create one Deal
     * const Deal = await prisma.deal.create({
     *   data: {
     *     // ... data to create a Deal
     *   }
     * })
     *
     */
    create<T extends DealCreateArgs>(args: Prisma.SelectSubset<T, DealCreateArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Deals.
     * @param {DealCreateManyArgs} args - Arguments to create many Deals.
     * @example
     * // Create many Deals
     * const deal = await prisma.deal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DealCreateManyArgs>(args?: Prisma.SelectSubset<T, DealCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Deal.
     * @param {DealDeleteArgs} args - Arguments to delete one Deal.
     * @example
     * // Delete one Deal
     * const Deal = await prisma.deal.delete({
     *   where: {
     *     // ... filter to delete one Deal
     *   }
     * })
     *
     */
    delete<T extends DealDeleteArgs>(args: Prisma.SelectSubset<T, DealDeleteArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Deal.
     * @param {DealUpdateArgs} args - Arguments to update one Deal.
     * @example
     * // Update one Deal
     * const deal = await prisma.deal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DealUpdateArgs>(args: Prisma.SelectSubset<T, DealUpdateArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Deals.
     * @param {DealDeleteManyArgs} args - Arguments to filter Deals to delete.
     * @example
     * // Delete a few Deals
     * const { count } = await prisma.deal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DealDeleteManyArgs>(args?: Prisma.SelectSubset<T, DealDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Deals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deals
     * const deal = await prisma.deal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DealUpdateManyArgs>(args: Prisma.SelectSubset<T, DealUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Deal.
     * @param {DealUpsertArgs} args - Arguments to update or create a Deal.
     * @example
     * // Update or create a Deal
     * const deal = await prisma.deal.upsert({
     *   create: {
     *     // ... data to create a Deal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deal we want to update
     *   }
     * })
     */
    upsert<T extends DealUpsertArgs>(args: Prisma.SelectSubset<T, DealUpsertArgs<ExtArgs>>): Prisma.Prisma__DealClient<runtime.Types.Result.GetResult<Prisma.$DealPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Deals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealCountArgs} args - Arguments to filter Deals to count.
     * @example
     * // Count the number of Deals
     * const count = await prisma.deal.count({
     *   where: {
     *     // ... the filter for the Deals we want to count
     *   }
     * })
    **/
    count<T extends DealCountArgs>(args?: Prisma.Subset<T, DealCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DealCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Deal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DealAggregateArgs>(args: Prisma.Subset<T, DealAggregateArgs>): Prisma.PrismaPromise<GetDealAggregateType<T>>;
    /**
     * Group by Deal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DealGroupByArgs} args - Group by arguments.
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
    groupBy<T extends DealGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DealGroupByArgs['orderBy'];
    } : {
        orderBy?: DealGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DealGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDealGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Deal model
     */
    readonly fields: DealFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Deal.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__DealClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.Deal$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Deal$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    lead<T extends Prisma.Deal$leadArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Deal$leadArgs<ExtArgs>>): Prisma.Prisma__LeadClient<runtime.Types.Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    stage<T extends Prisma.PipelineStageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PipelineStageDefaultArgs<ExtArgs>>): Prisma.Prisma__PipelineStageClient<runtime.Types.Result.GetResult<Prisma.$PipelineStagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    freeeMappings<T extends Prisma.Deal$freeeMappingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Deal$freeeMappingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DealFreeeMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Deal model
 */
export interface DealFieldRefs {
    readonly id: Prisma.FieldRef<"Deal", 'String'>;
    readonly customerId: Prisma.FieldRef<"Deal", 'String'>;
    readonly leadId: Prisma.FieldRef<"Deal", 'String'>;
    readonly stageId: Prisma.FieldRef<"Deal", 'String'>;
    readonly name: Prisma.FieldRef<"Deal", 'String'>;
    readonly value: Prisma.FieldRef<"Deal", 'Decimal'>;
    readonly currency: Prisma.FieldRef<"Deal", 'String'>;
    readonly expectedCloseDate: Prisma.FieldRef<"Deal", 'DateTime'>;
    readonly actualCloseDate: Prisma.FieldRef<"Deal", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Deal", 'DealStatus'>;
    readonly notes: Prisma.FieldRef<"Deal", 'String'>;
    readonly lostReason: Prisma.FieldRef<"Deal", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Deal", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Deal", 'DateTime'>;
}
/**
 * Deal findUnique
 */
export type DealFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter, which Deal to fetch.
     */
    where: Prisma.DealWhereUniqueInput;
};
/**
 * Deal findUniqueOrThrow
 */
export type DealFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter, which Deal to fetch.
     */
    where: Prisma.DealWhereUniqueInput;
};
/**
 * Deal findFirst
 */
export type DealFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter, which Deal to fetch.
     */
    where?: Prisma.DealWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Deals to fetch.
     */
    orderBy?: Prisma.DealOrderByWithRelationInput | Prisma.DealOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Deals.
     */
    cursor?: Prisma.DealWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Deals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Deals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Deals.
     */
    distinct?: Prisma.DealScalarFieldEnum | Prisma.DealScalarFieldEnum[];
};
/**
 * Deal findFirstOrThrow
 */
export type DealFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter, which Deal to fetch.
     */
    where?: Prisma.DealWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Deals to fetch.
     */
    orderBy?: Prisma.DealOrderByWithRelationInput | Prisma.DealOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Deals.
     */
    cursor?: Prisma.DealWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Deals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Deals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Deals.
     */
    distinct?: Prisma.DealScalarFieldEnum | Prisma.DealScalarFieldEnum[];
};
/**
 * Deal findMany
 */
export type DealFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter, which Deals to fetch.
     */
    where?: Prisma.DealWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Deals to fetch.
     */
    orderBy?: Prisma.DealOrderByWithRelationInput | Prisma.DealOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Deals.
     */
    cursor?: Prisma.DealWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Deals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Deals.
     */
    skip?: number;
    distinct?: Prisma.DealScalarFieldEnum | Prisma.DealScalarFieldEnum[];
};
/**
 * Deal create
 */
export type DealCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * The data needed to create a Deal.
     */
    data: Prisma.XOR<Prisma.DealCreateInput, Prisma.DealUncheckedCreateInput>;
};
/**
 * Deal createMany
 */
export type DealCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deals.
     */
    data: Prisma.DealCreateManyInput | Prisma.DealCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Deal update
 */
export type DealUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * The data needed to update a Deal.
     */
    data: Prisma.XOR<Prisma.DealUpdateInput, Prisma.DealUncheckedUpdateInput>;
    /**
     * Choose, which Deal to update.
     */
    where: Prisma.DealWhereUniqueInput;
};
/**
 * Deal updateMany
 */
export type DealUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Deals.
     */
    data: Prisma.XOR<Prisma.DealUpdateManyMutationInput, Prisma.DealUncheckedUpdateManyInput>;
    /**
     * Filter which Deals to update
     */
    where?: Prisma.DealWhereInput;
    /**
     * Limit how many Deals to update.
     */
    limit?: number;
};
/**
 * Deal upsert
 */
export type DealUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * The filter to search for the Deal to update in case it exists.
     */
    where: Prisma.DealWhereUniqueInput;
    /**
     * In case the Deal found by the `where` argument doesn't exist, create a new Deal with this data.
     */
    create: Prisma.XOR<Prisma.DealCreateInput, Prisma.DealUncheckedCreateInput>;
    /**
     * In case the Deal was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.DealUpdateInput, Prisma.DealUncheckedUpdateInput>;
};
/**
 * Deal delete
 */
export type DealDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
    /**
     * Filter which Deal to delete.
     */
    where: Prisma.DealWhereUniqueInput;
};
/**
 * Deal deleteMany
 */
export type DealDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Deals to delete
     */
    where?: Prisma.DealWhereInput;
    /**
     * Limit how many Deals to delete.
     */
    limit?: number;
};
/**
 * Deal.customer
 */
export type Deal$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
/**
 * Deal.lead
 */
export type Deal$leadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: Prisma.LeadSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Lead
     */
    omit?: Prisma.LeadOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LeadInclude<ExtArgs> | null;
    where?: Prisma.LeadWhereInput;
};
/**
 * Deal.freeeMappings
 */
export type Deal$freeeMappingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.DealFreeeMappingWhereInput;
    orderBy?: Prisma.DealFreeeMappingOrderByWithRelationInput | Prisma.DealFreeeMappingOrderByWithRelationInput[];
    cursor?: Prisma.DealFreeeMappingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DealFreeeMappingScalarFieldEnum | Prisma.DealFreeeMappingScalarFieldEnum[];
};
/**
 * Deal without action
 */
export type DealDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deal
     */
    select?: Prisma.DealSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Deal
     */
    omit?: Prisma.DealOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DealInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Deal.d.ts.map