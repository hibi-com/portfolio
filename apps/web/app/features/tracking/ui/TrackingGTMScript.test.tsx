import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import type { TrackingGTMScriptProps } from "../model/types";
import { TrackingGTMScript } from "./TrackingGTMScript";

describe("TrackingGTMScript Component", () => {
    let props: TrackingGTMScriptProps;

    beforeEach(() => {
        props = {
            id: "GTM-123456789",
        };
    });

    test("should render script tag", () => {
        const { container } = render(<TrackingGTMScript {...props} />);

        const scripts = container.querySelectorAll("script");
        expect(scripts.length).toBeGreaterThan(0);
    });

    test("should include GTM ID in script content", () => {
        const { container } = render(<TrackingGTMScript {...props} />);

        const scripts = container.querySelectorAll("script");
        const scriptContent = Array.from(scripts)
            .map((script) => script.innerHTML)
            .join(" ");
        expect(scriptContent).toContain(props.id);
    });

    test("should render script with type text/javascript", () => {
        const { container } = render(<TrackingGTMScript {...props} />);

        const script = container.querySelector("script");
        expect(script).toHaveAttribute("type", "text/javascript");
    });

    test("should include dataLayer initialization in script", () => {
        const { container } = render(<TrackingGTMScript {...props} />);

        const script = container.querySelector("script");
        expect(script?.innerHTML).toContain("dataLayer");
        expect(script?.innerHTML).toContain("gtm.js");
    });
});
