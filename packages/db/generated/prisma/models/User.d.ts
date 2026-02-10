import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model User
 *
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    bio: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    bio: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    emailVerified: number;
    image: number;
    bio: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    bio?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    bio?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    emailVerified?: true;
    image?: true;
    bio?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    emailVerified?: Prisma.BoolFilter<"User"> | boolean;
    image?: Prisma.StringNullableFilter<"User"> | string | null;
    bio?: Prisma.StringNullableFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    sessions?: Prisma.SessionListRelationFilter;
    accounts?: Prisma.AccountListRelationFilter;
    experiences?: Prisma.UserExperienceListRelationFilter;
    socials?: Prisma.UserSocialListRelationFilter;
    contactHistories?: Prisma.ContactHistoryListRelationFilter;
    assignedInquiries?: Prisma.InquiryListRelationFilter;
    inquiryResponses?: Prisma.InquiryResponseListRelationFilter;
    chatParticipations?: Prisma.ChatParticipantListRelationFilter;
    freeeIntegrations?: Prisma.FreeeIntegrationListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    sessions?: Prisma.SessionOrderByRelationAggregateInput;
    accounts?: Prisma.AccountOrderByRelationAggregateInput;
    experiences?: Prisma.UserExperienceOrderByRelationAggregateInput;
    socials?: Prisma.UserSocialOrderByRelationAggregateInput;
    contactHistories?: Prisma.ContactHistoryOrderByRelationAggregateInput;
    assignedInquiries?: Prisma.InquiryOrderByRelationAggregateInput;
    inquiryResponses?: Prisma.InquiryResponseOrderByRelationAggregateInput;
    chatParticipations?: Prisma.ChatParticipantOrderByRelationAggregateInput;
    freeeIntegrations?: Prisma.FreeeIntegrationOrderByRelationAggregateInput;
    _relevance?: Prisma.UserOrderByRelevanceInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringFilter<"User"> | string;
    emailVerified?: Prisma.BoolFilter<"User"> | boolean;
    image?: Prisma.StringNullableFilter<"User"> | string | null;
    bio?: Prisma.StringNullableFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    sessions?: Prisma.SessionListRelationFilter;
    accounts?: Prisma.AccountListRelationFilter;
    experiences?: Prisma.UserExperienceListRelationFilter;
    socials?: Prisma.UserSocialListRelationFilter;
    contactHistories?: Prisma.ContactHistoryListRelationFilter;
    assignedInquiries?: Prisma.InquiryListRelationFilter;
    inquiryResponses?: Prisma.InquiryResponseListRelationFilter;
    chatParticipations?: Prisma.ChatParticipantListRelationFilter;
    freeeIntegrations?: Prisma.FreeeIntegrationListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    image?: Prisma.SortOrderInput | Prisma.SortOrder;
    bio?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    emailVerified?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    image?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    bio?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserOrderByRelevanceInput = {
    fields: Prisma.UserOrderByRelevanceFieldEnum | Prisma.UserOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    emailVerified?: Prisma.SortOrder;
    image?: Prisma.SortOrder;
    bio?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutSessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    upsert?: Prisma.UserUpsertWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput, Prisma.UserUpdateWithoutSessionsInput>, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserCreateNestedOneWithoutAccountsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAccountsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAccountsInput;
    upsert?: Prisma.UserUpsertWithoutAccountsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput, Prisma.UserUpdateWithoutAccountsInput>, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
};
export type UserCreateNestedOneWithoutChatParticipationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutChatParticipationsInput, Prisma.UserUncheckedCreateWithoutChatParticipationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutChatParticipationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutChatParticipationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutChatParticipationsInput, Prisma.UserUncheckedCreateWithoutChatParticipationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutChatParticipationsInput;
    upsert?: Prisma.UserUpsertWithoutChatParticipationsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutChatParticipationsInput, Prisma.UserUpdateWithoutChatParticipationsInput>, Prisma.UserUncheckedUpdateWithoutChatParticipationsInput>;
};
export type UserCreateNestedOneWithoutContactHistoriesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutContactHistoriesInput, Prisma.UserUncheckedCreateWithoutContactHistoriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutContactHistoriesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutContactHistoriesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutContactHistoriesInput, Prisma.UserUncheckedCreateWithoutContactHistoriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutContactHistoriesInput;
    upsert?: Prisma.UserUpsertWithoutContactHistoriesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutContactHistoriesInput, Prisma.UserUpdateWithoutContactHistoriesInput>, Prisma.UserUncheckedUpdateWithoutContactHistoriesInput>;
};
export type UserCreateNestedOneWithoutAssignedInquiriesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssignedInquiriesInput, Prisma.UserUncheckedCreateWithoutAssignedInquiriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssignedInquiriesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutAssignedInquiriesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssignedInquiriesInput, Prisma.UserUncheckedCreateWithoutAssignedInquiriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssignedInquiriesInput;
    upsert?: Prisma.UserUpsertWithoutAssignedInquiriesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAssignedInquiriesInput, Prisma.UserUpdateWithoutAssignedInquiriesInput>, Prisma.UserUncheckedUpdateWithoutAssignedInquiriesInput>;
};
export type UserCreateNestedOneWithoutInquiryResponsesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInquiryResponsesInput, Prisma.UserUncheckedCreateWithoutInquiryResponsesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInquiryResponsesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutInquiryResponsesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutInquiryResponsesInput, Prisma.UserUncheckedCreateWithoutInquiryResponsesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutInquiryResponsesInput;
    upsert?: Prisma.UserUpsertWithoutInquiryResponsesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutInquiryResponsesInput, Prisma.UserUpdateWithoutInquiryResponsesInput>, Prisma.UserUncheckedUpdateWithoutInquiryResponsesInput>;
};
export type UserCreateNestedOneWithoutFreeeIntegrationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedCreateWithoutFreeeIntegrationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFreeeIntegrationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutFreeeIntegrationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedCreateWithoutFreeeIntegrationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFreeeIntegrationsInput;
    upsert?: Prisma.UserUpsertWithoutFreeeIntegrationsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutFreeeIntegrationsInput, Prisma.UserUpdateWithoutFreeeIntegrationsInput>, Prisma.UserUncheckedUpdateWithoutFreeeIntegrationsInput>;
};
export type UserCreateNestedOneWithoutExperiencesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExperiencesInput, Prisma.UserUncheckedCreateWithoutExperiencesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExperiencesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutExperiencesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExperiencesInput, Prisma.UserUncheckedCreateWithoutExperiencesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExperiencesInput;
    upsert?: Prisma.UserUpsertWithoutExperiencesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutExperiencesInput, Prisma.UserUpdateWithoutExperiencesInput>, Prisma.UserUncheckedUpdateWithoutExperiencesInput>;
};
export type UserCreateNestedOneWithoutSocialsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSocialsInput, Prisma.UserUncheckedCreateWithoutSocialsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSocialsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSocialsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSocialsInput, Prisma.UserUncheckedCreateWithoutSocialsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSocialsInput;
    upsert?: Prisma.UserUpsertWithoutSocialsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSocialsInput, Prisma.UserUpdateWithoutSocialsInput>, Prisma.UserUncheckedUpdateWithoutSocialsInput>;
};
export type UserCreateWithoutSessionsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSessionsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
};
export type UserUpsertWithoutSessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutAccountsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutAccountsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutAccountsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
};
export type UserUpsertWithoutAccountsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAccountsInput, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAccountsInput, Prisma.UserUncheckedCreateWithoutAccountsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAccountsInput, Prisma.UserUncheckedUpdateWithoutAccountsInput>;
};
export type UserUpdateWithoutAccountsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutChatParticipationsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutChatParticipationsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutChatParticipationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutChatParticipationsInput, Prisma.UserUncheckedCreateWithoutChatParticipationsInput>;
};
export type UserUpsertWithoutChatParticipationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutChatParticipationsInput, Prisma.UserUncheckedUpdateWithoutChatParticipationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutChatParticipationsInput, Prisma.UserUncheckedCreateWithoutChatParticipationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutChatParticipationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutChatParticipationsInput, Prisma.UserUncheckedUpdateWithoutChatParticipationsInput>;
};
export type UserUpdateWithoutChatParticipationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutChatParticipationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutContactHistoriesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutContactHistoriesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutContactHistoriesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutContactHistoriesInput, Prisma.UserUncheckedCreateWithoutContactHistoriesInput>;
};
export type UserUpsertWithoutContactHistoriesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutContactHistoriesInput, Prisma.UserUncheckedUpdateWithoutContactHistoriesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutContactHistoriesInput, Prisma.UserUncheckedCreateWithoutContactHistoriesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutContactHistoriesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutContactHistoriesInput, Prisma.UserUncheckedUpdateWithoutContactHistoriesInput>;
};
export type UserUpdateWithoutContactHistoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutContactHistoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutAssignedInquiriesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutAssignedInquiriesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutAssignedInquiriesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssignedInquiriesInput, Prisma.UserUncheckedCreateWithoutAssignedInquiriesInput>;
};
export type UserUpsertWithoutAssignedInquiriesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAssignedInquiriesInput, Prisma.UserUncheckedUpdateWithoutAssignedInquiriesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssignedInquiriesInput, Prisma.UserUncheckedCreateWithoutAssignedInquiriesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAssignedInquiriesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAssignedInquiriesInput, Prisma.UserUncheckedUpdateWithoutAssignedInquiriesInput>;
};
export type UserUpdateWithoutAssignedInquiriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAssignedInquiriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutInquiryResponsesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutInquiryResponsesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutInquiryResponsesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutInquiryResponsesInput, Prisma.UserUncheckedCreateWithoutInquiryResponsesInput>;
};
export type UserUpsertWithoutInquiryResponsesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutInquiryResponsesInput, Prisma.UserUncheckedUpdateWithoutInquiryResponsesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutInquiryResponsesInput, Prisma.UserUncheckedCreateWithoutInquiryResponsesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutInquiryResponsesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutInquiryResponsesInput, Prisma.UserUncheckedUpdateWithoutInquiryResponsesInput>;
};
export type UserUpdateWithoutInquiryResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutInquiryResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutFreeeIntegrationsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutFreeeIntegrationsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutFreeeIntegrationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedCreateWithoutFreeeIntegrationsInput>;
};
export type UserUpsertWithoutFreeeIntegrationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedUpdateWithoutFreeeIntegrationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedCreateWithoutFreeeIntegrationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutFreeeIntegrationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutFreeeIntegrationsInput, Prisma.UserUncheckedUpdateWithoutFreeeIntegrationsInput>;
};
export type UserUpdateWithoutFreeeIntegrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutFreeeIntegrationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutExperiencesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutExperiencesInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    socials?: Prisma.UserSocialUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutExperiencesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutExperiencesInput, Prisma.UserUncheckedCreateWithoutExperiencesInput>;
};
export type UserUpsertWithoutExperiencesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutExperiencesInput, Prisma.UserUncheckedUpdateWithoutExperiencesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutExperiencesInput, Prisma.UserUncheckedCreateWithoutExperiencesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutExperiencesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutExperiencesInput, Prisma.UserUncheckedUpdateWithoutExperiencesInput>;
};
export type UserUpdateWithoutExperiencesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutExperiencesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    socials?: Prisma.UserSocialUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSocialsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSocialsInput = {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
    bio?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountUncheckedCreateNestedManyWithoutUserInput;
    experiences?: Prisma.UserExperienceUncheckedCreateNestedManyWithoutUserInput;
    contactHistories?: Prisma.ContactHistoryUncheckedCreateNestedManyWithoutUserInput;
    assignedInquiries?: Prisma.InquiryUncheckedCreateNestedManyWithoutAssigneeInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedCreateNestedManyWithoutUserInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedCreateNestedManyWithoutUserInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSocialsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSocialsInput, Prisma.UserUncheckedCreateWithoutSocialsInput>;
};
export type UserUpsertWithoutSocialsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSocialsInput, Prisma.UserUncheckedUpdateWithoutSocialsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSocialsInput, Prisma.UserUncheckedCreateWithoutSocialsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSocialsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSocialsInput, Prisma.UserUncheckedUpdateWithoutSocialsInput>;
};
export type UserUpdateWithoutSocialsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSocialsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    emailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    image?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    bio?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    accounts?: Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput;
    experiences?: Prisma.UserExperienceUncheckedUpdateManyWithoutUserNestedInput;
    contactHistories?: Prisma.ContactHistoryUncheckedUpdateManyWithoutUserNestedInput;
    assignedInquiries?: Prisma.InquiryUncheckedUpdateManyWithoutAssigneeNestedInput;
    inquiryResponses?: Prisma.InquiryResponseUncheckedUpdateManyWithoutUserNestedInput;
    chatParticipations?: Prisma.ChatParticipantUncheckedUpdateManyWithoutUserNestedInput;
    freeeIntegrations?: Prisma.FreeeIntegrationUncheckedUpdateManyWithoutUserNestedInput;
};
/**
 * Count Type UserCountOutputType
 */
