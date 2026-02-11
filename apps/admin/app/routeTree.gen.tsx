import { Route as rootRouteImport } from "./routes/__root";
import { Route as CrmRouteImport } from "./routes/crm";
import { Route as CrmCustomersRouteImport } from "./routes/crm.customers";
import { Route as CrmCustomersNewRouteImport } from "./routes/crm.customers.new";
import { Route as CrmDealsRouteImport } from "./routes/crm.deals";
import { Route as CrmLeadsRouteImport } from "./routes/crm.leads";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as PortfoliosRouteImport } from "./routes/portfolios";
import { Route as PortfoliosNewRouteImport } from "./routes/portfolios.new";
import { Route as PostsRouteImport } from "./routes/posts";
import { Route as PostsNewRouteImport } from "./routes/posts.new";
import { Route as SupportRouteImport } from "./routes/support";
import { Route as SupportInquiriesRouteImport } from "./routes/support.inquiries";
import { Route as SupportInquiriesIdRouteImport } from "./routes/support.inquiries.$id";
import { Route as SupportInquiriesNewRouteImport } from "./routes/support.inquiries.new";

const SupportRoute = SupportRouteImport.update({
    id: "/support",
    path: "/support",
    getParentRoute: () => rootRouteImport,
} as any);
const PostsRoute = PostsRouteImport.update({
    id: "/posts",
    path: "/posts",
    getParentRoute: () => rootRouteImport,
} as any);
const PortfoliosRoute = PortfoliosRouteImport.update({
    id: "/portfolios",
    path: "/portfolios",
    getParentRoute: () => rootRouteImport,
} as any);
const CrmRoute = CrmRouteImport.update({
    id: "/crm",
    path: "/crm",
    getParentRoute: () => rootRouteImport,
} as any);
const IndexRoute = IndexRouteImport.update({
    id: "/",
    path: "/",
    getParentRoute: () => rootRouteImport,
} as any);
const SupportInquiriesRoute = SupportInquiriesRouteImport.update({
    id: "/inquiries",
    path: "/inquiries",
    getParentRoute: () => SupportRoute,
} as any);
const PostsNewRoute = PostsNewRouteImport.update({
    id: "/new",
    path: "/new",
    getParentRoute: () => PostsRoute,
} as any);
const PortfoliosNewRoute = PortfoliosNewRouteImport.update({
    id: "/new",
    path: "/new",
    getParentRoute: () => PortfoliosRoute,
} as any);
const CrmLeadsRoute = CrmLeadsRouteImport.update({
    id: "/leads",
    path: "/leads",
    getParentRoute: () => CrmRoute,
} as any);
const CrmDealsRoute = CrmDealsRouteImport.update({
    id: "/deals",
    path: "/deals",
    getParentRoute: () => CrmRoute,
} as any);
const CrmCustomersRoute = CrmCustomersRouteImport.update({
    id: "/customers",
    path: "/customers",
    getParentRoute: () => CrmRoute,
} as any);
const SupportInquiriesIdRoute = SupportInquiriesIdRouteImport.update({
    id: "/$id",
    path: "/$id",
    getParentRoute: () => SupportInquiriesRoute,
} as any);
const SupportInquiriesNewRoute = SupportInquiriesNewRouteImport.update({
    id: "/new",
    path: "/new",
    getParentRoute: () => SupportInquiriesRoute,
} as any);
const CrmCustomersNewRoute = CrmCustomersNewRouteImport.update({
    id: "/new",
    path: "/new",
    getParentRoute: () => CrmCustomersRoute,
} as any);

