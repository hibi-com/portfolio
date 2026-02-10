import pc from "picocolors";

export function logSection(title: string): void {
    console.log();
    console.log(pc.bold(pc.cyan(`  ${title}`)));
    console.log(pc.dim(`  ${"─".repeat(50)}`));
}

export function logStep(
    icon: string,
    message: string,
    status: "info" | "success" | "warning" | "error" = "info",
): void {
    const colors = {
        info: pc.blue,
        success: pc.green,
        warning: pc.yellow,
        error: pc.red,
    };
    let statusIcon: string;
    if (status === "success") {
        statusIcon = "✓";
    } else if (status === "error") {
        statusIcon = "✗";
    } else if (status === "warning") {
        statusIcon = "⚠";
    } else {
        statusIcon = "→";
    }
    console.log(`  ${colors[status](statusIcon)} ${icon} ${message}`);
}

export function logSubStep(message: string, status: "info" | "success" | "warning" = "info"): void {
    const colors = {
        info: pc.dim,
        success: pc.green,
        warning: pc.yellow,
    };
    let statusIcon: string;
    if (status === "success") {
        statusIcon = "✓";
    } else if (status === "warning") {
        statusIcon = "⚠";
    } else {
        statusIcon = "  ";
    }
    console.log(`    ${colors[status](statusIcon)} ${message}`);
}

export class LoadingBar {
    private readonly message: string;
    private interval: ReturnType<typeof setInterval> | null = null;
    private readonly frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    private frameIndex = 0;
    private isActive = false;

    constructor(message: string) {
        this.message = message;
    }

    start(): void {
        if (this.isActive) return;
        this.isActive = true;
        this.frameIndex = 0;
        this.interval = setInterval(() => {
            const frame = this.frames[this.frameIndex % this.frames.length];
            process.stdout.write(`\r    ${pc.cyan(frame)} ${pc.dim(this.message)}`);
            this.frameIndex++;
        }, 100);
    }

    stop(success: boolean = true, finalMessage?: string): void {
        if (!this.isActive) return;
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write(`\r${" ".repeat(80)}\r`);
        if (finalMessage) {
            const messageStatus: "success" | "warning" = success ? "success" : "warning";
            logSubStep(finalMessage, messageStatus);
        }
    }
}
