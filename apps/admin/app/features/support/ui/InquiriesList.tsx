import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@portfolio/ui";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Eye, Headphones, Plus } from "lucide-react";
import { useInquiries } from "../lib/useInquiries";

const statusColors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    WAITING_CUSTOMER: "bg-orange-100 text-orange-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
};

export function InquiriesList() {
    const { inquiries, loading, error, closeInquiry } = useInquiries();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading inquiries...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-600">Failed to load inquiries: {error.message}</p>
            </div>
        );
    }

    const handleClose = async (id: string) => {
        if (globalThis.confirm("Are you sure you want to close this inquiry?")) {
            try {
                await closeInquiry(id);
            } catch {
                // Error is handled in the hook
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">Support Inquiries</h1>
                    <p className="text-muted-foreground">Manage customer support tickets</p>
                </div>
                <Button asChild>
                    <Link to="/support/inquiries/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Inquiry
                    </Link>
                </Button>
            </div>

            {inquiries.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Headphones className="h-5 w-5" />
                            No inquiries found
                        </CardTitle>
                        <CardDescription>No support tickets have been submitted yet</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                to="/support/inquiries/$id"
                                                params={{ id: inquiry.id }}
                                                className="hover:underline"
                                            >
                                                {inquiry.subject}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{inquiry.type.replace("_", " ")}</TableCell>
                                        <TableCell>
                                            <Badge className={priorityColors[inquiry.priority]} variant="secondary">
                                                {inquiry.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[inquiry.status]} variant="secondary">
                                                {inquiry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{inquiry.name || inquiry.email || "-"}</TableCell>
                                        <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to="/support/inquiries/$id" params={{ id: inquiry.id }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {inquiry.status !== "CLOSED" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleClose(inquiry.id)}
                                                        title="Close Inquiry"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
