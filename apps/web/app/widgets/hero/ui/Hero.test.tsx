import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Hero } from "./Hero";

describe("Hero Component", () => {
    test("should render hero with highlight text", () => {
        render(<Hero highlight="Test Highlight" tag="h1" />);

        expect(screen.getByText("Test Highlight")).toBeInTheDocument();
    });

    test("should render with default tag h2 when tag prop is not provided", () => {
        const { container } = render(<Hero highlight="Test Highlight" tag="h2" />);

        const heading = container.querySelector("h2");
        expect(heading).toBeInTheDocument();
    });

    test("should render with custom tag", () => {
        const { container } = render(<Hero highlight="Test Highlight" tag="h1" />);

        const heading = container.querySelector("h1");
        expect(heading).toBeInTheDocument();
    });

    test("should render copy text when provided", () => {
        render(<Hero copy="Test Copy" highlight="Test Highlight" tag="h2" />);

        expect(screen.getByText("Test Copy")).toBeInTheDocument();
    });

    test("should not render copy when not provided", () => {
        render(<Hero highlight="Test Highlight" tag="h2" />);

        expect(screen.queryByText("Test Copy")).not.toBeInTheDocument();
    });

    test("should render copy as ReactElement when provided", () => {
        const copyElement = <span>React Element Copy</span>;
        render(<Hero copy={copyElement} highlight="Test Highlight" tag="h2" />);

        expect(screen.getByText("React Element Copy")).toBeInTheDocument();
    });

    test("should apply custom className", () => {
        const { container } = render(<Hero className="custom-class" highlight="Test Highlight" tag="h2" />);

        const heroDiv = container.firstChild as HTMLElement;
        expect(heroDiv).toHaveClass("custom-class");
    });

    test("should have correct structure with copy and highlight", () => {
        render(<Hero copy="Copy Text" highlight="Highlight Text" tag="h2" />);

        expect(screen.getByText("Copy Text")).toBeInTheDocument();
        expect(screen.getByText("Highlight Text")).toBeInTheDocument();
    });
});
