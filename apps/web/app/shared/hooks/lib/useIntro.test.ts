import { renderHook } from "@testing-library/react";
import { useIntro } from "./useIntro";

describe("useIntro", () => {
    let logs: string[] = [];

    let consoleGroupSpy: ReturnType<typeof vi.spyOn>;
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        logs = [];
        consoleGroupSpy = vi.spyOn(console, "group").mockImplementation((label: string) => {
            logs.push(`group: ${label}`);
        });
        consoleLogSpy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
            logs.push(`log: ${args.join(" ")}`);
        });
        consoleGroupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {
            logs.push("groupEnd");
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("should log intro message in correct order", () => {
        renderHook(() => useIntro());

        expect(consoleGroupSpy).toHaveBeenCalledWith("👀 Thank you for looking, lets connect!");
        expect(consoleLogSpy).toHaveBeenCalled();
        expect(consoleGroupEndSpy).toHaveBeenCalled();

        expect(logs[0]).toContain("group: 👀");
        expect(logs.at(-1)).toBe("groupEnd");
    });
});