export interface FileRoutesByFullPath {
    "/": typeof IndexRoute;
    "/crm": typeof CrmRouteWithChildren;
    "/portfolios": typeof PortfoliosRouteWithChildren;
    "/posts": typeof PostsRouteWithChildren;
    "/support": typeof SupportRouteWithChildren;
    "/crm/customers": typeof CrmCustomersRouteWithChildren;
    "/crm/deals": typeof CrmDealsRoute;
    "/crm/leads": typeof CrmLeadsRoute;
    "/portfolios/new": typeof PortfoliosNewRoute;
    "/posts/new": typeof PostsNewRoute;
    "/support/inquiries": typeof SupportInquiriesRouteWithChildren;
    "/crm/customers/new": typeof CrmCustomersNewRoute;
    "/support/inquiries/$id": typeof SupportInquiriesIdRoute;
    "/support/inquiries/new": typeof SupportInquiriesNewRoute;
}
export interface FileRoutesByTo {
    "/": typeof IndexRoute;
    "/crm": typeof CrmRouteWithChildren;
    "/portfolios": typeof PortfoliosRouteWithChildren;
    "/posts": typeof PostsRouteWithChildren;
    "/support": typeof SupportRouteWithChildren;
    "/crm/customers": typeof CrmCustomersRouteWithChildren;
    "/crm/deals": typeof CrmDealsRoute;
    "/crm/leads": typeof CrmLeadsRoute;
    "/portfolios/new": typeof PortfoliosNewRoute;
    "/posts/new": typeof PostsNewRoute;
    "/support/inquiries": typeof SupportInquiriesRouteWithChildren;
    "/crm/customers/new": typeof CrmCustomersNewRoute;
    "/support/inquiries/$id": typeof SupportInquiriesIdRoute;
    "/support/inquiries/new": typeof SupportInquiriesNewRoute;
}
export interface FileRoutesById {
    __root__: typeof rootRouteImport;
    "/": typeof IndexRoute;
    "/crm": typeof CrmRouteWithChildren;
    "/portfolios": typeof PortfoliosRouteWithChildren;
    "/posts": typeof PostsRouteWithChildren;
    "/support": typeof SupportRouteWithChildren;
    "/crm/customers": typeof CrmCustomersRouteWithChildren;
    "/crm/deals": typeof CrmDealsRoute;
    "/crm/leads": typeof CrmLeadsRoute;
    "/portfolios/new": typeof PortfoliosNewRoute;
    "/posts/new": typeof PostsNewRoute;
    "/support/inquiries": typeof SupportInquiriesRouteWithChildren;
    "/crm/customers/new": typeof CrmCustomersNewRoute;
    "/support/inquiries/$id": typeof SupportInquiriesIdRoute;
    "/support/inquiries/new": typeof SupportInquiriesNewRoute;
}
export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath;
    fullPaths:
        | "/"
        | "/crm"
        | "/portfolios"
        | "/posts"
        | "/support"
        | "/crm/customers"
        | "/crm/deals"
        | "/crm/leads"
        | "/portfolios/new"
        | "/posts/new"
        | "/support/inquiries"
        | "/crm/customers/new"
        | "/support/inquiries/$id"
        | "/support/inquiries/new";
    fileRoutesByTo: FileRoutesByTo;
    to:
        | "/"
        | "/crm"
        | "/portfolios"
        | "/posts"
        | "/support"
        | "/crm/customers"
        | "/crm/deals"
        | "/crm/leads"
        | "/portfolios/new"
        | "/posts/new"
        | "/support/inquiries"
        | "/crm/customers/new"
        | "/support/inquiries/$id"
        | "/support/inquiries/new";
    id:
        | "__root__"
        | "/"
        | "/crm"
        | "/portfolios"
        | "/posts"
        | "/support"
        | "/crm/customers"
        | "/crm/deals"
        | "/crm/leads"
        | "/portfolios/new"
        | "/posts/new"
        | "/support/inquiries"
        | "/crm/customers/new"
        | "/support/inquiries/$id"
        | "/support/inquiries/new";
    fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
    IndexRoute: typeof IndexRoute;
    CrmRoute: typeof CrmRouteWithChildren;
    PortfoliosRoute: typeof PortfoliosRouteWithChildren;
    PostsRoute: typeof PostsRouteWithChildren;
    SupportRoute: typeof SupportRouteWithChildren;
}

