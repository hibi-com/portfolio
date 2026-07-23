FROM mcr.microsoft.com/playwright:v1.57.0-noble@sha256:3bed4b1a12f2338642f3d8cba28e291deef3c66bd4a964bbeb3e57bbff511dbd AS builder

ARG BUN_VERSION=1.1.43
ARG TRIVY_VERSION=0.72.0
ARG DEBIAN_FRONTEND=noninteractive
ARG USERNAME=e2e
ARG USER_UID=1000
ARG USER_GID=1000

SHELL ["/bin/bash", "-eux", "-o", "pipefail", "-c"]

RUN groupadd --gid "${USER_GID}" "${USERNAME}" || true; \
    useradd --uid "${USER_UID}" --gid "${USER_GID}" --shell /bin/bash --create-home "${USERNAME}" || true; \
    apt-get update -qq; \
    apt-get install -qq --no-install-recommends \
      ca-certificates=20240203 \
      curl=8.5.0-2ubuntu10.6 \
      unzip=6.0-28ubuntu4.1 \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/apt/archives/*; \
    curl -sfL "https://raw.githubusercontent.com/aquasecurity/trivy/v${TRIVY_VERSION}/contrib/install.sh" \
      | sh -s -- -b /usr/local/bin "v${TRIVY_VERSION}"; \
    chmod +x /usr/local/bin/trivy; \
    arch="$(dpkg --print-architecture)"; \
    case "${arch##*-}" in \
      amd64) build="x64-baseline";; \
      arm64) build="aarch64";; \
      *) echo "error: unsupported architecture: $arch" >&2; exit 1 ;; \
    esac; \
    curl "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-${build}.zip" \
      -fsSLO \
      --compressed \
      --retry 5 \
      --retry-delay 2 \
      --max-time 300 \
      || { echo "error: failed to download bun-v${BUN_VERSION}" >&2; exit 1; }; \
    unzip -q "bun-linux-${build}.zip"; \
    mv "bun-linux-${build}/bun" /usr/local/bin/bun; \
    rm -rf "bun-linux-${build}.zip" "bun-linux-${build}"; \
    chmod +x /usr/local/bin/bun; \
    chown root:root /usr/local/bin/bun; \
    bun --version

FROM mcr.microsoft.com/playwright:v1.57.0-noble@sha256:3bed4b1a12f2338642f3d8cba28e291deef3c66bd4a964bbeb3e57bbff511dbd

LABEL maintainer="e2e"
LABEL description="Playwright E2E testing container for Portfolio project"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="Portfolio E2E Test Container"
LABEL org.opencontainers.image.description="Container for running Playwright E2E tests with Bun runtime"
LABEL org.opencontainers.image.version="1.0.0"

ARG USERNAME=e2e
ARG USER_UID=1000
ARG USER_GID=1000
ARG DEBIAN_FRONTEND=noninteractive

SHELL ["/bin/bash", "-eux", "-o", "pipefail", "-c"]

RUN if id -u "${USER_UID}" >/dev/null 2>&1; then \
        EXISTING_USER=$(id -nu "${USER_UID}"); \
        if [ "${EXISTING_USER}" != "${USERNAME}" ]; then \
            userdel -r "${EXISTING_USER}" 2>/dev/null || true; \
        fi; \
    fi; \
    if ! id -u "${USERNAME}" >/dev/null 2>&1; then \
        groupadd --gid "${USER_GID}" "${USERNAME}" || true; \
        useradd --uid "${USER_UID}" --gid "${USER_GID}" --shell /bin/bash --create-home "${USERNAME}" || exit 1; \
    fi; \
    mkdir -p /work/.results /work/.reports /work/docs/playwright/report \
    && chown -R "${USER_UID}:${USER_GID}" /work/.results /work/.reports /work/docs \
    && chmod -R 775 /work/.results /work/.reports /work/docs

WORKDIR /work

COPY --from=builder --chown=root:root /usr/local/bin/bun /usr/local/bin/bun
COPY --from=builder --chown=root:root /usr/local/bin/trivy /usr/local/bin/trivy

COPY --chown=${USER_UID}:${USER_GID} .docker/e2e/scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV CI=true \
    PORT=3000 \
    NODE_ENV=test \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    DEBIAN_FRONTEND=noninteractive \
    TZ=UTC \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    HOME=/home/${USERNAME} \
    USER=${USERNAME} \
    WORK_DIR=/work \
    REPORT_DIR=/work/docs/security/e2e \
    SKIP_BUILD=false \
    SKIP_SECURITY_SCAN=false

USER ${USERNAME}

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

HEALTHCHECK --interval=60s --timeout=10s --start-period=10s --retries=3 \
    CMD bun --version > /dev/null && playwright --version > /dev/null || exit 1
