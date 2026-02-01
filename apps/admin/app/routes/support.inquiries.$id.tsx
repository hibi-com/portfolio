import { createFileRoute } from "@tanstack/react-router";
import { InquiryDetail } from "~/features/support";

export const Route = createFileRoute("/support/inquiries/$id")({
    component: InquiryDetail,
});
