import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ShareButton } from "./ShareButton";

describe("ShareButton Component", () => {
    const mockOnShare = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render share button when isAvailable is true", () => {
        render(<ShareButton onShare={mockOnShare} isAvailable={true} />);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
    });

    test("should not render when isAvailable is false", () => {
        const { container } = render(<ShareButton onShare={mockOnShare} isAvailable={false} />);

        expect(container.firstChild).toBeNull();
    });

    test("should render share icon", () => {
        render(<ShareButton onShare={mockOnShare} />);

        const icon = screen.getByAltText("Share");
        expect(icon).toBeInTheDocument();
    });

    test("should call onShare with options when button is clicked", () => {
        const url = "https://example.com";
        const title = "Test Title";
        const text = "Test Text";

        render(<ShareButton onShare={mockOnShare} url={url} title={title} text={text} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockOnShare).toHaveBeenCalledWith({ url, title, text });
        expect(mockOnShare).toHaveBeenCalledTimes(1);
    });

    test("should call onShare with partial options", () => {
        const url = "https://example.com";

        render(<ShareButton onShare={mockOnShare} url={url} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockOnShare).toHaveBeenCalledWith({ url });
    });

    test("should show label when showLabel is true", () => {
        render(<ShareButton onShare={mockOnShare} showLabel={true} />);

        const label = screen.getByText("Share");
        expect(label).toBeInTheDocument();
    });

    test("should not show label when showLabel is false", () => {
        render(<ShareButton onShare={mockOnShare} showLabel={false} />);

        const label = screen.queryByText("Share");
        expect(label).not.toBeInTheDocument();
    });

    test("should be disabled when disabled is true", () => {
        render(<ShareButton onShare={mockOnShare} disabled={true} />);

        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    test("should not call onShare when disabled", () => {
        render(<ShareButton onShare={mockOnShare} disabled={true} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockOnShare).not.toHaveBeenCalled();
    });

    test("should apply custom className", () => {
        render(<ShareButton onShare={mockOnShare} className="custom-class" />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass("custom-class");
    });

    test("should use custom icon src and alt", () => {
        render(<ShareButton onShare={mockOnShare} iconSrc="/custom-icon.svg" iconAlt="Custom Share" />);

        const icon = screen.getByAltText("Custom Share");
        expect(icon).toHaveAttribute("src", "/custom-icon.svg");
    });
});
