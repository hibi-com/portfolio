import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

describe("Card Component", () => {
    test("should render card with content", () => {
        render(
            <Card>
                <CardContent>Card content</CardContent>
            </Card>,
        );

        expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    test("should render card with header", () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
            </Card>,
        );

        expect(screen.getByText("Card Title")).toBeInTheDocument();
        expect(screen.getByText("Card Description")).toBeInTheDocument();
    });

    test("should render card with footer", () => {
        render(
            <Card>
                <CardContent>Content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>,
        );

        expect(screen.getByText("Content")).toBeInTheDocument();
        expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    test("should apply custom className", () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        const card = container.firstChild;
        expect(card).toHaveClass("custom-class");
    });
});
