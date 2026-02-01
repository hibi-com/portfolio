import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@portfolio/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Headphones, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/support")({
    component: SupportDashboard,
});

function SupportDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-bold text-3xl tracking-tight">Support</h1>
                <p className="text-muted-foreground">Customer Support Management</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Headphones className="h-5 w-5" />
                            Inquiries
                        </CardTitle>
                        <CardDescription>Manage support tickets and inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={"/support/inquiries" as string}>View Inquiries</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Live Chat
                        </CardTitle>
                        <CardDescription>Real-time chat with customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link to={"/chat" as string}>Open Chat</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
