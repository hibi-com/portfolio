import { OpenAPIHono } from "@hono/zod-openapi";
import { chatsRouter } from "./chats";
import { customersRouter } from "./customers";
import { dealsRouter } from "./deals";
import { emailsRouter } from "./emails";
import { freeeRouter } from "./freee";
import { inquiriesRouter } from "./inquiries";
import { leadsRouter } from "./leads";
import { pipelinesRouter } from "./pipelines";
import { portfoliosRouter } from "./portfolios";
import { postsRouter } from "./posts";

type Env = {
	DATABASE_URL: string;
	CACHE_URL: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

// Public routes (no auth required)
app.route("/", postsRouter);
app.route("/", portfoliosRouter);

// CRM routes
app.route("/crm", customersRouter);
app.route("/crm", leadsRouter);
app.route("/crm", dealsRouter);
app.route("/crm", pipelinesRouter);

// Support routes
app.route("/support", inquiriesRouter);

// Chat routes
app.route("/chat", chatsRouter);

// Email routes
app.route("/email", emailsRouter);

// Freee routes
app.route("/freee", freeeRouter);

// OpenAPI documentation endpoint
app.doc("/spec", {
	openapi: "3.0.0",
	info: {
		title: "Portfolio API",
		version: "1.0.0",
		description: "API for Portfolio CMS",
	},
	servers: [
		{
			url: "/api",
			description: "API Server",
		},
	],
	tags: [
		{ name: "Posts", description: "Blog posts" },
		{ name: "Portfolios", description: "Portfolio projects" },
		{ name: "Customers", description: "CRM - Customer management" },
		{ name: "Leads", description: "CRM - Lead management" },
		{ name: "Deals", description: "CRM - Deal management" },
		{ name: "Pipelines", description: "CRM - Pipeline management" },
		{ name: "Support", description: "Support ticket management" },
		{ name: "Chat", description: "Chat rooms and messages" },
		{ name: "Email", description: "Email templates and sending" },
		{ name: "Freee", description: "Freee accounting integration" },
	],
});

export { app as openapiRouter };
