import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@portfolio/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, UserCheck, UserPlus, Users } from "lucide-react";

export const Route = createFileRoute("/crm")({
    component: CRMDashboard,
});

function CRMDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-bold text-3xl tracking-tight">CRM</h1>
                <p className="text-muted-foreground">Customer Relationship Management</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">-</div>
                        <p className="text-muted-foreground text-xs">Loading...</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">Active Leads</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">-</div>
                        <p className="text-muted-foreground text-xs">Loading...</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">Open Deals</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">-</div>
                        <p className="text-muted-foreground text-xs">Loading...</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">Converted</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">-</div>
                        <p className="text-muted-foreground text-xs">Loading...</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Customers
                        </CardTitle>
                        <CardDescription>Manage your customer database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={"/crm/customers" as string}>View Customers</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Leads
                        </CardTitle>
                        <CardDescription>Track potential customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={"/crm/leads" as string}>View Leads</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Deals
                        </CardTitle>
                        <CardDescription>Manage sales pipeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={"/crm/deals" as string}>View Deals</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
