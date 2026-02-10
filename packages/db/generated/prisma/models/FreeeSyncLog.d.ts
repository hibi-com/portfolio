import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model FreeeSyncLog
 *
 */
export type FreeeSyncLogModel = runtime.Types.Result.DefaultSelection<Prisma.$FreeeSyncLogPayload>;
export type AggregateFreeeSyncLog = {
    _count: FreeeSyncLogCountAggregateOutputType | null;
    _avg: FreeeSyncLogAvgAggregateOutputType | null;
    _sum: FreeeSyncLogSumAggregateOutputType | null;
    _min: FreeeSyncLogMinAggregateOutputType | null;
    _max: FreeeSyncLogMaxAggregateOutputType | null;
};
export type FreeeSyncLogAvgAggregateOutputType = {
    totalRecords: number | null;
    successCount: number | null;
    errorCount: number | null;
};
export type FreeeSyncLogSumAggregateOutputType = {
    totalRecords: number | null;
    successCount: number | null;
    errorCount: number | null;
};
export type FreeeSyncLogMinAggregateOutputType = {
    id: string | null;
    integrationId: string | null;
    direction: $Enums.SyncDirection | null;
    status: $Enums.SyncStatus | null;
    entityType: string | null;
    totalRecords: number | null;
    successCount: number | null;
    errorCount: number | null;
    errorDetails: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FreeeSyncLogMaxAggregateOutputType = {
    id: string | null;
    integrationId: string | null;
    direction: $Enums.SyncDirection | null;
    status: $Enums.SyncStatus | null;
    entityType: string | null;
    totalRecords: number | null;
    successCount: number | null;
    errorCount: number | null;
    errorDetails: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FreeeSyncLogCountAggregateOutputType = {
    id: number;
    integrationId: number;
    direction: number;
    status: number;
    entityType: number;
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errorDetails: number;
    startedAt: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type FreeeSyncLogAvgAggregateInputType = {
    totalRecords?: true;
    successCount?: true;
    errorCount?: true;
};
export type FreeeSyncLogSumAggregateInputType = {
    totalRecords?: true;
    successCount?: true;
    errorCount?: true;
};
export type FreeeSyncLogMinAggregateInputType = {
    id?: true;
    integrationId?: true;
    direction?: true;
    status?: true;
    entityType?: true;
    totalRecords?: true;
    successCount?: true;
    errorCount?: true;
    errorDetails?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FreeeSyncLogMaxAggregateInputType = {
    id?: true;
    integrationId?: true;
    direction?: true;
    status?: true;
    entityType?: true;
    totalRecords?: true;
    successCount?: true;
    errorCount?: true;
    errorDetails?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FreeeSyncLogCountAggregateInputType = {
    id?: true;
    integrationId?: true;
    direction?: true;
    status?: true;
    entityType?: true;
    totalRecords?: true;
    successCount?: true;
    errorCount?: true;
    errorDetails?: true;
    startedAt?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type FreeeSyncLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FreeeSyncLog to aggregate.
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FreeeSyncLogs to fetch.
     */
    orderBy?: Prisma.FreeeSyncLogOrderByWithRelationInput | Prisma.FreeeSyncLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.FreeeSyncLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FreeeSyncLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FreeeSyncLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FreeeSyncLogs
    **/
    _count?: true | FreeeSyncLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: FreeeSyncLogAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: FreeeSyncLogSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FreeeSyncLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FreeeSyncLogMaxAggregateInputType;
};
export type GetFreeeSyncLogAggregateType<T extends FreeeSyncLogAggregateArgs> = {
    [P in keyof T & keyof AggregateFreeeSyncLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFreeeSyncLog[P]> : Prisma.GetScalarType<T[P], AggregateFreeeSyncLog[P]>;
};
export type FreeeSyncLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FreeeSyncLogWhereInput;
    orderBy?: Prisma.FreeeSyncLogOrderByWithAggregationInput | Prisma.FreeeSyncLogOrderByWithAggregationInput[];
    by: Prisma.FreeeSyncLogScalarFieldEnum[] | Prisma.FreeeSyncLogScalarFieldEnum;
    having?: Prisma.FreeeSyncLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FreeeSyncLogCountAggregateInputType | true;
    _avg?: FreeeSyncLogAvgAggregateInputType;
    _sum?: FreeeSyncLogSumAggregateInputType;
    _min?: FreeeSyncLogMinAggregateInputType;
    _max?: FreeeSyncLogMaxAggregateInputType;
};
export type FreeeSyncLogGroupByOutputType = {
    id: string;
    integrationId: string;
    direction: $Enums.SyncDirection;
    status: $Enums.SyncStatus;
    entityType: string;
    totalRecords: number | null;
    successCount: number | null;
    errorCount: number | null;
    errorDetails: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: FreeeSyncLogCountAggregateOutputType | null;
    _avg: FreeeSyncLogAvgAggregateOutputType | null;
    _sum: FreeeSyncLogSumAggregateOutputType | null;
    _min: FreeeSyncLogMinAggregateOutputType | null;
    _max: FreeeSyncLogMaxAggregateOutputType | null;
};
type GetFreeeSyncLogGroupByPayload<T extends FreeeSyncLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FreeeSyncLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FreeeSyncLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FreeeSyncLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FreeeSyncLogGroupByOutputType[P]>;
}>>;
export type FreeeSyncLogWhereInput = {
    AND?: Prisma.FreeeSyncLogWhereInput | Prisma.FreeeSyncLogWhereInput[];
    OR?: Prisma.FreeeSyncLogWhereInput[];
    NOT?: Prisma.FreeeSyncLogWhereInput | Prisma.FreeeSyncLogWhereInput[];
    id?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    integrationId?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    direction?: Prisma.EnumSyncDirectionFilter<"FreeeSyncLog"> | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFilter<"FreeeSyncLog"> | $Enums.SyncStatus;
    entityType?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    totalRecords?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    successCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorDetails?: Prisma.StringNullableFilter<"FreeeSyncLog"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
    integration?: Prisma.XOR<Prisma.FreeeIntegrationScalarRelationFilter, Prisma.FreeeIntegrationWhereInput>;
};
export type FreeeSyncLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    integrationId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    totalRecords?: Prisma.SortOrderInput | Prisma.SortOrder;
    successCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorDetails?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    integration?: Prisma.FreeeIntegrationOrderByWithRelationInput;
    _relevance?: Prisma.FreeeSyncLogOrderByRelevanceInput;
};
export type FreeeSyncLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.FreeeSyncLogWhereInput | Prisma.FreeeSyncLogWhereInput[];
    OR?: Prisma.FreeeSyncLogWhereInput[];
    NOT?: Prisma.FreeeSyncLogWhereInput | Prisma.FreeeSyncLogWhereInput[];
    integrationId?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    direction?: Prisma.EnumSyncDirectionFilter<"FreeeSyncLog"> | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFilter<"FreeeSyncLog"> | $Enums.SyncStatus;
    entityType?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    totalRecords?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    successCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorDetails?: Prisma.StringNullableFilter<"FreeeSyncLog"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
    integration?: Prisma.XOR<Prisma.FreeeIntegrationScalarRelationFilter, Prisma.FreeeIntegrationWhereInput>;
}, "id">;
export type FreeeSyncLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    integrationId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    totalRecords?: Prisma.SortOrderInput | Prisma.SortOrder;
    successCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorCount?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorDetails?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.FreeeSyncLogCountOrderByAggregateInput;
    _avg?: Prisma.FreeeSyncLogAvgOrderByAggregateInput;
    _max?: Prisma.FreeeSyncLogMaxOrderByAggregateInput;
    _min?: Prisma.FreeeSyncLogMinOrderByAggregateInput;
    _sum?: Prisma.FreeeSyncLogSumOrderByAggregateInput;
};
export type FreeeSyncLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.FreeeSyncLogScalarWhereWithAggregatesInput | Prisma.FreeeSyncLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.FreeeSyncLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FreeeSyncLogScalarWhereWithAggregatesInput | Prisma.FreeeSyncLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FreeeSyncLog"> | string;
    integrationId?: Prisma.StringWithAggregatesFilter<"FreeeSyncLog"> | string;
    direction?: Prisma.EnumSyncDirectionWithAggregatesFilter<"FreeeSyncLog"> | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusWithAggregatesFilter<"FreeeSyncLog"> | $Enums.SyncStatus;
    entityType?: Prisma.StringWithAggregatesFilter<"FreeeSyncLog"> | string;
    totalRecords?: Prisma.IntNullableWithAggregatesFilter<"FreeeSyncLog"> | number | null;
    successCount?: Prisma.IntNullableWithAggregatesFilter<"FreeeSyncLog"> | number | null;
    errorCount?: Prisma.IntNullableWithAggregatesFilter<"FreeeSyncLog"> | number | null;
    errorDetails?: Prisma.StringNullableWithAggregatesFilter<"FreeeSyncLog"> | string | null;
    startedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"FreeeSyncLog"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"FreeeSyncLog"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FreeeSyncLog"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"FreeeSyncLog"> | Date | string;
};
export type FreeeSyncLogCreateInput = {
    id?: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    integration: Prisma.FreeeIntegrationCreateNestedOneWithoutSyncLogsInput;
};
export type FreeeSyncLogUncheckedCreateInput = {
    id?: string;
    integrationId: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FreeeSyncLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    integration?: Prisma.FreeeIntegrationUpdateOneRequiredWithoutSyncLogsNestedInput;
};
export type FreeeSyncLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    integrationId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogCreateManyInput = {
    id?: string;
    integrationId: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FreeeSyncLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    integrationId?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogListRelationFilter = {
    every?: Prisma.FreeeSyncLogWhereInput;
    some?: Prisma.FreeeSyncLogWhereInput;
    none?: Prisma.FreeeSyncLogWhereInput;
};
export type FreeeSyncLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FreeeSyncLogOrderByRelevanceInput = {
    fields: Prisma.FreeeSyncLogOrderByRelevanceFieldEnum | Prisma.FreeeSyncLogOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type FreeeSyncLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    integrationId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    totalRecords?: Prisma.SortOrder;
    successCount?: Prisma.SortOrder;
    errorCount?: Prisma.SortOrder;
    errorDetails?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FreeeSyncLogAvgOrderByAggregateInput = {
    totalRecords?: Prisma.SortOrder;
    successCount?: Prisma.SortOrder;
    errorCount?: Prisma.SortOrder;
};
export type FreeeSyncLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    integrationId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    totalRecords?: Prisma.SortOrder;
    successCount?: Prisma.SortOrder;
    errorCount?: Prisma.SortOrder;
    errorDetails?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FreeeSyncLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    integrationId?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    totalRecords?: Prisma.SortOrder;
    successCount?: Prisma.SortOrder;
    errorCount?: Prisma.SortOrder;
    errorDetails?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FreeeSyncLogSumOrderByAggregateInput = {
    totalRecords?: Prisma.SortOrder;
    successCount?: Prisma.SortOrder;
    errorCount?: Prisma.SortOrder;
};
export type FreeeSyncLogCreateNestedManyWithoutIntegrationInput = {
    create?: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput> | Prisma.FreeeSyncLogCreateWithoutIntegrationInput[] | Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput[];
    connectOrCreate?: Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput | Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput[];
    createMany?: Prisma.FreeeSyncLogCreateManyIntegrationInputEnvelope;
    connect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
};
export type FreeeSyncLogUncheckedCreateNestedManyWithoutIntegrationInput = {
    create?: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput> | Prisma.FreeeSyncLogCreateWithoutIntegrationInput[] | Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput[];
    connectOrCreate?: Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput | Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput[];
    createMany?: Prisma.FreeeSyncLogCreateManyIntegrationInputEnvelope;
    connect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
};
export type FreeeSyncLogUpdateManyWithoutIntegrationNestedInput = {
    create?: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput> | Prisma.FreeeSyncLogCreateWithoutIntegrationInput[] | Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput[];
    connectOrCreate?: Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput | Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput[];
    upsert?: Prisma.FreeeSyncLogUpsertWithWhereUniqueWithoutIntegrationInput | Prisma.FreeeSyncLogUpsertWithWhereUniqueWithoutIntegrationInput[];
    createMany?: Prisma.FreeeSyncLogCreateManyIntegrationInputEnvelope;
    set?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    disconnect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    delete?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    connect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    update?: Prisma.FreeeSyncLogUpdateWithWhereUniqueWithoutIntegrationInput | Prisma.FreeeSyncLogUpdateWithWhereUniqueWithoutIntegrationInput[];
    updateMany?: Prisma.FreeeSyncLogUpdateManyWithWhereWithoutIntegrationInput | Prisma.FreeeSyncLogUpdateManyWithWhereWithoutIntegrationInput[];
    deleteMany?: Prisma.FreeeSyncLogScalarWhereInput | Prisma.FreeeSyncLogScalarWhereInput[];
};
export type FreeeSyncLogUncheckedUpdateManyWithoutIntegrationNestedInput = {
    create?: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput> | Prisma.FreeeSyncLogCreateWithoutIntegrationInput[] | Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput[];
    connectOrCreate?: Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput | Prisma.FreeeSyncLogCreateOrConnectWithoutIntegrationInput[];
    upsert?: Prisma.FreeeSyncLogUpsertWithWhereUniqueWithoutIntegrationInput | Prisma.FreeeSyncLogUpsertWithWhereUniqueWithoutIntegrationInput[];
    createMany?: Prisma.FreeeSyncLogCreateManyIntegrationInputEnvelope;
    set?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    disconnect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    delete?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    connect?: Prisma.FreeeSyncLogWhereUniqueInput | Prisma.FreeeSyncLogWhereUniqueInput[];
    update?: Prisma.FreeeSyncLogUpdateWithWhereUniqueWithoutIntegrationInput | Prisma.FreeeSyncLogUpdateWithWhereUniqueWithoutIntegrationInput[];
    updateMany?: Prisma.FreeeSyncLogUpdateManyWithWhereWithoutIntegrationInput | Prisma.FreeeSyncLogUpdateManyWithWhereWithoutIntegrationInput[];
    deleteMany?: Prisma.FreeeSyncLogScalarWhereInput | Prisma.FreeeSyncLogScalarWhereInput[];
};
export type EnumSyncDirectionFieldUpdateOperationsInput = {
    set?: $Enums.SyncDirection;
};
export type EnumSyncStatusFieldUpdateOperationsInput = {
    set?: $Enums.SyncStatus;
};
export type FreeeSyncLogCreateWithoutIntegrationInput = {
    id?: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FreeeSyncLogUncheckedCreateWithoutIntegrationInput = {
    id?: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FreeeSyncLogCreateOrConnectWithoutIntegrationInput = {
    where: Prisma.FreeeSyncLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput>;
};
export type FreeeSyncLogCreateManyIntegrationInputEnvelope = {
    data: Prisma.FreeeSyncLogCreateManyIntegrationInput | Prisma.FreeeSyncLogCreateManyIntegrationInput[];
    skipDuplicates?: boolean;
};
export type FreeeSyncLogUpsertWithWhereUniqueWithoutIntegrationInput = {
    where: Prisma.FreeeSyncLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.FreeeSyncLogUpdateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedUpdateWithoutIntegrationInput>;
    create: Prisma.XOR<Prisma.FreeeSyncLogCreateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedCreateWithoutIntegrationInput>;
};
export type FreeeSyncLogUpdateWithWhereUniqueWithoutIntegrationInput = {
    where: Prisma.FreeeSyncLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.FreeeSyncLogUpdateWithoutIntegrationInput, Prisma.FreeeSyncLogUncheckedUpdateWithoutIntegrationInput>;
};
export type FreeeSyncLogUpdateManyWithWhereWithoutIntegrationInput = {
    where: Prisma.FreeeSyncLogScalarWhereInput;
    data: Prisma.XOR<Prisma.FreeeSyncLogUpdateManyMutationInput, Prisma.FreeeSyncLogUncheckedUpdateManyWithoutIntegrationInput>;
};
export type FreeeSyncLogScalarWhereInput = {
    AND?: Prisma.FreeeSyncLogScalarWhereInput | Prisma.FreeeSyncLogScalarWhereInput[];
    OR?: Prisma.FreeeSyncLogScalarWhereInput[];
    NOT?: Prisma.FreeeSyncLogScalarWhereInput | Prisma.FreeeSyncLogScalarWhereInput[];
    id?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    integrationId?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    direction?: Prisma.EnumSyncDirectionFilter<"FreeeSyncLog"> | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFilter<"FreeeSyncLog"> | $Enums.SyncStatus;
    entityType?: Prisma.StringFilter<"FreeeSyncLog"> | string;
    totalRecords?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    successCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorCount?: Prisma.IntNullableFilter<"FreeeSyncLog"> | number | null;
    errorDetails?: Prisma.StringNullableFilter<"FreeeSyncLog"> | string | null;
    startedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"FreeeSyncLog"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FreeeSyncLog"> | Date | string;
};
export type FreeeSyncLogCreateManyIntegrationInput = {
    id?: string;
    direction: $Enums.SyncDirection;
    status?: $Enums.SyncStatus;
    entityType: string;
    totalRecords?: number | null;
    successCount?: number | null;
    errorCount?: number | null;
    errorDetails?: string | null;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FreeeSyncLogUpdateWithoutIntegrationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogUncheckedUpdateWithoutIntegrationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogUncheckedUpdateManyWithoutIntegrationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.EnumSyncDirectionFieldUpdateOperationsInput | $Enums.SyncDirection;
    status?: Prisma.EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    totalRecords?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    successCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorCount?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    errorDetails?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FreeeSyncLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    integrationId?: boolean;
    direction?: boolean;
    status?: boolean;
    entityType?: boolean;
    totalRecords?: boolean;
    successCount?: boolean;
    errorCount?: boolean;
    errorDetails?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    integration?: boolean | Prisma.FreeeIntegrationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["freeeSyncLog"]>;
export type FreeeSyncLogSelectScalar = {
    id?: boolean;
    integrationId?: boolean;
    direction?: boolean;
    status?: boolean;
    entityType?: boolean;
    totalRecords?: boolean;
    successCount?: boolean;
    errorCount?: boolean;
    errorDetails?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type FreeeSyncLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "integrationId" | "direction" | "status" | "entityType" | "totalRecords" | "successCount" | "errorCount" | "errorDetails" | "startedAt" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["freeeSyncLog"]>;
export type FreeeSyncLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    integration?: boolean | Prisma.FreeeIntegrationDefaultArgs<ExtArgs>;
};
export type $FreeeSyncLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FreeeSyncLog";
    objects: {
        integration: Prisma.$FreeeIntegrationPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        integrationId: string;
        direction: $Enums.SyncDirection;
        status: $Enums.SyncStatus;
        entityType: string;
        totalRecords: number | null;
        successCount: number | null;
        errorCount: number | null;
        errorDetails: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["freeeSyncLog"]>;
    composites: {};
};
export type FreeeSyncLogGetPayload<S extends boolean | null | undefined | FreeeSyncLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload, S>;
export type FreeeSyncLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FreeeSyncLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FreeeSyncLogCountAggregateInputType | true;
};
export interface FreeeSyncLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FreeeSyncLog'];
        meta: {
            name: 'FreeeSyncLog';
        };
    };
    /**
     * Find zero or one FreeeSyncLog that matches the filter.
     * @param {FreeeSyncLogFindUniqueArgs} args - Arguments to find a FreeeSyncLog
     * @example
     * // Get one FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FreeeSyncLogFindUniqueArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one FreeeSyncLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FreeeSyncLogFindUniqueOrThrowArgs} args - Arguments to find a FreeeSyncLog
     * @example
     * // Get one FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FreeeSyncLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FreeeSyncLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogFindFirstArgs} args - Arguments to find a FreeeSyncLog
     * @example
     * // Get one FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FreeeSyncLogFindFirstArgs>(args?: Prisma.SelectSubset<T, FreeeSyncLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FreeeSyncLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogFindFirstOrThrowArgs} args - Arguments to find a FreeeSyncLog
     * @example
     * // Get one FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FreeeSyncLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FreeeSyncLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more FreeeSyncLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FreeeSyncLogs
     * const freeeSyncLogs = await prisma.freeeSyncLog.findMany()
     *
     * // Get first 10 FreeeSyncLogs
     * const freeeSyncLogs = await prisma.freeeSyncLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const freeeSyncLogWithIdOnly = await prisma.freeeSyncLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FreeeSyncLogFindManyArgs>(args?: Prisma.SelectSubset<T, FreeeSyncLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a FreeeSyncLog.
     * @param {FreeeSyncLogCreateArgs} args - Arguments to create a FreeeSyncLog.
     * @example
     * // Create one FreeeSyncLog
     * const FreeeSyncLog = await prisma.freeeSyncLog.create({
     *   data: {
     *     // ... data to create a FreeeSyncLog
     *   }
     * })
     *
     */
    create<T extends FreeeSyncLogCreateArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogCreateArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many FreeeSyncLogs.
     * @param {FreeeSyncLogCreateManyArgs} args - Arguments to create many FreeeSyncLogs.
     * @example
     * // Create many FreeeSyncLogs
     * const freeeSyncLog = await prisma.freeeSyncLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FreeeSyncLogCreateManyArgs>(args?: Prisma.SelectSubset<T, FreeeSyncLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a FreeeSyncLog.
     * @param {FreeeSyncLogDeleteArgs} args - Arguments to delete one FreeeSyncLog.
     * @example
     * // Delete one FreeeSyncLog
     * const FreeeSyncLog = await prisma.freeeSyncLog.delete({
     *   where: {
     *     // ... filter to delete one FreeeSyncLog
     *   }
     * })
     *
     */
    delete<T extends FreeeSyncLogDeleteArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogDeleteArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one FreeeSyncLog.
     * @param {FreeeSyncLogUpdateArgs} args - Arguments to update one FreeeSyncLog.
     * @example
     * // Update one FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FreeeSyncLogUpdateArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogUpdateArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more FreeeSyncLogs.
     * @param {FreeeSyncLogDeleteManyArgs} args - Arguments to filter FreeeSyncLogs to delete.
     * @example
     * // Delete a few FreeeSyncLogs
     * const { count } = await prisma.freeeSyncLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FreeeSyncLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, FreeeSyncLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FreeeSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FreeeSyncLogs
     * const freeeSyncLog = await prisma.freeeSyncLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FreeeSyncLogUpdateManyArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one FreeeSyncLog.
     * @param {FreeeSyncLogUpsertArgs} args - Arguments to update or create a FreeeSyncLog.
     * @example
     * // Update or create a FreeeSyncLog
     * const freeeSyncLog = await prisma.freeeSyncLog.upsert({
     *   create: {
     *     // ... data to create a FreeeSyncLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FreeeSyncLog we want to update
     *   }
     * })
     */
    upsert<T extends FreeeSyncLogUpsertArgs>(args: Prisma.SelectSubset<T, FreeeSyncLogUpsertArgs<ExtArgs>>): Prisma.Prisma__FreeeSyncLogClient<runtime.Types.Result.GetResult<Prisma.$FreeeSyncLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of FreeeSyncLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogCountArgs} args - Arguments to filter FreeeSyncLogs to count.
     * @example
     * // Count the number of FreeeSyncLogs
     * const count = await prisma.freeeSyncLog.count({
     *   where: {
     *     // ... the filter for the FreeeSyncLogs we want to count
     *   }
     * })
    **/
    count<T extends FreeeSyncLogCountArgs>(args?: Prisma.Subset<T, FreeeSyncLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FreeeSyncLogCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a FreeeSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FreeeSyncLogAggregateArgs>(args: Prisma.Subset<T, FreeeSyncLogAggregateArgs>): Prisma.PrismaPromise<GetFreeeSyncLogAggregateType<T>>;
    /**
     * Group by FreeeSyncLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FreeeSyncLogGroupByArgs} args - Group by arguments.
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
    groupBy<T extends FreeeSyncLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FreeeSyncLogGroupByArgs['orderBy'];
    } : {
        orderBy?: FreeeSyncLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FreeeSyncLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFreeeSyncLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FreeeSyncLog model
     */
    readonly fields: FreeeSyncLogFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for FreeeSyncLog.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__FreeeSyncLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    integration<T extends Prisma.FreeeIntegrationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FreeeIntegrationDefaultArgs<ExtArgs>>): Prisma.Prisma__FreeeIntegrationClient<runtime.Types.Result.GetResult<Prisma.$FreeeIntegrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the FreeeSyncLog model
 */
export interface FreeeSyncLogFieldRefs {
    readonly id: Prisma.FieldRef<"FreeeSyncLog", 'String'>;
    readonly integrationId: Prisma.FieldRef<"FreeeSyncLog", 'String'>;
    readonly direction: Prisma.FieldRef<"FreeeSyncLog", 'SyncDirection'>;
    readonly status: Prisma.FieldRef<"FreeeSyncLog", 'SyncStatus'>;
    readonly entityType: Prisma.FieldRef<"FreeeSyncLog", 'String'>;
    readonly totalRecords: Prisma.FieldRef<"FreeeSyncLog", 'Int'>;
    readonly successCount: Prisma.FieldRef<"FreeeSyncLog", 'Int'>;
    readonly errorCount: Prisma.FieldRef<"FreeeSyncLog", 'Int'>;
    readonly errorDetails: Prisma.FieldRef<"FreeeSyncLog", 'String'>;
    readonly startedAt: Prisma.FieldRef<"FreeeSyncLog", 'DateTime'>;
    readonly completedAt: Prisma.FieldRef<"FreeeSyncLog", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"FreeeSyncLog", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"FreeeSyncLog", 'DateTime'>;
}
/**
 * FreeeSyncLog findUnique
 */
export type FreeeSyncLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter, which FreeeSyncLog to fetch.
     */
    where: Prisma.FreeeSyncLogWhereUniqueInput;
};
/**
 * FreeeSyncLog findUniqueOrThrow
 */
export type FreeeSyncLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter, which FreeeSyncLog to fetch.
     */
    where: Prisma.FreeeSyncLogWhereUniqueInput;
};
/**
 * FreeeSyncLog findFirst
 */
export type FreeeSyncLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter, which FreeeSyncLog to fetch.
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FreeeSyncLogs to fetch.
     */
    orderBy?: Prisma.FreeeSyncLogOrderByWithRelationInput | Prisma.FreeeSyncLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FreeeSyncLogs.
     */
    cursor?: Prisma.FreeeSyncLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FreeeSyncLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FreeeSyncLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FreeeSyncLogs.
     */
    distinct?: Prisma.FreeeSyncLogScalarFieldEnum | Prisma.FreeeSyncLogScalarFieldEnum[];
};
/**
 * FreeeSyncLog findFirstOrThrow
 */
