#!/bin/bash
set -eux -o pipefail

WORK_DIR="${WORK_DIR:-/work}"
APP_DIR="${APP_DIR:-}"
REPORT_DIR="${REPORT_DIR:-/work/docs/security/e2e}"
SKIP_BUILD="${SKIP_BUILD:-false}"
SKIP_SECURITY_SCAN="${SKIP_SECURITY_SCAN:-false}"

echo "🚀 Starting E2E test execution with security scanning"
echo "Work directory: ${WORK_DIR}"
echo "App directory: ${APP_DIR:-<not specified, using work directory>}"
echo "Report directory: ${REPORT_DIR}"
echo "Skip build: ${SKIP_BUILD}"
echo "Skip security scan: ${SKIP_SECURITY_SCAN}"

if [ -n "${APP_DIR}" ]; then
	APP_PATH="${WORK_DIR}/${APP_DIR}"
	if [ ! -d "${APP_PATH}" ]; then
		echo "❌ Error: App directory not found: ${APP_PATH}" >&2
		exit 1
	fi
else
	APP_PATH="${WORK_DIR}"
fi

if [ "${SKIP_BUILD}" != "true" ]; then
	echo ""
	echo "📦 Step 1: Installing dependencies and building application..."

	cd "${WORK_DIR}" || exit 1

	echo "Verifying workspace directories..."
	for workspace_pattern in "apps" "packages" "tooling" "testing" "scripts"; do
		if [ ! -d "${workspace_pattern}" ]; then
			echo "⚠️  Warning: Workspace directory not found: ${workspace_pattern}" >&2
		fi
	done

	echo "Installing dependencies at monorepo root..."
	if ! bun install --frozen-lockfile; then
		echo "❌ Error: Failed to install dependencies" >&2
		echo "Debug information:" >&2
		echo "Current directory: $(pwd)" >&2
		echo "Workspace directories:" >&2
		find "${WORK_DIR}" -maxdepth 1 -mindepth 1 -type d -exec ls -ld {} \; 2>/dev/null | head -10 >&2
		if [ -d "${WORK_DIR}/tooling" ]; then
			echo "tooling directory contents:" >&2
			find "${WORK_DIR}/tooling" -maxdepth 1 -mindepth 1 -exec ls -ld {} \; 2>/dev/null | head -10 >&2
		fi
		exit 1
	fi

	echo "Building application in ${APP_PATH}..."
	cd "${APP_PATH}" || exit 1
	bun run build || {
		echo "❌ Error: Application build failed" >&2
		exit 1
	}
	echo "✅ Build completed successfully"
else
	echo ""
	echo "⏭️  Skipping build (SKIP_BUILD=true)"
fi

if [ "${SKIP_SECURITY_SCAN}" != "true" ]; then
	echo ""
	echo "🔒 Step 2: Running security scan on application code..."

	mkdir -p "${REPORT_DIR}"

	if command -v trivy &>/dev/null; then
		echo "Running Trivy filesystem scan..."
		trivy filesystem \
			--format json \
			--output "${REPORT_DIR}/trivy-fs-report.json" \
			--severity HIGH,CRITICAL \
			--exit-code 0 \
			"${WORK_DIR}" || true

		trivy filesystem \
			--format table \
			--output "${REPORT_DIR}/trivy-fs-report.txt" \
			--severity HIGH,CRITICAL \
			--exit-code 0 \
			"${WORK_DIR}" || true
	else
		echo "⚠️  Trivy is not installed in the container"
	fi

	echo "Running dependency vulnerability scan..."
	cd "${APP_PATH}" || exit 1
	bun audit --json >"${REPORT_DIR}/bun-audit-report.json" 2>&1 || true
	bun audit >"${REPORT_DIR}/bun-audit-report.txt" 2>&1 || true

	if [ -f "${REPORT_DIR}/bun-audit-report.json" ]; then
		CRITICAL_COUNT=$(grep -ic "critical" "${REPORT_DIR}/bun-audit-report.json" || echo "0")
		if [ "${CRITICAL_COUNT}" -gt 0 ]; then
			echo "⚠️  WARNING: Found ${CRITICAL_COUNT} CRITICAL vulnerabilities in dependencies"
			echo "   Review the report at: ${REPORT_DIR}/bun-audit-report.txt"
		fi
	fi
	echo "✅ Security scan completed"
else
	echo ""
	echo "⏭️  Skipping security scan (SKIP_SECURITY_SCAN=true)"
fi

echo ""
echo "🧪 Step 3: Running E2E tests..."
cd "${APP_PATH}" || exit 1

if [ $# -eq 0 ]; then
	echo "Running default E2E tests..."
	exec bun x playwright test
else
	echo "Running custom command: $*"
	exec "$@"
fi
