import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "./prisma/schema",
	migrations: {
		path: "./migration",
	},
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
