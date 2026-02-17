import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SectionFireworks } from "./SectionFireworks";

vi.mock("../lib/esm-modules", () => ({
    fireworks: vi.fn(() =>
        Promise.resolve({
            Fireworks: ({ style }: { style: React.CSSProperties }) => (
                <div data-testid="fireworks" style={style}>
                    Fireworks Component
                </div>
            ),
        }),
    ),
}));

describe("SectionFireworks Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("should not render anything initially", () => {
        render(<SectionFireworks />);

        expect(screen.queryByTestId("fireworks")).not.toBeInTheDocument();
    });

    test("should render fireworks component after loading", async () => {
        render(<SectionFireworks />);

        await waitFor(() => {
            expect(screen.getByTestId("fireworks")).toBeInTheDocument();
        });
    });

    test("should return null when not loaded", () => {
        const { container } = render(<SectionFireworks />);

        expect(container.firstChild).toBeNull();
    });
});
