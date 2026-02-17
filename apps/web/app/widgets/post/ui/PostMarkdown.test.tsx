import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { PostMarkdown } from "./PostMarkdown";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
    };
});

describe("PostMarkdown Components", () => {
    test("should render h1 heading", () => {
        const PostH1 = PostMarkdown.h1;
        render(
            <MemoryRouter>
                <PostH1 id="test-id">Heading 1</PostH1>
            </MemoryRouter>,
        );

        expect(screen.getByText("Heading 1")).toBeInTheDocument();
        expect(screen.getAllByLabelText("Link to heading").length).toBeGreaterThan(0);
    });

    test("should render h2 heading", () => {
        const PostH2 = PostMarkdown.h2;
        render(
            <MemoryRouter>
                <PostH2 id="test-id">Heading 2</PostH2>
            </MemoryRouter>,
        );

        expect(screen.getByText("Heading 2")).toBeInTheDocument();
    });

    test("should render h3 heading", () => {
        const PostH3 = PostMarkdown.h3;
        render(
            <MemoryRouter>
                <PostH3 id="test-id">Heading 3</PostH3>
            </MemoryRouter>,
        );

        expect(screen.getByText("Heading 3")).toBeInTheDocument();
    });

    test("should render h4 heading", () => {
        const PostH4 = PostMarkdown.h4;
        render(
            <MemoryRouter>
                <PostH4 id="test-id">Heading 4</PostH4>
            </MemoryRouter>,
        );

        expect(screen.getByText("Heading 4")).toBeInTheDocument();
    });

    test("should render paragraph", () => {
        const PostParagraph = PostMarkdown.p;
        render(<PostParagraph>Paragraph text</PostParagraph>);

        expect(screen.getByText("Paragraph text")).toBeInTheDocument();
    });

    test("should render unordered list", () => {
        const PostUl = PostMarkdown.ul;
        render(
            <PostUl>
                <li>Item 1</li>
            </PostUl>,
        );

        expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    test("should render ordered list", () => {
        const PostOl = PostMarkdown.ol;
        render(
            <PostOl>
                <li>Item 1</li>
            </PostOl>,
        );

        expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    test("should render code block", () => {
        const PostCode = PostMarkdown.code;
        render(<PostCode>const x = 1;</PostCode>);

        expect(screen.getByText("const x = 1;")).toBeInTheDocument();
    });

    test("should render pre block", () => {
        const PostPre = PostMarkdown.pre;
        render(<PostPre>Code block</PostPre>);

        expect(screen.getByText("Code block")).toBeInTheDocument();
    });

    test("should render blockquote", () => {
        const PostBlockquote = PostMarkdown.blockquote;
        render(<PostBlockquote>Quote text</PostBlockquote>);

        expect(screen.getByText("Quote text")).toBeInTheDocument();
    });

    test("should render horizontal rule", () => {
        const PostHr = PostMarkdown.hr;
        const { container } = render(<PostHr />);

        const hr = container.querySelector("hr");
        expect(hr).toBeInTheDocument();
    });

    test("should render strong text", () => {
        const PostStrong = PostMarkdown.strong;
        render(<PostStrong>Bold text</PostStrong>);

        expect(screen.getByText("Bold text")).toBeInTheDocument();
    });

    test("should render image", () => {
        const PostImage = PostMarkdown.img;
        render(<PostImage src="test.jpg" alt="Test image" width={100} height={100} />);

        const image = screen.getByAltText("Test image");
        expect(image).toHaveAttribute("src", "test.jpg");
        expect(image).toHaveAttribute("width", "100");
        expect(image).toHaveAttribute("height", "100");
    });

    test("should render embed", () => {
        const Embed = PostMarkdown.Embed;
        render(<Embed src="https://example.com/embed" />);

        const iframe = screen.getByTitle("Embed");
        expect(iframe).toHaveAttribute("src", "https://example.com/embed");
    });
});
