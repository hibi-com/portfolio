import "@typespec/http";
import "@typespec/openapi3";
import "../models/pipeline.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Pipelines")
@route("/api/crm")
namespace Api.Pipelines {
    @get
    @route("/pipelines")
    @summary("Get all pipelines")
    op listPipelines(): Pipeline[];

    @get
    @route("/pipelines/{id}")
    @summary("Get a pipeline by ID")
    op getPipelineById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Pipeline;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @get
    @route("/pipelines/default")
    @summary("Get the default pipeline")
    op getDefaultPipeline(): {
        @statusCode statusCode: 200;
        @body body: Pipeline;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/pipelines")
    @summary("Create a new pipeline")
    op createPipeline(@body body: CreatePipelineInput): {
        @statusCode statusCode: 201;
        @body body: Pipeline;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/pipelines/{id}")
    @summary("Update a pipeline")
    op updatePipeline(@path id: string, @body body: UpdatePipelineInput): {
        @statusCode statusCode: 200;
        @body body: Pipeline;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/pipelines/{id}")
    @summary("Delete a pipeline")
    op deletePipeline(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/pipelines/{pipelineId}/stages")
    @summary("Create a new pipeline stage")
    op createPipelineStage(@path pipelineId: string, @body body: CreatePipelineStageInput): {
        @statusCode statusCode: 201;
        @body body: PipelineStage;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/pipelines/{pipelineId}/stages/{stageId}")
    @summary("Update a pipeline stage")
    op updatePipelineStage(@path pipelineId: string, @path stageId: string, @body body: UpdatePipelineStageInput): {
        @statusCode statusCode: 200;
        @body body: PipelineStage;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/pipelines/{pipelineId}/stages/{stageId}")
    @summary("Delete a pipeline stage")
    op deletePipelineStage(@path pipelineId: string, @path stageId: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };
}
