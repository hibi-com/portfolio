import { createFileRoute } from "@tanstack/react-router";
import { CustomerForm } from "~/features/crm/ui/CustomerForm";

export const Route = createFileRoute("/crm/customers/new")({
    component: NewCustomerPage,
});

function NewCustomerPage() {
    return <CustomerForm mode="create" />;
}
