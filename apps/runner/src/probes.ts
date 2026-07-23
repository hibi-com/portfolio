export type Probe = {
  category: string;
  buildUrl: (base: string) => string;
  headers?: Record<string, string>;
  suspicious: (status: number, body: string) => string | null;
};

const SQLI_PAYLOADS = ["' OR '1'='1", "1; DROP TABLE users--", "1 UNION SELECT NULL--"];
const XSS_PAYLOADS = ['<script>alert(1)</script>', '"><img src=x onerror=alert(1)>'];
const PATH_PAYLOADS = ["../../../../etc/passwd", "..%2f..%2f..%2fetc%2fpasswd"];

export function buildProbes(categories: string[]): Probe[] {
  const set = new Set(categories);
  const probes: Probe[] = [];

  if (set.has("sqli")) {
    for (const payload of SQLI_PAYLOADS) {
      probes.push({
        category: "sqli",
        buildUrl: (base) => {
          const url = new URL(base);
          url.searchParams.set("q", payload);
          return url.toString();
        },
        suspicious: (status, body) => {
          if (status >= 500) return `server error on sqli probe (${status})`;
          if (/sql syntax|sqlite_error|mysql|postgresql/i.test(body)) {
            return "sql error reflected in body";
          }
          return null;
        },
      });
    }
  }

  if (set.has("xss")) {
    for (const payload of XSS_PAYLOADS) {
      probes.push({
        category: "xss",
        buildUrl: (base) => {
          const url = new URL(base);
          url.searchParams.set("q", payload);
          return url.toString();
        },
        suspicious: (status, body) => {
          if (body.includes(payload)) return "payload reflected without encoding";
          if (status >= 500) return `server error on xss probe (${status})`;
          return null;
        },
      });
    }
  }

  if (set.has("path-traversal")) {
    for (const payload of PATH_PAYLOADS) {
      probes.push({
        category: "path-traversal",
        buildUrl: (base) => `${base.replace(/\/$/, "")}/${payload}`,
        suspicious: (status, body) => {
          if (status === 200 && /root:|\[fonts\]/i.test(body)) {
            return "possible file disclosure";
          }
          if (status >= 500) return `server error on path probe (${status})`;
          return null;
        },
      });
    }
  }

  if (set.has("header-injection")) {
    probes.push({
      category: "header-injection",
      buildUrl: (base) => base,
      headers: { "X-Forwarded-Host": "evil.example", "X-Original-URL": "/admin" },
      suspicious: (status, body) => {
        if (/evil\.example/i.test(body)) return "forwarded host reflected";
        if (status >= 500) return `server error on header probe (${status})`;
        return null;
      },
    });
  }

  return probes;
}