export type UserCountOutputType = {
    sessions: number;
    accounts: number;
    experiences: number;
    socials: number;
    contactHistories: number;
    assignedInquiries: number;
    inquiryResponses: number;
    chatParticipations: number;
    freeeIntegrations: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs;
    experiences?: boolean | UserCountOutputTypeCountExperiencesArgs;
    socials?: boolean | UserCountOutputTypeCountSocialsArgs;
    contactHistories?: boolean | UserCountOutputTypeCountContactHistoriesArgs;
    assignedInquiries?: boolean | UserCountOutputTypeCountAssignedInquiriesArgs;
    inquiryResponses?: boolean | UserCountOutputTypeCountInquiryResponsesArgs;
    chatParticipations?: boolean | UserCountOutputTypeCountChatParticipationsArgs;
    freeeIntegrations?: boolean | UserCountOutputTypeCountFreeeIntegrationsArgs;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SessionWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AccountWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountExperiencesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserExperienceWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSocialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserSocialWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountContactHistoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContactHistoryWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountAssignedInquiriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountInquiryResponsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InquiryResponseWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountChatParticipationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatParticipantWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountFreeeIntegrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FreeeIntegrationWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    emailVerified?: boolean;
    image?: boolean;
    bio?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    accounts?: boolean | Prisma.User$accountsArgs<ExtArgs>;
    experiences?: boolean | Prisma.User$experiencesArgs<ExtArgs>;
    socials?: boolean | Prisma.User$socialsArgs<ExtArgs>;
    contactHistories?: boolean | Prisma.User$contactHistoriesArgs<ExtArgs>;
    assignedInquiries?: boolean | Prisma.User$assignedInquiriesArgs<ExtArgs>;
    inquiryResponses?: boolean | Prisma.User$inquiryResponsesArgs<ExtArgs>;
    chatParticipations?: boolean | Prisma.User$chatParticipationsArgs<ExtArgs>;
    freeeIntegrations?: boolean | Prisma.User$freeeIntegrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    emailVerified?: boolean;
    image?: boolean;
    bio?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "bio" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    accounts?: boolean | Prisma.User$accountsArgs<ExtArgs>;
    experiences?: boolean | Prisma.User$experiencesArgs<ExtArgs>;
    socials?: boolean | Prisma.User$socialsArgs<ExtArgs>;
    contactHistories?: boolean | Prisma.User$contactHistoriesArgs<ExtArgs>;
    assignedInquiries?: boolean | Prisma.User$assignedInquiriesArgs<ExtArgs>;
    inquiryResponses?: boolean | Prisma.User$inquiryResponsesArgs<ExtArgs>;
    chatParticipations?: boolean | Prisma.User$chatParticipationsArgs<ExtArgs>;
    freeeIntegrations?: boolean | Prisma.User$freeeIntegrationsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        sessions: Prisma.$SessionPayload<ExtArgs>[];
        accounts: Prisma.$AccountPayload<ExtArgs>[];
        experiences: Prisma.$UserExperiencePayload<ExtArgs>[];
        socials: Prisma.$UserSocialPayload<ExtArgs>[];
        contactHistories: Prisma.$ContactHistoryPayload<ExtArgs>[];
        assignedInquiries: Prisma.$InquiryPayload<ExtArgs>[];
        inquiryResponses: Prisma.$InquiryResponsePayload<ExtArgs>[];
        chatParticipations: Prisma.$ChatParticipantPayload<ExtArgs>[];
        freeeIntegrations: Prisma.$FreeeIntegrationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sessions<T extends Prisma.User$sessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    accounts<T extends Prisma.User$accountsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    experiences<T extends Prisma.User$experiencesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$experiencesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserExperiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    socials<T extends Prisma.User$socialsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$socialsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserSocialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    contactHistories<T extends Prisma.User$contactHistoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$contactHistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContactHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    assignedInquiries<T extends Prisma.User$assignedInquiriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$assignedInquiriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inquiryResponses<T extends Prisma.User$inquiryResponsesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$inquiryResponsesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InquiryResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    chatParticipations<T extends Prisma.User$chatParticipationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$chatParticipationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    freeeIntegrations<T extends Prisma.User$freeeIntegrationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$freeeIntegrationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FreeeIntegrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the User model
 */
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly emailVerified: Prisma.FieldRef<"User", 'Boolean'>;
    readonly image: Prisma.FieldRef<"User", 'String'>;
    readonly bio: Prisma.FieldRef<"User", 'String'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Users to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a User.
     */
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a User.
     */
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: Prisma.UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which User to delete.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
};
/**
 * User.sessions
 */
