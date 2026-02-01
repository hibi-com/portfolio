import { createFileRoute } from "@tanstack/react-router";
import { DealsKanban } from "~/features/crm/ui/DealsKanban";

export const Route = createFileRoute("/crm/deals")({
    component: DealsKanban,
});
