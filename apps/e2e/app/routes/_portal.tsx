import { json, type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const session = await requireAuth(request);
        return json({
            user: session.user,
        });
    } catch (error) {
        if (error instanceof Response && error.status === 401) {
            return redirect("/login");
        }
        throw error;
    }
}

export default function PortalLayout() {
    const { user } = useLoaderData<typeof loader>();

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header
                style={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    padding: "1rem 2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h1 style={{ margin: 0, fontSize: "1.5rem" }}>🧪 Test Portal</h1>
                    <nav style={{ display: "flex", gap: "1rem" }}>
                        <a href="/" style={{ color: "#60a5fa", textDecoration: "none" }}>
                            Dashboard
                        </a>
                    </nav>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#d1d5db" }}>{user.email || user.name || "User"}</span>
                    <Form method="post" action="/api/auth/signout">
                        <button
                            type="submit"
                            style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#374151",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </Form>
                </div>
            </header>

            <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f9fafb" }}>
                <Outlet />
            </main>

            <footer
                style={{
                    padding: "1rem 2rem",
                    backgroundColor: "#1a1a1a",
                    color: "#9ca3af",
                    textAlign: "center",
                    fontSize: "0.875rem",
                }}
            >
                <p style={{ margin: 0 }}>Portfolio Test Portal © 2024</p>
            </footer>
        </div>
    );
}
