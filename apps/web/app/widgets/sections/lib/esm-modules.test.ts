import { fireworks } from "./esm-modules";

vi.mock("@fireworks-js/react", () => ({
    default: vi.fn(),
}));

describe("esm-modules", () => {
    test("should export fireworks function", () => {
        expect(fireworks).toBeDefined();
        expect(typeof fireworks).toBe("function");
    });

    test("should return a promise when called", async () => {
        const result = fireworks();

        expect(result).toBeInstanceOf(Promise);
        await result;
    });
});
