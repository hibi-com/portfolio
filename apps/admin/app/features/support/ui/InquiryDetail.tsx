import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from "@portfolio/ui";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";
import type { InquiryPriority, InquiryResponse, InquiryStatus } from "~/shared/lib/support-api";
import { useInquiryDetail } from "../lib/useInquiries";

const statusColors: Record<InquiryStatus, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<InquiryPriority, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
};

interface ResponseItemProps {
    response: InquiryResponse;
}

const BASE_CARD_CLASS = "max-w-[70%] rounded-lg p-4";
const BORDER_INTERNAL = "border-2 border-dashed border-yellow-500";

function getResponseCardClass(isStaff: boolean, isInternal: boolean): string {
    if (isStaff && isInternal) {
        return `${BASE_CARD_CLASS} ${BORDER_INTERNAL} bg-primary text-primary-foreground`;
    }
    if (isStaff) {
        return `${BASE_CARD_CLASS} bg-primary text-primary-foreground`;
    }
    if (isInternal) {
        return `${BASE_CARD_CLASS} ${BORDER_INTERNAL} bg-muted`;
    }
    return `${BASE_CARD_CLASS} bg-muted`;
}

function ResponseItem({ response }: Readonly<ResponseItemProps>) {
    const isStaff = response.senderType === "STAFF";
    const wrapperClass = isStaff ? "flex justify-end" : "flex justify-start";
    const cardClass = getResponseCardClass(isStaff, response.isInternal);

    return (
        <div className={wrapperClass}>
            <div className={cardClass}>
                <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">{isStaff ? "Staff" : "Customer"}</span>
                    {response.isInternal && (
                        <Badge variant="outline" className="text-xs">
                            Internal
                        </Badge>
                    )}
                </div>
                <p className="text-sm">{response.message}</p>
                <p className="mt-2 flex items-center gap-1 text-xs opacity-70">
                    <Clock className="h-3 w-3" />
                    {new Date(response.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}

interface InquiryDetailProps {
    id?: string;
}

export function InquiryDetail({ id: propId }: InquiryDetailProps = {}) {
    const params = useParams({ strict: false });
    const inquiryId = propId || params.id || "";
    const { inquiry, loading, error, respond } = useInquiryDetail(inquiryId);
    const [message, setMessage] = useState("");
    const [isInternal, setIsInternal] = useState(false);
    const [sending, setSending] = useState(false);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading inquiry...</p>
            </div>
        );
    }

    if (error || !inquiry) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-600">Failed to load inquiry: {error?.message || "Not found"}</p>
            </div>
        );
    }

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            await respond({ message, isInternal });
            setMessage("");
            setIsInternal(false);
        } catch {
            // Error is handled in the hook
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/support/inquiries">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="font-bold text-2xl tracking-tight">{inquiry.subject}</h1>
                    <div className="mt-1 flex items-center gap-3">
                        <Badge className={statusColors[inquiry.status]} variant="secondary">
                            {inquiry.status}
                        </Badge>
                        <Badge className={priorityColors[inquiry.priority]} variant="secondary">
                            {inquiry.priority}
                        </Badge>
                        <span className="text-muted-foreground text-sm">
                            {inquiry.type?.replace("_", " ") ?? inquiry.category ?? "-"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Description</CardTitle>
                            <CardDescription>
                                Submitted on {new Date(inquiry.createdAt).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{inquiry.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MessageCircle className="h-5 w-5" />
                                Responses ({inquiry.responses.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {inquiry.responses.length === 0 ? (
                                <p className="text-center text-muted-foreground">No responses yet</p>
                            ) : (
                                inquiry.responses.map((response) => (
                                    <ResponseItem key={response.id} response={response} />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {inquiry.status !== "CLOSED" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Reply</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Type your response..."
                                    value={message}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isInternal}
                                            onChange={(e) => setIsInternal(e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Internal note (not visible to customer)</span>
                                    </label>
                                    <Button onClick={handleSend} disabled={sending || !message.trim()}>
                                        <Send className="mr-2 h-4 w-4" />
                                        {sending ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {inquiry.name && (
                                <div>
                                    <p className="font-medium text-sm">Name</p>
                                    <p className="text-muted-foreground text-sm">{inquiry.name}</p>
                                </div>
                            )}
                            {inquiry.email && (
                                <div>
                                    <p className="font-medium text-sm">Email</p>
                                    <p className="text-muted-foreground text-sm">{inquiry.email}</p>
                                </div>
                            )}
                            {inquiry.phone && (
                                <div>
                                    <p className="font-medium text-sm">Phone</p>
                                    <p className="text-muted-foreground text-sm">{inquiry.phone}</p>
                                </div>
                            )}
                            {inquiry.customer && (
                                <div>
                                    <p className="font-medium text-sm">Customer</p>
                                    <Link
                                        to={`/crm/customers/${inquiry.customer.id}` as Parameters<typeof Link>[0]["to"]}
                                        className="text-primary text-sm hover:underline"
                                    >
                                        {inquiry.customer.name}
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-medium text-sm">Created</p>
                                <p className="text-muted-foreground text-sm">
                                    {new Date(inquiry.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Updated</p>
                                <p className="text-muted-foreground text-sm">
                                    {new Date(inquiry.updatedAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-sm">ID</p>
                                <p className="font-mono text-muted-foreground text-xs">{inquiry.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
