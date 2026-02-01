import { createFileRoute } from "@tanstack/react-router";
import { LeadsList } from "~/features/crm/ui/LeadsList";

export const Route = createFileRoute("/crm/leads")({
    component: LeadsList,
});