export type FreeeSyncLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter, which FreeeSyncLog to fetch.
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FreeeSyncLogs to fetch.
     */
    orderBy?: Prisma.FreeeSyncLogOrderByWithRelationInput | Prisma.FreeeSyncLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FreeeSyncLogs.
     */
    cursor?: Prisma.FreeeSyncLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FreeeSyncLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FreeeSyncLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FreeeSyncLogs.
     */
    distinct?: Prisma.FreeeSyncLogScalarFieldEnum | Prisma.FreeeSyncLogScalarFieldEnum[];
};
/**
 * FreeeSyncLog findMany
 */
export type FreeeSyncLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter, which FreeeSyncLogs to fetch.
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FreeeSyncLogs to fetch.
     */
    orderBy?: Prisma.FreeeSyncLogOrderByWithRelationInput | Prisma.FreeeSyncLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FreeeSyncLogs.
     */
    cursor?: Prisma.FreeeSyncLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FreeeSyncLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FreeeSyncLogs.
     */
    skip?: number;
    distinct?: Prisma.FreeeSyncLogScalarFieldEnum | Prisma.FreeeSyncLogScalarFieldEnum[];
};
/**
 * FreeeSyncLog create
 */
export type FreeeSyncLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * The data needed to create a FreeeSyncLog.
     */
    data: Prisma.XOR<Prisma.FreeeSyncLogCreateInput, Prisma.FreeeSyncLogUncheckedCreateInput>;
};
/**
 * FreeeSyncLog createMany
 */
