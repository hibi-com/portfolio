import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/support/inquiries/new")({
	component: NewInquiryPage,
});

function NewInquiryPage() {
	return (
		<div className="p-6">
			<h1 className="font-bold text-3xl tracking-tight">New Inquiry</h1>
			<p className="text-muted-foreground">Create inquiry form (placeholder).</p>
		</div>
	);
}
