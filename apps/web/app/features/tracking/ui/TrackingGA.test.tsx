import { render } from "@testing-library/react";
import type { TrackingGAProps } from "../model/types";
import { TrackingGA } from "./TrackingGA";

describe("TrackingGA Component", () => {
    let props: TrackingGAProps;

    beforeEach(() => {
        props = {
            id: "GA-123456789",
        };
    });

    test("should render script tags", () => {
        const { container } = render(<TrackingGA {...props} />);

        const scripts = container.querySelectorAll("script");
        expect(scripts.length).toBeGreaterThan(0);
    });

    test("should render script tag with correct src", () => {
        const { container } = render(<TrackingGA {...props} />);

        const script = container.querySelector("script[src]");
        expect(script).toHaveAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${props.id}`);
    });

    test("should include GA ID in script content", () => {
        const { container } = render(<TrackingGA {...props} />);

        const scripts = container.querySelectorAll("script");
        const scriptContent = Array.from(scripts)
            .map((script) => script.innerHTML)
            .join(" ");
        expect(scriptContent).toContain(props.id);
    });

    test("should render async and defer attributes", () => {
        const { container } = render(<TrackingGA {...props} />);

        const script = container.querySelector("script[src]");
        expect(script).toHaveAttribute("async");
        expect(script).toHaveAttribute("defer");
    });

    test("should render inline script with gtag config", () => {
        const { container } = render(<TrackingGA {...props} />);

        const scripts = container.querySelectorAll("script");
        const inlineScript = Array.from(scripts).find((script) => script.innerHTML.includes("gtag"));
        expect(inlineScript).toBeInTheDocument();
    });
});
