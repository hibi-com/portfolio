import { AppError, ErrorCodes } from "@portfolio/log";
import { useCallback, useEffect, useState } from "react";
import { getLogger } from "~/lib/logger";
import {
    type Inquiry,
    type InquiryDetail,
    type InquiryFormData,
    type InquiryResponse,
    type InquiryResponseFormData,
    supportApi,
} from "~/shared/lib/support-api";

export function useInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await supportApi.inquiries.list();
            setInquiries(data);
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch inquiries", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/support/inquiries" });
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [logger]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const createInquiry = async (data: InquiryFormData): Promise<Inquiry | null> => {
        try {
            const inquiry = await supportApi.inquiries.create(data);
            setInquiries((prev) => [inquiry, ...prev]);
            return inquiry;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to create inquiry", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/support/inquiries" });
            throw err;
        }
    };

    const updateInquiry = async (id: string, data: Partial<InquiryFormData>): Promise<Inquiry | null> => {
        try {
            const inquiry = await supportApi.inquiries.update(id, data);
            setInquiries((prev) => prev.map((i) => (i.id === id ? inquiry : i)));
            return inquiry;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to update inquiry", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/support/inquiries/${id}` });
            throw err;
        }
    };

    const closeInquiry = async (id: string): Promise<void> => {
        try {
            const inquiry = await supportApi.inquiries.close(id);
            setInquiries((prev) => prev.map((i) => (i.id === id ? inquiry : i)));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to close inquiry", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/support/inquiries/${id}/close` });
            throw err;
        }
    };

    return {
        inquiries,
        loading,
        error,
        refetch: fetchInquiries,
        createInquiry,
        updateInquiry,
        closeInquiry,
    };
}

export function useInquiryDetail(id: string) {
    const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    const fetchInquiry = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await supportApi.inquiries.getById(id);
            setInquiry(data);
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch inquiry", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/support/inquiries/${id}` });
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [id, logger]);

    useEffect(() => {
        fetchInquiry();
    }, [fetchInquiry]);

    const respond = async (data: InquiryResponseFormData): Promise<InquiryResponse | null> => {
        try {
            const response = await supportApi.inquiries.respond(id, data);
            setInquiry((prev) => (prev ? { ...prev, responses: [...prev.responses, response] } : prev));
            return response;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to respond to inquiry", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/support/inquiries/${id}/respond` });
            throw err;
        }
    };

    return {
        inquiry,
        loading,
        error,
        refetch: fetchInquiry,
        respond,
    };
}
