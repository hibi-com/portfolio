import { navigation } from "./config";

describe("navigation config", () => {
    test("should have all navigation items", () => {
        expect(navigation).toHaveLength(6);
    });

    test("should have Dashboard navigation item", () => {
        const dashboard = navigation.find((item) => item.name === "Dashboard");
        expect(dashboard).toBeDefined();
        expect(dashboard?.href).toBe("/");
        expect(dashboard?.icon).toBeDefined();
    });

    test("should have Posts navigation item", () => {
        const posts = navigation.find((item) => item.name === "Posts");
        expect(posts).toBeDefined();
        expect(posts?.href).toBe("/posts");
        expect(posts?.icon).toBeDefined();
    });

    test("should have Portfolios navigation item", () => {
        const portfolios = navigation.find((item) => item.name === "Portfolios");
        expect(portfolios).toBeDefined();
        expect(portfolios?.href).toBe("/portfolios");
        expect(portfolios?.icon).toBeDefined();
    });

    
    test("should have CRM navigation item", () => {
        const crm = navigation.find((item) => item.name === "CRM");
        expect(crm).toBeDefined();
        expect(crm?.href).toBe("/crm");
        expect(crm?.icon).toBeDefined();
    });

    test("should have Support navigation item", () => {
        const support = navigation.find((item) => item.name === "Support");
        expect(support).toBeDefined();
        expect(support?.href).toBe("/support");
        expect(support?.icon).toBeDefined();
    });

    test("should have Chat navigation item", () => {
        const chat = navigation.find((item) => item.name === "Chat");
        expect(chat).toBeDefined();
        expect(chat?.href).toBe("/chat");
        expect(chat?.icon).toBeDefined();
    });

    test("should have unique names for all items", () => {
        const names = navigation.map((item) => item.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    test("should have unique hrefs for all items", () => {
        const hrefs = navigation.map((item) => item.href);
        const uniqueHrefs = new Set(hrefs);
        expect(uniqueHrefs.size).toBe(hrefs.length);
    });
});
