import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SocialLink } from "./SocialLink";

describe("SocialLink Component", () => {
    const mockSocial = {
        icon: "https://example.com/icon.png",
        title: "Twitter",
        url: "https://twitter.com/example",
    };

    test("should render social link", () => {
        render(<SocialLink data={mockSocial} />);

        const link = screen.getByRole("link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", mockSocial.url);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("should display social title", () => {
        render(<SocialLink data={mockSocial} />);

        expect(screen.getByText("Twitter")).toBeInTheDocument();
    });

    test("should render icon with correct alt text", () => {
        render(<SocialLink data={mockSocial} />);

        const img = screen.getByAltText("Follow me on Twitter");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", mockSocial.icon);
    });
});