export type User$sessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: Prisma.SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: Prisma.SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionInclude<ExtArgs> | null;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput | Prisma.SessionOrderByWithRelationInput[];
    cursor?: Prisma.SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SessionScalarFieldEnum | Prisma.SessionScalarFieldEnum[];
};
/**
 * User.accounts
 */
export type User$accountsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: Prisma.AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: Prisma.AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AccountInclude<ExtArgs> | null;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput | Prisma.AccountOrderByWithRelationInput[];
    cursor?: Prisma.AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AccountScalarFieldEnum | Prisma.AccountScalarFieldEnum[];
};
/**
 * User.experiences
 */
export type User$experiencesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExperience
     */
    select?: Prisma.UserExperienceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserExperience
     */
    omit?: Prisma.UserExperienceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserExperienceInclude<ExtArgs> | null;
    where?: Prisma.UserExperienceWhereInput;
    orderBy?: Prisma.UserExperienceOrderByWithRelationInput | Prisma.UserExperienceOrderByWithRelationInput[];
    cursor?: Prisma.UserExperienceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserExperienceScalarFieldEnum | Prisma.UserExperienceScalarFieldEnum[];
};
/**
 * User.socials
 */
export type User$socialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSocial
     */
    select?: Prisma.UserSocialSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserSocial
     */
    omit?: Prisma.UserSocialOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserSocialInclude<ExtArgs> | null;
    where?: Prisma.UserSocialWhereInput;
    orderBy?: Prisma.UserSocialOrderByWithRelationInput | Prisma.UserSocialOrderByWithRelationInput[];
    cursor?: Prisma.UserSocialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserSocialScalarFieldEnum | Prisma.UserSocialScalarFieldEnum[];
};
/**
 * User.contactHistories
 */
