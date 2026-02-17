import type { DashboardStats } from "../model/types";
import { createStatCards } from "./createStatCards";

describe("createStatCards", () => {
    test("should create stat cards with correct structure", () => {
        const stats: DashboardStats = {
            posts: 10,
            portfolios: 5,
            totalViews: 1000,
            users: 50,
        };

        const cards = createStatCards(stats);

        expect(cards).toHaveLength(4);
        expect(cards[0]).toMatchObject({
            title: "Total Posts",
            value: 10,
            description: "Published blog posts",
            trend: "+12%",
        });
        expect(cards[1]).toMatchObject({
            title: "Portfolios",
            value: 5,
            description: "Portfolio items",
            trend: "+8%",
        });
        expect(cards[2]).toMatchObject({
            title: "Total Views",
            value: 1000,
            description: "Page views this month",
            trend: "+23%",
        });
        expect(cards[3]).toMatchObject({
            title: "Users",
            value: 50,
            description: "Active users",
            trend: "+5%",
        });
    });

    test("should include icon component", () => {
        const stats: DashboardStats = {
            posts: 0,
            portfolios: 0,
            totalViews: 0,
            users: 0,
        };

        const cards = createStatCards(stats);

        expect(cards[0]?.icon).toBeDefined();
        expect(cards[0]?.icon).toBeTruthy();
    });

    test("should handle zero values", () => {
        const stats: DashboardStats = {
            posts: 0,
            portfolios: 0,
            totalViews: 0,
            users: 0,
        };

        const cards = createStatCards(stats);

        expect(cards[0]?.value).toBe(0);
        expect(cards[1]?.value).toBe(0);
        expect(cards[2]?.value).toBe(0);
        expect(cards[3]?.value).toBe(0);
    });
});
