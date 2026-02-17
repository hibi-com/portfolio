import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from "@portfolio/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import type { Customer, CustomerFormData, CustomerStatus } from "~/entities/customer";
import { useCustomers } from "../lib/useCustomers";

interface CustomerFormProps {
    customer?: Customer;
    mode: "create" | "edit";
}

const statusOptions: { value: CustomerStatus; label: string }[] = [
    { value: "PROSPECT", label: "Prospect" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "CHURNED", label: "Churned" },
];

function getInitialFormData(customer?: Customer): CustomerFormData {
    return {
        name: customer?.name ?? "",
        email: customer?.email ?? "",
        phone: customer?.phone ?? "",
        company: customer?.company ?? "",
        website: customer?.website ?? "",
        address: customer?.address ?? "",
        notes: customer?.notes ?? "",
        status: customer?.status ?? "PROSPECT",
        tags: customer?.tags ?? [],
    };
}

function getSubmitButtonLabel(loading: boolean, mode: "create" | "edit"): string {
    if (loading) return "Saving...";
    if (mode === "create") return "Create Customer";
    return "Save Changes";
}

export function CustomerForm({ customer, mode }: Readonly<CustomerFormProps>) {
    const navigate = useNavigate();
    const { createCustomer, updateCustomer } = useCustomers();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CustomerFormData>(() => getInitialFormData(customer));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "create") {
                await createCustomer(formData);
            } else if (customer) {
                await updateCustomer(customer.id, formData);
            }
            navigate({ to: "/crm/customers" as string });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CustomerFormData, value: CustomerFormData[keyof CustomerFormData]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to={"/crm/customers" as string}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">
                        {mode === "create" ? "New Customer" : "Edit Customer"}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === "create" ? "Add a new customer to your CRM" : "Update customer information"}
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-600">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                        <CardDescription>Enter the customer details below</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("name", e.target.value)
                                    }
                                    placeholder="Customer name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("email", e.target.value)
                                    }
                                    placeholder="customer@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("phone", e.target.value)
                                    }
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={formData.company || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("company", e.target.value)
                                    }
                                    placeholder="Company name"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("website", e.target.value)
                                    }
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: CustomerStatus) => handleChange("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange("address", e.target.value)
                                }
                                placeholder="Street address, city, country"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes || ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleChange("notes", e.target.value)
                                }
                                placeholder="Additional notes about this customer..."
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" asChild>
                                <Link to={"/crm/customers" as string}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {getSubmitButtonLabel(loading, mode)}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
