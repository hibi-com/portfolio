export interface FreeePartnerRecord {
    id: number;
    company_id: number;
    name: string;
    code?: string;
    shortcut1?: string;
    shortcut2?: string;
    address_attributes?: FreeeAddressAttributes;
    contact_name?: string;
    email?: string;
    phone?: string;
}

export interface FreeeAddressAttributes {
    prefecture_code?: number;
    street_name1?: string;
    street_name2?: string;
    zipcode?: string;
}

export interface FreeePartnerCreateRequest {
    company_id: number;
    name: string;
    code?: string;
    email?: string;
    phone?: string;
}

export interface FreeePartnerUpdateRequest {
    company_id?: number;
    name?: string;
    code?: string;
    email?: string;
    phone?: string;
}

export interface FreeeTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    created_at: number;
}

export interface FreeeCompany {
    id: number;
    display_name: string;
    role: string;
}
