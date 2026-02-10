import { LogLevel } from "./levels";

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, unknown>;
    error?: Error;
    metadata?: Record<string, unknown>;
}

export interface LogFormatter {
    format(entry: LogEntry): string;
}

export class JsonFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const logObject: Record<string, unknown> = {
            timestamp: entry.timestamp,
            level: entry.level,
            message: entry.message,
        };

        if (entry.context) {
            logObject.context = entry.context;
        }

        if (entry.error) {
            logObject.error = {
                name: entry.error.name,
                message: entry.error.message,
                stack: entry.error.stack,
            };
        }

        if (entry.metadata) {
            logObject.metadata = entry.metadata;
        }

        return JSON.stringify(logObject);
    }
}

export class PlainTextFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const parts: string[] = [`[${entry.timestamp}]`, `[${entry.level.toUpperCase()}]`, entry.message];

        if (entry.context) {
            parts.push(`Context: ${JSON.stringify(entry.context)}`);
        }

        if (entry.error) {
            parts.push(`Error: ${entry.error.name}: ${entry.error.message}`);
            if (entry.error.stack) {
                parts.push(`Stack: ${entry.error.stack}`);
            }
        }

        if (entry.metadata) {
            parts.push(`Metadata: ${JSON.stringify(entry.metadata)}`);
        }

        return parts.join(" ");
    }
}

export const defaultFormatter = new JsonFormatter();
