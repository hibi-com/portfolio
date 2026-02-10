import { describe, expect, test } from "vitest";
import {
    createPipelineInputSchema,
    createPipelineStageInputSchema,
    pipelineSchema,
    pipelineStageSchema,
    updatePipelineInputSchema,
    updatePipelineStageInputSchema,
} from "./pipeline";

describe("Pipeline Zod Schemas", () => {
    describe("pipelineStageSchema", () => {
        test("should validate complete pipeline stage", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Qualification",
                order: 1,
                probability: 25,
                color: "#3498db",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should validate stage with minimum required fields", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Initial",
                order: 0,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should reject stage with negative order", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Stage",
                order: -1,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(false);
        });

        test("should reject stage with probability above 100", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Stage",
                order: 0,
                probability: 150,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(false);
        });

        test("should accept stage with probability 0", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Stage",
                order: 0,
                probability: 0,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should accept stage with probability 100", () => {
            const result = pipelineStageSchema.safeParse({
                id: "stage-123",
                pipelineId: "pipeline-1",
                name: "Closed Won",
                order: 5,
                probability: 100,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("pipelineSchema", () => {
        test("should validate complete pipeline with stages", () => {
            const result = pipelineSchema.safeParse({
                id: "pipeline-1",
                name: "Sales Pipeline",
                description: "Main sales funnel",
                isDefault: true,
                stages: [
                    {
                        id: "stage-1",
                        pipelineId: "pipeline-1",
                        name: "Lead",
                        order: 0,
                        probability: 10,
                        createdAt: "2024-01-01T00:00:00Z",
                        updatedAt: "2024-01-01T00:00:00Z",
                    },
                    {
                        id: "stage-2",
                        pipelineId: "pipeline-1",
                        name: "Qualification",
                        order: 1,
                        probability: 25,
                        createdAt: "2024-01-01T00:00:00Z",
                        updatedAt: "2024-01-01T00:00:00Z",
                    },
                ],
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should validate pipeline with empty stages array", () => {
            const result = pipelineSchema.safeParse({
                id: "pipeline-1",
                name: "New Pipeline",
                isDefault: false,
                stages: [],
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should reject pipeline without name", () => {
            const result = pipelineSchema.safeParse({
                id: "pipeline-1",
                isDefault: false,
                stages: [],
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("createPipelineInputSchema", () => {
        test("should validate create input with all fields", () => {
            const result = createPipelineInputSchema.safeParse({
                name: "New Pipeline",
                description: "For enterprise clients",
                isDefault: true,
            });
            expect(result.success).toBe(true);
        });

        test("should validate create input with minimum fields", () => {
            const result = createPipelineInputSchema.safeParse({
                name: "New Pipeline",
            });
            expect(result.success).toBe(true);
        });

        test("should reject create input without name", () => {
            const result = createPipelineInputSchema.safeParse({
                description: "No name",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("updatePipelineInputSchema", () => {
        test("should validate update input with partial fields", () => {
            const result = updatePipelineInputSchema.safeParse({
                name: "Updated Pipeline",
            });
            expect(result.success).toBe(true);
        });

        test("should validate update input with empty object", () => {
            const result = updatePipelineInputSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });

    describe("createPipelineStageInputSchema", () => {
        test("should validate create stage input with all fields", () => {
            const result = createPipelineStageInputSchema.safeParse({
                pipelineId: "pipeline-1",
                name: "New Stage",
                order: 3,
                probability: 50,
                color: "#e74c3c",
            });
            expect(result.success).toBe(true);
        });

        test("should validate create stage input with minimum fields", () => {
            const result = createPipelineStageInputSchema.safeParse({
                pipelineId: "pipeline-1",
                name: "New Stage",
                order: 0,
            });
            expect(result.success).toBe(true);
        });

        test("should reject create stage without pipelineId", () => {
            const result = createPipelineStageInputSchema.safeParse({
                name: "New Stage",
                order: 0,
            });
            expect(result.success).toBe(false);
        });
    });

    describe("updatePipelineStageInputSchema", () => {
        test("should validate update stage input with partial fields", () => {
            const result = updatePipelineStageInputSchema.safeParse({
                order: 5,
                probability: 75,
            });
            expect(result.success).toBe(true);
        });

        test("should validate update stage input with empty object", () => {
            const result = updatePipelineStageInputSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });
});
