import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

describe("Select Component", () => {
    test("should render select trigger with placeholder", () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Choose one" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                </SelectContent>
            </Select>,
        );

        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Choose one")).toBeInTheDocument();
    });

    test("should render with default value", () => {
        render(
            <Select defaultValue="b">
                <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                </SelectContent>
            </Select>,
        );

        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Option B")).toBeInTheDocument();
    });
});