export type User$contactHistoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.ContactHistoryWhereInput;
    orderBy?: Prisma.ContactHistoryOrderByWithRelationInput | Prisma.ContactHistoryOrderByWithRelationInput[];
    cursor?: Prisma.ContactHistoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContactHistoryScalarFieldEnum | Prisma.ContactHistoryScalarFieldEnum[];
};
/**
 * User.assignedInquiries
 */
export type User$assignedInquiriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inquiry
     */
    select?: Prisma.InquirySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Inquiry
     */
    omit?: Prisma.InquiryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InquiryInclude<ExtArgs> | null;
    where?: Prisma.InquiryWhereInput;
    orderBy?: Prisma.InquiryOrderByWithRelationInput | Prisma.InquiryOrderByWithRelationInput[];
    cursor?: Prisma.InquiryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InquiryScalarFieldEnum | Prisma.InquiryScalarFieldEnum[];
};
/**
 * User.inquiryResponses
 */
export type User$inquiryResponsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.InquiryResponseWhereInput;
    orderBy?: Prisma.InquiryResponseOrderByWithRelationInput | Prisma.InquiryResponseOrderByWithRelationInput[];
    cursor?: Prisma.InquiryResponseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InquiryResponseScalarFieldEnum | Prisma.InquiryResponseScalarFieldEnum[];
};
/**
 * User.chatParticipations
 */
export type User$chatParticipationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatParticipant
     */
    select?: Prisma.ChatParticipantSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatParticipant
     */
    omit?: Prisma.ChatParticipantOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatParticipantInclude<ExtArgs> | null;
    where?: Prisma.ChatParticipantWhereInput;
    orderBy?: Prisma.ChatParticipantOrderByWithRelationInput | Prisma.ChatParticipantOrderByWithRelationInput[];
    cursor?: Prisma.ChatParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatParticipantScalarFieldEnum | Prisma.ChatParticipantScalarFieldEnum[];
};
/**
 * User.freeeIntegrations
 */
export type User$freeeIntegrationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FreeeIntegration
     */
    select?: Prisma.FreeeIntegrationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FreeeIntegration
     */
    omit?: Prisma.FreeeIntegrationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FreeeIntegrationInclude<ExtArgs> | null;
    where?: Prisma.FreeeIntegrationWhereInput;
    orderBy?: Prisma.FreeeIntegrationOrderByWithRelationInput | Prisma.FreeeIntegrationOrderByWithRelationInput[];
    cursor?: Prisma.FreeeIntegrationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FreeeIntegrationScalarFieldEnum | Prisma.FreeeIntegrationScalarFieldEnum[];
};
/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=User.d.ts.map