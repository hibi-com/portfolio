import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BlogUpcoming } from "./BlogUpcoming";

describe("BlogUpcoming Component", () => {
    test("should render upcoming posts section", () => {
        render(<BlogUpcoming />);

        expect(screen.getByText("Upcoming Posts")).toBeInTheDocument();
    });

    test("should render upcoming post items", () => {
        render(<BlogUpcoming />);

        expect(screen.getByText("Escape Hatches - brought up in Vercel conf")).toBeInTheDocument();
        expect(screen.getByText("We are all salesmen, quick prototypes, sandboxes")).toBeInTheDocument();
        expect(screen.getByText("Developer tooling - debuggers & loggers")).toBeInTheDocument();
        expect(screen.getByText("Lerna is back!")).toBeInTheDocument();
        expect(screen.getByText("You are not Google - moving quickly")).toBeInTheDocument();
        expect(screen.getByText("Reviewing pull requests - a simple framework")).toBeInTheDocument();
    });

    test("should apply custom className", () => {
        const { container } = render(<BlogUpcoming className="custom-class" />);

        const div = container.querySelector(".custom-class");
        expect(div).toBeInTheDocument();
    });

    test("should render heading", () => {
        render(<BlogUpcoming />);

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading).toHaveTextContent("Upcoming Posts");
    });

    test("should render list items", () => {
        const { container } = render(<BlogUpcoming />);

        const listItems = container.querySelectorAll("li");
        expect(listItems.length).toBeGreaterThan(0);
    });
});
