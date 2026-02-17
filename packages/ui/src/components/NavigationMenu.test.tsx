import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./NavigationMenu";

describe("NavigationMenu Component", () => {
    test("should render navigation menu", () => {
        render(
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">Home</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>,
        );

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });
});