export type FreeeSyncLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many FreeeSyncLogs.
     */
    data: Prisma.FreeeSyncLogCreateManyInput | Prisma.FreeeSyncLogCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * FreeeSyncLog update
 */
export type FreeeSyncLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * The data needed to update a FreeeSyncLog.
     */
    data: Prisma.XOR<Prisma.FreeeSyncLogUpdateInput, Prisma.FreeeSyncLogUncheckedUpdateInput>;
    /**
     * Choose, which FreeeSyncLog to update.
     */
    where: Prisma.FreeeSyncLogWhereUniqueInput;
};
/**
 * FreeeSyncLog updateMany
 */
export type FreeeSyncLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update FreeeSyncLogs.
     */
    data: Prisma.XOR<Prisma.FreeeSyncLogUpdateManyMutationInput, Prisma.FreeeSyncLogUncheckedUpdateManyInput>;
    /**
     * Filter which FreeeSyncLogs to update
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * Limit how many FreeeSyncLogs to update.
     */
    limit?: number;
};
/**
 * FreeeSyncLog upsert
 */
export type FreeeSyncLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * The filter to search for the FreeeSyncLog to update in case it exists.
     */
    where: Prisma.FreeeSyncLogWhereUniqueInput;
    /**
     * In case the FreeeSyncLog found by the `where` argument doesn't exist, create a new FreeeSyncLog with this data.
     */
    create: Prisma.XOR<Prisma.FreeeSyncLogCreateInput, Prisma.FreeeSyncLogUncheckedCreateInput>;
    /**
     * In case the FreeeSyncLog was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.FreeeSyncLogUpdateInput, Prisma.FreeeSyncLogUncheckedUpdateInput>;
};
/**
 * FreeeSyncLog delete
 */
export type FreeeSyncLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
    /**
     * Filter which FreeeSyncLog to delete.
     */
    where: Prisma.FreeeSyncLogWhereUniqueInput;
};
/**
 * FreeeSyncLog deleteMany
 */
export type FreeeSyncLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FreeeSyncLogs to delete
     */
    where?: Prisma.FreeeSyncLogWhereInput;
    /**
     * Limit how many FreeeSyncLogs to delete.
     */
    limit?: number;
};
/**
 * FreeeSyncLog without action
 */
export type FreeeSyncLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeSyncLog
     */
    select?: Prisma.FreeeSyncLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeSyncLog
     */
    omit?: Prisma.FreeeSyncLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeSyncLogInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=FreeeSyncLog.d.ts.map