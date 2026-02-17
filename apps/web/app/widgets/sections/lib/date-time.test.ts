import { getTimeWorked } from "./date-time";

describe("date-time", () => {
    test("should calculate years and months correctly", () => {
        const start = new Date("2020-01-01");
        const end = new Date("2022-06-01");

        const result = getTimeWorked(start, end);

        expect(result).toBe("2 years and 5 months");
    });

    test("should handle exactly 1 year", () => {
        const start = new Date("2020-01-01");
        const end = new Date("2021-01-01");

        const result = getTimeWorked(start, end);

        expect(result).toBe("1 years and 0 months");
    });

    test("should handle less than 1 year", () => {
        const start = new Date("2020-01-01");
        const end = new Date("2020-06-01");

        const result = getTimeWorked(start, end);

        expect(result).toBe("0 years and 5 months");
    });

    test("should handle same month", () => {
        const start = new Date("2020-01-01");
        const end = new Date("2020-01-15");

        const result = getTimeWorked(start, end);

        expect(result).toBe("0 years and 0 months");
    });

    test("should handle multiple years", () => {
        const start = new Date("2018-01-01");
        const end = new Date("2023-12-01");

        const result = getTimeWorked(start, end);

        expect(result).toBe("5 years and 11 months");
    });
});
