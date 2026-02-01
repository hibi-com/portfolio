import { describe, expect, test } from "vitest";
import type { TrackingGAProps, TrackingGTMIFrameProps, TrackingGTMScriptProps } from "./types";

describe("Tracking Feature Types", () => {
    describe("TrackingGAProps", () => {
        test("should have required id field", () => {
            const props: TrackingGAProps = {
                id: "G-XXXXXXXXXX",
            };

            expect(props.id).toBe("G-XXXXXXXXXX");
            expect(typeof props.id).toBe("string");
        });

        test("should accept different id formats", () => {
            const props1: TrackingGAProps = {
                id: "UA-123456789-1",
            };

            const props2: TrackingGAProps = {
                id: "G-ABCDEFGHIJ",
            };

            expect(props1.id).toBe("UA-123456789-1");
            expect(props2.id).toBe("G-ABCDEFGHIJ");
        });
    });

    describe("TrackingGTMIFrameProps", () => {
        test("should have required id field", () => {
            const props: TrackingGTMIFrameProps = {
                id: "GTM-XXXXXXX",
            };

            expect(props.id).toBe("GTM-XXXXXXX");
            expect(typeof props.id).toBe("string");
        });

        test("should accept GTM id format", () => {
            const props: TrackingGTMIFrameProps = {
                id: "GTM-1234567",
            };

            expect(props.id).toBe("GTM-1234567");
        });
    });

    describe("TrackingGTMScriptProps", () => {
        test("should have required id field", () => {
            const props: TrackingGTMScriptProps = {
                id: "GTM-XXXXXXX",
            };

            expect(props.id).toBe("GTM-XXXXXXX");
            expect(typeof props.id).toBe("string");
        });

        test("should accept GTM id format", () => {
            const props: TrackingGTMScriptProps = {
                id: "GTM-9876543",
            };

            expect(props.id).toBe("GTM-9876543");
        });
    });
});
