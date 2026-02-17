import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Tags } from "./Tags";

describe("Tags Component", () => {
    test("should render tags", () => {
        render(<Tags tags={["tag1", "tag2", "tag3"]} />);

        expect(screen.getByText("tag1")).toBeInTheDocument();
        expect(screen.getByText("tag2")).toBeInTheDocument();
        expect(screen.getByText("tag3")).toBeInTheDocument();
    });

    test("should render heading when provided", () => {
        render(<Tags heading="Tags" tags={["tag1"]} />);

        expect(screen.getByText("Tags")).toBeInTheDocument();
    });

    test("should apply custom className", () => {
        const { container } = render(<Tags className="custom-class" tags={["tag1"]} />);
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass("custom-class");
    });

    test("should apply custom classNameTag", () => {
        render(<Tags classNameTag="custom-tag" tags={["tag1"]} />);

        const tag = screen.getByText("tag1");
        expect(tag).toHaveClass("custom-tag");
    });

    test("should handle empty tags array", () => {
        const { container } = render(<Tags tags={[]} />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
