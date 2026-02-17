import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "./Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./DropdownMenu";

describe("DropdownMenu Component", () => {
    test("should render dropdown menu trigger", () => {
        render(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
        );

        expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    });
});
