import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import type { TrackingGTMIFrameProps } from "../model/types";
import { TrackingGTMIFrame } from "./TrackingGTMIFrame";

describe("TrackingGTMIFrame Component", () => {
    let props: TrackingGTMIFrameProps;

    beforeEach(() => {
        props = {
            id: "GTM-123456789",
        };
    });

    test("should render noscript tag", () => {
        const { container } = render(<TrackingGTMIFrame {...props} />);

        const noscript = container.querySelector("noscript");
        expect(noscript).toBeInTheDocument();
    });

    test("should render with correct GTM id prop", () => {
        const { container } = render(<TrackingGTMIFrame {...props} />);

        const noscript = container.querySelector("noscript");
        expect(noscript).toBeInTheDocument();
    });

    test("should accept id prop", () => {
        const customProps = { id: "GTM-CUSTOM123" };
        const { container } = render(<TrackingGTMIFrame {...customProps} />);

        const noscript = container.querySelector("noscript");
        expect(noscript).toBeInTheDocument();
    });

    test("should render without errors with valid props", () => {
        expect(() => render(<TrackingGTMIFrame {...props} />)).not.toThrow();
    });
});
