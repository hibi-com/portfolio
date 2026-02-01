import { createFileRoute } from "@tanstack/react-router";
import { InquiriesList } from "~/features/support";

export const Route = createFileRoute("/support/inquiries")({
    component: InquiriesList,
});
