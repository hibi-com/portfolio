import { describe, expect, test } from "vitest";
import type { SandboxSidebarProps } from "./types";

describe("Sandbox Widget Types", () => {
    describe("SandboxSidebarProps", () => {
        test("should support optional className field", () => {
            const props: SandboxSidebarProps = {
                className: "custom-sidebar",
            };

            expect(props.className).toBe("custom-sidebar");
        });

        test("should work without className", () => {
            const props: SandboxSidebarProps = {};

            expect(props).toBeDefined();
            expect(props.className).toBeUndefined();
        });
    });
});
