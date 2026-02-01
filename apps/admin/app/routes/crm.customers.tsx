import { createFileRoute } from "@tanstack/react-router";
import { CustomersList } from "~/features/crm";

export const Route = createFileRoute("/crm/customers")({
    component: CustomersList,
});
