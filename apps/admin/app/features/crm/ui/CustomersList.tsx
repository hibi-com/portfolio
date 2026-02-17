import type { CustomerStatus } from "@portfolio/api";
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
import { Edit, Eye, Plus, Trash2, Users } from "lucide-react";
import { useCustomers } from "../lib/useCustomers";

const statusColors: Record<CustomerStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    PROSPECT: "bg-blue-100 text-blue-800",
    CHURNED: "bg-red-100 text-red-800",
};

export function CustomersList() {
    const { customers, loading, error, deleteCustomer } = useCustomers();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading customers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-600">Failed to load customers: {error.message}</p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (globalThis.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id);
            } catch {
                // Error is handled in the hook
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer relationships</p>
                </div>
                <Button asChild>
                    <Link to={"/crm/customers/new" as string}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Customer
                    </Link>
                </Button>
            </div>

            {customers.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            No customers found
                        </CardTitle>
                        <CardDescription>Get started by adding your first customer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link to={"/crm/customers/new" as string}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Customer
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
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((customer) => {
                                    const customerPath: string = `/crm/customers/${customer.id}`;
                                    const customerEditPath: string = `/crm/customers/${customer.id}/edit`;
                                    return (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.email || "-"}</TableCell>
                                        <TableCell>{customer.company || "-"}</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[customer.status]} variant="secondary">
                                                {customer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={customerPath}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link to={customerEditPath}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(customer.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
