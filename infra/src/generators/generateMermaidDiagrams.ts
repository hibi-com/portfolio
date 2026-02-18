import { updateInfraArchitectureDoc } from "./updateArchitectureDoc.js";

function main(): void {
    console.log("[generate-mermaid] Starting Mermaid diagram generation...");

    const success = updateInfraArchitectureDoc();

    if (success) {
        console.log("[generate-mermaid] ✅ Successfully updated infra-architecture.md");
    } else {
        console.error("[generate-mermaid] ❌ Failed to update infra-architecture.md");
        process.exit(1);
    }
}

main();
