import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import * as useDashboardStatsModule from "../lib/useDashboardStats";
import { Dashboard } from "./Dashboard";

vi.mock("../lib/useDashboardStats");
vi.mock("../lib/createStatCards", () => ({
    createStatCards: vi.fn((stats) => [
        {
            title: "Total Posts",
            value: stats.posts,
            description: "Published blog posts",
            icon: vi.fn(),
            trend: "+12%",
        },
    ]),
}));

describe("Dashboard", () => {
    test("should render dashboard title and description", () => {
        vi.mocked(useDashboardStatsModule.useDashboardStats).mockReturnValue({
            stats: {
                posts: 0,
                portfolios: 0,
                totalViews: 0,
                users: 0,
            },
            loading: false,
            error: null,
        });

        render(<Dashboard />);

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Welcome to your CMS dashboard")).toBeInTheDocument();
    });

    test("should render stat cards", () => {
        vi.mocked(useDashboardStatsModule.useDashboardStats).mockReturnValue({
            stats: {
                posts: 10,
                portfolios: 5,
                totalViews: 1000,
                users: 50,
            },
            loading: false,
            error: null,
        });

        render(<Dashboard />);

        expect(screen.getByText("Total Posts")).toBeInTheDocument();
    });

    test("should render recent activity and quick actions cards", () => {
        vi.mocked(useDashboardStatsModule.useDashboardStats).mockReturnValue({
            stats: {
                posts: 0,
                portfolios: 0,
                totalViews: 0,
                users: 0,
            },
            loading: false,
            error: null,
        });

        render(<Dashboard />);

        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
        expect(screen.getByText("Quick Actions")).toBeInTheDocument();
        expect(screen.getByText("No recent activity")).toBeInTheDocument();
    });
});
