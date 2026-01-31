import type { R2Bucket } from "@cloudflare/workers-types";
import { CachedPortfolioRepository } from "~/infra/cached-portfolio.repository";
import { CachedPostRepository } from "~/infra/cached-post.repository";
import { CustomerRepositoryImpl } from "~/infra/customer.repository";
import { DealRepositoryImpl } from "~/infra/deal.repository";
import { LeadRepositoryImpl } from "~/infra/lead.repository";
import { PipelineRepositoryImpl } from "~/infra/pipeline.repository";
import {
    CreateCustomerUseCase,
    DeleteCustomerUseCase,
    GetCustomerByIdUseCase,
    GetCustomersUseCase,
    UpdateCustomerUseCase,
} from "~/usecase/customer";
import {
    CreateDealUseCase,
    DeleteDealUseCase,
    GetDealByIdUseCase,
    GetDealsUseCase,
    MoveDealToStageUseCase,
    UpdateDealUseCase,
} from "~/usecase/deal";
import { GetPortfolioBySlugUseCase } from "~/usecase/getPortfolioBySlug";
import { GetPortfoliosUseCase } from "~/usecase/getPortfolios";
import { GetPostBySlugUseCase } from "~/usecase/getPostBySlug";
import { GetPostsUseCase } from "~/usecase/getPosts";
import {
    ConvertLeadToDealUseCase,
    CreateLeadUseCase,
    DeleteLeadUseCase,
    GetLeadByIdUseCase,
    GetLeadsUseCase,
    UpdateLeadUseCase,
} from "~/usecase/lead";
import {
    CreatePipelineUseCase,
    DeletePipelineUseCase,
    GetPipelineByIdUseCase,
    GetPipelinesUseCase,
    UpdatePipelineUseCase,
} from "~/usecase/pipeline";
import { UploadPortfolioImageUseCase } from "~/usecase/uploadPortfolioImage";

export class DIContainer {
    private readonly postRepository: CachedPostRepository;
    private readonly portfolioRepository: CachedPortfolioRepository;
    private readonly customerRepository: CustomerRepositoryImpl;
    private readonly leadRepository: LeadRepositoryImpl;
    private readonly dealRepository: DealRepositoryImpl;
    private readonly pipelineRepository: PipelineRepositoryImpl;

    constructor(
        readonly databaseUrl?: string,
        readonly redisUrl?: string,
        private readonly r2Bucket?: R2Bucket,
        private readonly r2PublicUrl?: string,
    ) {
        this.postRepository = new CachedPostRepository(databaseUrl, redisUrl);
        this.portfolioRepository = new CachedPortfolioRepository(databaseUrl, redisUrl);
        this.customerRepository = new CustomerRepositoryImpl(databaseUrl);
        this.leadRepository = new LeadRepositoryImpl(databaseUrl);
        this.dealRepository = new DealRepositoryImpl(databaseUrl);
        this.pipelineRepository = new PipelineRepositoryImpl(databaseUrl);
    }

    // Repository getters
    getPostRepository() {
        return this.postRepository;
    }

    getPortfolioRepository() {
        return this.portfolioRepository;
    }

    getCustomerRepository() {
        return this.customerRepository;
    }

    getLeadRepository() {
        return this.leadRepository;
    }

    getDealRepository() {
        return this.dealRepository;
    }

    getPipelineRepository() {
        return this.pipelineRepository;
    }

    // Post UseCases
    getGetPostsUseCase() {
        return new GetPostsUseCase(this.postRepository);
    }

    getGetPostBySlugUseCase() {
        return new GetPostBySlugUseCase(this.postRepository);
    }

    // Portfolio UseCases
    getGetPortfoliosUseCase() {
        return new GetPortfoliosUseCase(this.portfolioRepository);
    }

    getGetPortfolioBySlugUseCase() {
        return new GetPortfolioBySlugUseCase(this.portfolioRepository);
    }

    getUploadPortfolioImageUseCase() {
        if (!this.r2Bucket || !this.r2PublicUrl) {
            throw new Error("R2 bucket and public URL must be configured");
        }
        return new UploadPortfolioImageUseCase(this.portfolioRepository, this.r2Bucket, this.r2PublicUrl);
    }

    // Customer UseCases
    getGetCustomersUseCase() {
        return new GetCustomersUseCase(this.customerRepository);
    }

    getGetCustomerByIdUseCase() {
        return new GetCustomerByIdUseCase(this.customerRepository);
    }

    getCreateCustomerUseCase() {
        return new CreateCustomerUseCase(this.customerRepository);
    }

    getUpdateCustomerUseCase() {
        return new UpdateCustomerUseCase(this.customerRepository);
    }

    getDeleteCustomerUseCase() {
        return new DeleteCustomerUseCase(this.customerRepository);
    }

    // Lead UseCases
    getGetLeadsUseCase() {
        return new GetLeadsUseCase(this.leadRepository);
    }

    getGetLeadByIdUseCase() {
        return new GetLeadByIdUseCase(this.leadRepository);
    }

    getCreateLeadUseCase() {
        return new CreateLeadUseCase(this.leadRepository);
    }

    getUpdateLeadUseCase() {
        return new UpdateLeadUseCase(this.leadRepository);
    }

    getDeleteLeadUseCase() {
        return new DeleteLeadUseCase(this.leadRepository);
    }

    getConvertLeadToDealUseCase() {
        return new ConvertLeadToDealUseCase(this.leadRepository);
    }

    // Deal UseCases
    getGetDealsUseCase() {
        return new GetDealsUseCase(this.dealRepository);
    }

    getGetDealByIdUseCase() {
        return new GetDealByIdUseCase(this.dealRepository);
    }

    getCreateDealUseCase() {
        return new CreateDealUseCase(this.dealRepository);
    }

    getUpdateDealUseCase() {
        return new UpdateDealUseCase(this.dealRepository);
    }

    getDeleteDealUseCase() {
        return new DeleteDealUseCase(this.dealRepository);
    }

    getMoveDealToStageUseCase() {
        return new MoveDealToStageUseCase(this.dealRepository);
    }

    // Pipeline UseCases
    getGetPipelinesUseCase() {
        return new GetPipelinesUseCase(this.pipelineRepository);
    }

    getGetPipelineByIdUseCase() {
        return new GetPipelineByIdUseCase(this.pipelineRepository);
    }

    getCreatePipelineUseCase() {
        return new CreatePipelineUseCase(this.pipelineRepository);
    }

    getUpdatePipelineUseCase() {
        return new UpdatePipelineUseCase(this.pipelineRepository);
    }

    getDeletePipelineUseCase() {
        return new DeletePipelineUseCase(this.pipelineRepository);
    }
}
