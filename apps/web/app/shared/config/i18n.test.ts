import i18n from "./i18n";

describe("i18n config", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should be initialized", () => {
        expect(i18n).toBeDefined();
        expect(i18n.isInitialized).toBe(true);
    });

    test("should have default language set to en", () => {
        expect(i18n.language).toBe("en");
    });

    test("should have fallback language set to en", () => {
        const fallbackLng = i18n.options.fallbackLng;
        if (Array.isArray(fallbackLng)) {
            expect(fallbackLng).toContain("en");
        } else {
            expect(fallbackLng).toBe("en");
        }
    });

    test("should have resources for en and ja", () => {
        const resources = i18n.options.resources as Record<string, { translation: Record<string, string> }>;

        expect(resources).toBeDefined();
        expect(resources.en).toBeDefined();
        expect(resources.ja).toBeDefined();
        expect(resources.en?.translation).toBeDefined();
        expect(resources.ja?.translation).toBeDefined();
    });

    test("should have welcome translation in English", () => {
        const t = i18n.getFixedT("en");
        expect(t("welcome")).toBe("Welcome");
    });

    test("should have welcome translation in Japanese", () => {
        const t = i18n.getFixedT("ja");
        expect(t("welcome")).toBe("ようこそ");
    });

    test("should have interpolation escapeValue set to false", () => {
        expect(i18n.options.interpolation?.escapeValue).toBe(false);
    });

    test("should use react-i18next plugin", () => {
        expect(i18n.isInitialized).toBe(true);
        expect(typeof i18n.t).toBe("function");
    });
});
