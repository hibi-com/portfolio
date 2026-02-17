import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

interface RouterWrapperOptions {
    route?: string;
    initialEntries?: string[];
}

export function createRouterWrapper({
    route: _route = "/",
    initialEntries: _initialEntries,
}: RouterWrapperOptions = {}) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return <div data-testid="router-wrapper">{children}</div>;
    };
}

export function renderWithRouter(ui: ReactElement, options: RenderOptions & RouterWrapperOptions = {}) {
    const { route, initialEntries, ...renderOptions } = options;
    const wrapper = createRouterWrapper({ route, initialEntries });

    return render(ui, { wrapper, ...renderOptions });
}
