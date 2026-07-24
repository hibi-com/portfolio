import { expect } from "@cloudflare/playwright/test";
import type { Browser, Page } from "@cloudflare/playwright";
import type { ScenarioResult } from "./types";

type Targets = {
  webBaseUrl: string;
  apiBaseUrl: string;
};

async function timed(
  name: string,
  fn: () => Promise<void>,
): Promise<ScenarioResult> {
  const started = Date.now();
  try {
    await fn();
    return { name, ok: true, durationMs: Date.now() - started };
  } catch (error) {
    return {
      name,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function withPage(
  browser: Browser,
  fn: (page: Page) => Promise<void>,
): Promise<void> {
  const page = await browser.newPage();
  try {
    await fn(page);
  } finally {
    await page.close();
  }
}

export async function runCriticalScenarios(
  browser: Browser,
  targets: Targets,
): Promise<ScenarioResult[]> {
  const { webBaseUrl, apiBaseUrl } = targets;

  return [
    await timed("api-health", async () => {
      const res = await fetch(`${apiBaseUrl}/health`);
      if (!res.ok) {
        throw new Error(`api health returned ${res.status}`);
      }
      const body = (await res.json()) as { status?: string };
      if (body.status !== "healthy" && body.status !== "ok") {
        throw new Error(`unexpected health payload: ${JSON.stringify(body)}`);
      }
    }),
    await timed("web-home", async () => {
      await withPage(browser, async (page) => {
        const res = await page.goto(`${webBaseUrl}/`, {
          waitUntil: "domcontentloaded",
        });
        expect(res?.ok() ?? false).toBeTruthy();
        await expect(page.locator("body")).toBeVisible();
      });
    }),
    await timed("web-blog", async () => {
      await withPage(browser, async (page) => {
        const res = await page.goto(`${webBaseUrl}/blog`, {
          waitUntil: "domcontentloaded",
        });
        expect(res?.ok() ?? false).toBeTruthy();
        await expect(page.locator("body")).toBeVisible();
      });
    }),
    await timed("web-portfolio", async () => {
      await withPage(browser, async (page) => {
        const res = await page.goto(`${webBaseUrl}/portfolio`, {
          waitUntil: "domcontentloaded",
        });
        expect(res?.ok() ?? false).toBeTruthy();
        await expect(page.locator("body")).toBeVisible();
      });
    }),
  ];
}
