import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

describe("Sheet Component", () => {
    test("should render sheet trigger", () => {
        render(
            <Sheet>
                <SheetTrigger asChild>
                    <Button>Open</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Sheet Title</SheetTitle>
                        <SheetDescription>Sheet Description</SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>,
        );

        expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    });
});