declare module "@tanstack/react-router" {
    interface FileRoutesByPath {
        "/support": {
            id: "/support";
            path: "/support";
            fullPath: "/support";
            preLoaderRoute: typeof SupportRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        "/posts": {
            id: "/posts";
            path: "/posts";
            fullPath: "/posts";
            preLoaderRoute: typeof PostsRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        "/portfolios": {
            id: "/portfolios";
            path: "/portfolios";
            fullPath: "/portfolios";
            preLoaderRoute: typeof PortfoliosRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        "/crm": {
            id: "/crm";
            path: "/crm";
            fullPath: "/crm";
            preLoaderRoute: typeof CrmRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        "/": {
            id: "/";
            path: "/";
            fullPath: "/";
            preLoaderRoute: typeof IndexRouteImport;
            parentRoute: typeof rootRouteImport;
        };
        "/support/inquiries": {
            id: "/support/inquiries";
            path: "/inquiries";
            fullPath: "/support/inquiries";
            preLoaderRoute: typeof SupportInquiriesRouteImport;
            parentRoute: typeof SupportRoute;
        };
        "/posts/new": {
            id: "/posts/new";
            path: "/new";
            fullPath: "/posts/new";
            preLoaderRoute: typeof PostsNewRouteImport;
            parentRoute: typeof PostsRoute;
        };
        "/portfolios/new": {
            id: "/portfolios/new";
            path: "/new";
            fullPath: "/portfolios/new";
            preLoaderRoute: typeof PortfoliosNewRouteImport;
            parentRoute: typeof PortfoliosRoute;
        };
        "/crm/leads": {
            id: "/crm/leads";
            path: "/leads";
            fullPath: "/crm/leads";
            preLoaderRoute: typeof CrmLeadsRouteImport;
            parentRoute: typeof CrmRoute;
        };
        "/crm/deals": {
            id: "/crm/deals";
            path: "/deals";
            fullPath: "/crm/deals";
            preLoaderRoute: typeof CrmDealsRouteImport;
            parentRoute: typeof CrmRoute;
        };
        "/crm/customers": {
            id: "/crm/customers";
            path: "/customers";
            fullPath: "/crm/customers";
            preLoaderRoute: typeof CrmCustomersRouteImport;
            parentRoute: typeof CrmRoute;
        };
        "/support/inquiries/$id": {
            id: "/support/inquiries/$id";
            path: "/$id";
            fullPath: "/support/inquiries/$id";
            preLoaderRoute: typeof SupportInquiriesIdRouteImport;
            parentRoute: typeof SupportInquiriesRoute;
        };
        "/support/inquiries/new": {
            id: "/support/inquiries/new";
            path: "/new";
            fullPath: "/support/inquiries/new";
            preLoaderRoute: typeof SupportInquiriesNewRouteImport;
            parentRoute: typeof SupportInquiriesRoute;
        };
        "/crm/customers/new": {
            id: "/crm/customers/new";
            path: "/new";
            fullPath: "/crm/customers/new";
            preLoaderRoute: typeof CrmCustomersNewRouteImport;
            parentRoute: typeof CrmCustomersRoute;
        };
    }
}

interface CrmCustomersRouteChildren {
    CrmCustomersNewRoute: typeof CrmCustomersNewRoute;
}

const CrmCustomersRouteChildren: CrmCustomersRouteChildren = {
    CrmCustomersNewRoute: CrmCustomersNewRoute,
};

const CrmCustomersRouteWithChildren = CrmCustomersRoute._addFileChildren(CrmCustomersRouteChildren);

interface CrmRouteChildren {
    CrmCustomersRoute: typeof CrmCustomersRouteWithChildren;
    CrmDealsRoute: typeof CrmDealsRoute;
    CrmLeadsRoute: typeof CrmLeadsRoute;
}

const CrmRouteChildren: CrmRouteChildren = {
    CrmCustomersRoute: CrmCustomersRouteWithChildren,
    CrmDealsRoute: CrmDealsRoute,
    CrmLeadsRoute: CrmLeadsRoute,
};

const CrmRouteWithChildren = CrmRoute._addFileChildren(CrmRouteChildren);

interface PortfoliosRouteChildren {
    PortfoliosNewRoute: typeof PortfoliosNewRoute;
}

const PortfoliosRouteChildren: PortfoliosRouteChildren = {
    PortfoliosNewRoute: PortfoliosNewRoute,
};

const PortfoliosRouteWithChildren = PortfoliosRoute._addFileChildren(PortfoliosRouteChildren);

interface PostsRouteChildren {
    PostsNewRoute: typeof PostsNewRoute;
}

const PostsRouteChildren: PostsRouteChildren = {
    PostsNewRoute: PostsNewRoute,
};

const PostsRouteWithChildren = PostsRoute._addFileChildren(PostsRouteChildren);

interface SupportInquiriesRouteChildren {
    SupportInquiriesIdRoute: typeof SupportInquiriesIdRoute;
    SupportInquiriesNewRoute: typeof SupportInquiriesNewRoute;
}

const SupportInquiriesRouteChildren: SupportInquiriesRouteChildren = {
    SupportInquiriesIdRoute: SupportInquiriesIdRoute,
    SupportInquiriesNewRoute: SupportInquiriesNewRoute,
};

const SupportInquiriesRouteWithChildren = SupportInquiriesRoute._addFileChildren(SupportInquiriesRouteChildren);

interface SupportRouteChildren {
    SupportInquiriesRoute: typeof SupportInquiriesRouteWithChildren;
}

const SupportRouteChildren: SupportRouteChildren = {
    SupportInquiriesRoute: SupportInquiriesRouteWithChildren,
};

const SupportRouteWithChildren = SupportRoute._addFileChildren(SupportRouteChildren);

const rootRouteChildren: RootRouteChildren = {
    IndexRoute: IndexRoute,
    CrmRoute: CrmRouteWithChildren,
    PortfoliosRoute: PortfoliosRouteWithChildren,
    PostsRoute: PostsRouteWithChildren,
    SupportRoute: SupportRouteWithChildren,
};
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>();
