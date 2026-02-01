import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";

describe("Table Component", () => {
    test("should render table with header and body", () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Alice</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    test("should render table with caption", () => {
        render(
            <Table>
                <TableCaption>Test caption</TableCaption>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByText("Test caption")).toBeInTheDocument();
    });

    test("should apply custom className to Table", () => {
        const { container } = render(
            <Table className="custom-table">
                <TableBody>
                    <TableRow>
                        <TableCell>Content</TableCell>
                    </TableRow>
                </TableBody>
            </Table>,
        );

        const table = container.querySelector("table");
        expect(table).toHaveClass("custom-table");
    });
});
