import { worker } from "./worker";

describe("worker", () => {
    test("should export worker string", () => {
        expect(worker).toBeTruthy();
        expect(typeof worker).toBe("string");
    });

    test("should contain serviceWorker check", () => {
        expect(worker).toContain("serviceWorker");
    });

    test("should contain navigator check", () => {
        expect(worker).toContain("navigator");
    });

    test("should contain register call", () => {
        expect(worker).toContain("register");
    });

    test("should contain worker.js path", () => {
        expect(worker).toContain("/worker.js");
    });
});
