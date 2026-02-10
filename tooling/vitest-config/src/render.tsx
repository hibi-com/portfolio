import { type RenderOptions, render as rtlRender } from "@testing-library/react";
import type { FC, ReactElement, ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";

const DEFAULT_ROUTE = "/";

export interface RouterWrapperOptions {
    route?: string;
    initialEntries?: string[];
}

export type RenderWithRouterOptions = Omit<RenderOptions, "wrapper"> & RouterWrapperOptions;

export interface RenderWithRouterResult extends ReturnType<typeof rtlRender> {
    router: ReturnType<typeof createMemoryRouter>;
}

function createRouter(element: ReactNode, initialEntries: string[]) {
    return createMemoryRouter([{ path: "*", element }], { initialEntries });
}

export function renderWithRouter(ui: ReactElement, options?: RenderWithRouterOptions): RenderWithRouterResult {
    const route = options?.route ?? DEFAULT_ROUTE;
    const initialEntries = options?.initialEntries ?? [route];
    const { route: _route, initialEntries: _entries, ...renderOptions } = options ?? {};

    const router = createRouter(ui, initialEntries);

    return {
        ...rtlRender(<RouterProvider router={router} />, renderOptions),
        router,
    };
}

export function createRouterWrapper(options?: RouterWrapperOptions): FC<{ children: ReactNode }> {
    const route = options?.route ?? DEFAULT_ROUTE;
    const initialEntries = options?.initialEntries ?? [route];

    return function RouterWrapper({ children }: { children: ReactNode }) {
        const router = createRouter(children, initialEntries);
        return <RouterProvider router={router} />;
    };
}

export { render } from "@testing-library/react";
