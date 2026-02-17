import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
    ProjectBackground,
    ProjectContainer,
    ProjectHeader,
    ProjectImage,
    ProjectSection,
    ProjectSectionColumns,
    ProjectSectionContent,
    ProjectSectionHeading,
    ProjectSectionText,
    ProjectTextRow,
} from "./Project";

vi.mock("~/hooks", () => ({
    useParallax: vi.fn().mockReturnValue({ ref: { current: null } }),
}));

describe("Project Components", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("ProjectHeader", () => {
        test("should render project header with title and description", () => {
            render(<ProjectHeader title="Test Project" description="Test description" />);

            expect(screen.getByText("Test Project")).toBeInTheDocument();
            expect(screen.getByText("Test description")).toBeInTheDocument();
        });

        test("should render project header with url", () => {
            render(<ProjectHeader title="Test Project" description="Test description" url="https://example.com" />);

            expect(screen.getByText("Visit website")).toBeInTheDocument();
        });

        test("should render project header with custom link label", () => {
            render(
                <ProjectHeader
                    title="Test Project"
                    description="Test description"
                    url="https://example.com"
                    linkLabel="Custom label"
                />,
            );

            expect(screen.getByText("Custom label")).toBeInTheDocument();
        });

        test("should render project header with roles", () => {
            render(
                <ProjectHeader title="Test Project" description="Test description" roles={["Developer", "Designer"]} />,
            );

            expect(screen.getByText("Developer")).toBeInTheDocument();
            expect(screen.getByText("Designer")).toBeInTheDocument();
        });

        test("should not render url button when url is not provided", () => {
            render(<ProjectHeader title="Test Project" description="Test description" />);

            expect(screen.queryByText("Visit website")).not.toBeInTheDocument();
        });

        test("should not render roles when roles array is empty", () => {
            render(<ProjectHeader title="Test Project" description="Test description" roles={[]} />);

            expect(screen.queryByText("Developer")).not.toBeInTheDocument();
        });
    });

    describe("ProjectContainer", () => {
        test("should render project container", () => {
            const { container } = render(
                <ProjectContainer>
                    <div>Content</div>
                </ProjectContainer>,
            );

            expect(screen.getByText("Content")).toBeInTheDocument();
            expect(container.querySelector("article")).toBeInTheDocument();
        });

        test("should apply custom className", () => {
            const { container } = render(<ProjectContainer className="custom-class" />);

            const article = container.querySelector("article");
            expect(article).toHaveClass("custom-class");
        });
    });

    describe("ProjectSection", () => {
        test("should render project section", () => {
            render(
                <ProjectSection>
                    <div>Section content</div>
                </ProjectSection>,
            );

            expect(screen.getByText("Section content")).toBeInTheDocument();
        });

        test("should render project section with background element", () => {
            render(
                <ProjectSection backgroundElement={<div>Background</div>}>
                    <div>Section content</div>
                </ProjectSection>,
            );

            expect(screen.getByText("Background")).toBeInTheDocument();
        });

        test("should apply light class", () => {
            const { container } = render(
                <ProjectSection light>
                    <div>Content</div>
                </ProjectSection>,
            );

            const section = container.querySelector("section");
            expect(section).toHaveClass("bg-muted");
        });

        test("should apply fullHeight class", () => {
            const { container } = render(
                <ProjectSection fullHeight>
                    <div>Content</div>
                </ProjectSection>,
            );

            const section = container.querySelector("section");
            expect(section).toHaveClass("min-h-screen");
        });
    });

    describe("ProjectBackground", () => {
        test("should render project background", () => {
            render(<ProjectBackground src="test.jpg" alt="" />);

            const image = screen.getByRole("presentation");
            expect(image).toBeInTheDocument();
        });

        test("should apply custom opacity", () => {
            const { container } = render(<ProjectBackground src="test.jpg" alt="" opacity={0.5} />);

            const scrim = container.querySelector('[style*="opacity"]');
            expect(scrim).toBeInTheDocument();
        });
    });

    describe("ProjectImage", () => {
        test("should render project image", () => {
            render(<ProjectImage src="test.jpg" alt="Test image" />);

            const image = screen.getByAltText("Test image");
            expect(image).toBeInTheDocument();
        });

        test("should apply custom className", () => {
            const { container } = render(<ProjectImage className="custom-class" src="test.jpg" alt="Test" />);

            const div = container.querySelector(".custom-class");
            expect(div).toBeInTheDocument();
        });
    });

    describe("ProjectSectionContent", () => {
        test("should render project section content", () => {
            render(
                <ProjectSectionContent>
                    <div>Content</div>
                </ProjectSectionContent>,
            );

            expect(screen.getByText("Content")).toBeInTheDocument();
        });

        test("should apply width class", () => {
            const { container } = render(<ProjectSectionContent width="m" />);

            const div = container.querySelector("div");
            expect(div).toHaveClass("max-w-2xl");
        });
    });

    describe("ProjectSectionHeading", () => {
        test("should render project section heading", () => {
            render(<ProjectSectionHeading>Heading</ProjectSectionHeading>);

            expect(screen.getByText("Heading")).toBeInTheDocument();
        });

        test("should apply custom level", () => {
            render(<ProjectSectionHeading level={4}>Heading</ProjectSectionHeading>);

            expect(screen.getByText("Heading")).toBeInTheDocument();
        });
    });

    describe("ProjectSectionText", () => {
        test("should render project section text", () => {
            render(<ProjectSectionText>Text content</ProjectSectionText>);

            expect(screen.getByText("Text content")).toBeInTheDocument();
        });
    });

    describe("ProjectTextRow", () => {
        test("should render project text row", () => {
            render(
                <ProjectTextRow>
                    <div>Row content</div>
                </ProjectTextRow>,
            );

            expect(screen.getByText("Row content")).toBeInTheDocument();
        });

        test("should apply center class", () => {
            const { container } = render(<ProjectTextRow center />);

            const div = container.querySelector("div");
            expect(div).toHaveClass("items-center");
        });

        test("should apply stretch class", () => {
            const { container } = render(<ProjectTextRow stretch />);

            const div = container.querySelector("div");
            expect(div).toHaveClass("items-stretch");
        });
    });

    describe("ProjectSectionColumns", () => {
        test("should render project section columns", () => {
            render(
                <ProjectSectionColumns>
                    <div>Column content</div>
                </ProjectSectionColumns>,
            );

            expect(screen.getByText("Column content")).toBeInTheDocument();
        });

        test("should apply centered class", () => {
            const { container } = render(<ProjectSectionColumns centered />);

            const div = container.querySelector("div");
            expect(div).toHaveClass("items-center");
        });
    });
});
