import { data, myDescriptions } from "./details";

describe("details data", () => {
    describe("data", () => {
        test("should export data object", () => {
            expect(data).toBeDefined();
            expect(typeof data).toBe("object");
        });

        test("should have default key", () => {
            expect(data.default).toBeDefined();
            expect(typeof data.default).toBe("string");
        });

        test("should have non-empty default description", () => {
            expect(data.default?.length).toBeGreaterThan(0);
        });

        test("should have descriptions for common technologies", () => {
            expect(data.TypeScript).toBeDefined();
            expect(data.Remix).toBeDefined();
            expect(data.React).toBeDefined();
            expect(data["Node.js"]).toBeDefined();
            expect(data.TailwindCSS).toBeDefined();
        });

        test("should have string values for all keys", () => {
            Object.values(data).forEach((value) => {
                expect(typeof value).toBe("string");
                expect(value.length).toBeGreaterThan(0);
            });
        });

        test("should match Data interface", () => {
            const typedData: Record<string, string> = data;
            expect(typedData).toBeDefined();
        });
    });

    describe("myDescriptions", () => {
        test("should export myDescriptions object", () => {
            expect(myDescriptions).toBeDefined();
            expect(typeof myDescriptions).toBe("object");
        });

        test("should have default key", () => {
            expect(myDescriptions.default).toBeDefined();
            expect(typeof myDescriptions.default).toBe("string");
        });

        test("should have string values for all keys", () => {
            Object.values(myDescriptions).forEach((value) => {
                expect(typeof value).toBe("string");
                expect(value.length).toBeGreaterThan(0);
            });
        });

        test("should have similar keys to data", () => {
            const dataKeys = Object.keys(data);
            const myDescKeys = Object.keys(myDescriptions);
            expect(myDescKeys.length).toBeGreaterThan(0);
            const hasOverlap = dataKeys.some((key) => myDescKeys.includes(key));
            expect(hasOverlap).toBe(true);
        });
    });
});
