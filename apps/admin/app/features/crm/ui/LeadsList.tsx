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
import { ArrowRight, Edit, Plus, Trash2, UserPlus } from "lucide-react";
import type { Lead } from "~/shared/lib/crm-api";
import { useLeads } from "../lib/useLeads";

const statusColors: Record<Lead["status"], string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    QUALIFIED: "bg-green-100 text-green-800",
    UNQUALIFIED: "bg-gray-100 text-gray-800",
    CONVERTED: "bg-purple-100 text-purple-800",
};

export function LeadsList() {
    const { leads, loading, error, deleteLead, convertLead } = useLeads();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading leads...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-600">Failed to load leads: {error.message}</p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await deleteLead(id);
            } catch {
                // Error is handled in the hook
            }
        }
    };

    const handleConvert = async (id: string) => {
        if (window.confirm("Convert this lead to a deal?")) {
            try {
                await convertLead(id);
            } catch {
                // Error is handled in the hook
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Track and manage potential customers</p>
                </div>
                <Button asChild>
                    <Link to={"/crm/leads/new" as string}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Lead
                    </Link>
                </Button>
            </div>

            {leads.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            No leads found
                        </CardTitle>
                        <CardDescription>Start by adding your first lead</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link to={"/crm/leads/new" as string}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Lead
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium">{lead.name}</TableCell>
                                        <TableCell>{lead.email || "-"}</TableCell>
                                        <TableCell>{lead.company || "-"}</TableCell>
                                        <TableCell>{lead.source || "-"}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[lead.status]} variant="secondary">
                                                {lead.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{lead.score ?? "-"}</TableCell>
                                        <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {lead.status !== "CONVERTED" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleConvert(lead.id)}
                                                        title="Convert to Deal"
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={`/crm/leads/${lead.id}/edit` as string}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(lead.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
