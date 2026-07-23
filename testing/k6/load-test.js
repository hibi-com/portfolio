import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    stages: [
        { duration: "2m", target: 10 },
        { duration: "5m", target: 10 },
        { duration: "2m", target: 50 },
        { duration: "5m", target: 50 },
        { duration: "2m", target: 100 },
        { duration: "5m", target: 100 },
        { duration: "5m", target: 0 },
    ],
    thresholds: {
        http_req_duration: ["p(95)<500"],
        http_req_failed: ["rate<0.01"],
    },
};

const DEFAULT_STG_URL = "https://stg.www.ageha734.jp";
const ALLOWED_HOST_RE = /^stg\.(www|api)\.ageha734\.jp$/i;

function assertStgOnly(url) {
    const match = /^https?:\/\/([^/?#]+)/i.exec(url);
    if (!match) {
        throw new Error(`Invalid BASE_URL: ${url}`);
    }
    const host = match[1];
    if (!ALLOWED_HOST_RE.test(host)) {
        throw new Error(
            `Load tests are STG-only. Refusing host "${host}". Use https://stg.www.ageha734.jp or https://stg.api.ageha734.jp`,
        );
    }
}

const baseUrl = __ENV.BASE_URL || DEFAULT_STG_URL;
assertStgOnly(baseUrl);

export default function () {
    const res = http.get(baseUrl);
    check(res, {
        "status is 200": (r) => r.status === 200,
        "response time < 500ms": (r) => r.timings.duration < 500,
    });
    sleep(1);
}
