import type { R2Bucket } from "@cloudflare/workers-types";
import { AppError } from "@portfolio/log";
import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";
import { UploadPortfolioImageUseCase } from "./uploadPortfolioImage";

describe("UploadPortfolioImageUseCase", () => {
    let mockRepository: PortfolioRepository;
    let mockR2Bucket: R2Bucket;
    const r2PublicUrl = "https://pub.example.com";

    beforeEach(() => {
        mockRepository = {
            findAll: vi.fn(),
            findBySlug: vi.fn(),
            findById: vi.fn(),
            addImage: vi.fn().mockResolvedValue(undefined),
        };

        mockR2Bucket = {
            put: vi.fn().mockResolvedValue({
                key: "test-key",
                version: "1",
                size: 1024,
                etag: "test-etag",
                httpEtag: "test-etag",
                checksums: {},
                uploaded: "2024-01-01T00:00:00.000Z",
                storageClass: "STANDARD",
            }),
        } as unknown as R2Bucket;
    });

    const createMockImageFile = (name: string, type: string, size: number): File => {
        const blob = new Blob(["test content"], { type });
        Object.defineProperty(blob, "name", { value: name });
        Object.defineProperty(blob, "size", { value: size });
        return blob as unknown as File;
    };

    test("should upload image successfully", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const imageFile = createMockImageFile("test.jpg", "image/jpeg", 1024 * 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);
        const result = await useCase.execute(portfolioId, imageFile);

        expect(mockRepository.findById).toHaveBeenCalledWith(portfolioId);
        expect(mockR2Bucket.put).toHaveBeenCalledTimes(1);
        expect(mockRepository.addImage).toHaveBeenCalledWith(portfolioId, expect.stringContaining(r2PublicUrl));
        expect(result.url).toContain(r2PublicUrl);
        expect(result.url).toContain(`portfolios/${portfolioId}/`);
    });

    test("should throw error when portfolio not found", async () => {
        const portfolioId = "non-existent";
        const imageFile = createMockImageFile("test.jpg", "image/jpeg", 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(null);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);

        await expect(useCase.execute(portfolioId, imageFile)).rejects.toThrow(AppError);
        await expect(useCase.execute(portfolioId, imageFile)).rejects.toThrow("Portfolio not found");

        expect(mockRepository.findById).toHaveBeenCalledWith(portfolioId);
        expect(mockR2Bucket.put).not.toHaveBeenCalled();
        expect(mockRepository.addImage).not.toHaveBeenCalled();
    });

    test("should throw error when file is not an image", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const textFile = createMockImageFile("test.txt", "text/plain", 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);

        await expect(useCase.execute(portfolioId, textFile)).rejects.toThrow(AppError);
        await expect(useCase.execute(portfolioId, textFile)).rejects.toThrow("File must be an image");

        expect(mockRepository.findById).toHaveBeenCalledWith(portfolioId);
        expect(mockR2Bucket.put).not.toHaveBeenCalled();
        expect(mockRepository.addImage).not.toHaveBeenCalled();
    });

    test("should throw error when file size exceeds 10MB", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const largeImageFile = createMockImageFile("large.jpg", "image/jpeg", 11 * 1024 * 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);

        await expect(useCase.execute(portfolioId, largeImageFile)).rejects.toThrow(AppError);
        await expect(useCase.execute(portfolioId, largeImageFile)).rejects.toThrow("Image size must be less than 10MB");

        expect(mockRepository.findById).toHaveBeenCalledWith(portfolioId);
        expect(mockR2Bucket.put).not.toHaveBeenCalled();
        expect(mockRepository.addImage).not.toHaveBeenCalled();
    });

    test("should generate correct R2 key with timestamp and extension", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const imageFile = createMockImageFile("test.png", "image/png", 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);
        await useCase.execute(portfolioId, imageFile);

        const putCall = (mockR2Bucket.put as unknown as { mock: { calls: [string, ArrayBuffer, object][] } }).mock
            .calls[0];
        const key = putCall?.[0];

        expect(key).toContain(`portfolios/${portfolioId}/`);
        expect(key).toMatch(/\.png$/);
        expect(putCall?.[1]).toBeInstanceOf(ArrayBuffer);
        expect(putCall?.[2]).toEqual({
            httpMetadata: {
                contentType: "image/png",
            },
        });
    });

    test("should use default extension jpg when file has no extension", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const imageFile = createMockImageFile("test", "image/jpeg", 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);
        await useCase.execute(portfolioId, imageFile);

        const putCall = (mockR2Bucket.put as unknown as { mock: { calls: [string, ArrayBuffer, object][] } }).mock
            .calls[0];
        const key = putCall?.[0];

        expect(key).toMatch(/\.jpg$/);
    });

    test("should save image URL to database after R2 upload", async () => {
        const portfolioId = "portfolio-1";
        const mockPortfolio: Portfolio = {
            id: portfolioId,
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        };

        const imageFile = createMockImageFile("test.jpg", "image/jpeg", 1024);

        mockRepository.findById = vi.fn().mockResolvedValue(mockPortfolio);

        const useCase = new UploadPortfolioImageUseCase(mockRepository, mockR2Bucket, r2PublicUrl);
        const result = await useCase.execute(portfolioId, imageFile);

        expect(mockR2Bucket.put).toHaveBeenCalledTimes(1);
        expect(mockRepository.addImage).toHaveBeenCalledTimes(1);
        expect(mockRepository.addImage).toHaveBeenCalledWith(portfolioId, result.url);
    });
});
