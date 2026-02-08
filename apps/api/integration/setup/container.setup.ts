/**
 * Medium Test用DIコンテナ セットアップ
 *
 * テスト用のDIコンテナを作成し、モックされた外部サービスを注入する
 */

import { DIContainer } from "../../../src/di/container";
import { getTestDatabaseUrlForContainer } from "./db.setup";

/**
 * テスト用DIコンテナを作成
 *
 * @param options - コンテナオプション
 * @returns 設定済みのDIContainer
 */
export interface TestContainerOptions {
    /**
     * Redis URLを使用するかどうか
     * falseの場合、キャッシュなしで動作
     */
    useCache?: boolean;
    /**
     * R2バケットのモック
     */
    r2Bucket?: any;
    /**
     * R2パブリックURL
     */
    r2PublicUrl?: string;
}

export function createTestContainer(options: TestContainerOptions = {}): DIContainer {
    const databaseUrl = getTestDatabaseUrlForContainer();
    const redisUrl = options.useCache ? process.env.TEST_REDIS_URL : undefined;
    const r2Bucket = options.r2Bucket;
    const r2PublicUrl = options.r2PublicUrl || "https://test-r2.example.com";

    return new DIContainer(databaseUrl, redisUrl, r2Bucket, r2PublicUrl);
}

/**
 * テスト用のモックR2バケットを作成
 */
export function createMockR2Bucket(): any {
    const storage = new Map<string, ArrayBuffer>();

    return {
        put: async (key: string, value: ArrayBuffer | ReadableStream | string): Promise<void> => {
            if (typeof value === "string") {
                storage.set(key, new TextEncoder().encode(value).buffer as ArrayBuffer);
            } else if (value instanceof ArrayBuffer) {
                storage.set(key, value);
            } else {
                // ReadableStream
                const reader = value.getReader();
                const chunks: Uint8Array[] = [];
                let done = false;
                while (!done) {
                    const result = await reader.read();
                    done = result.done;
                    if (result.value) {
                        chunks.push(result.value);
                    }
                }
                const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const combined = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    combined.set(chunk, offset);
                    offset += chunk.length;
                }
                storage.set(key, combined.buffer as ArrayBuffer);
            }
        },
        get: async (key: string): Promise<{ arrayBuffer: () => Promise<ArrayBuffer> } | null> => {
            const value = storage.get(key);
            if (!value) return null;
            return {
                arrayBuffer: async () => value,
            };
        },
        delete: async (key: string): Promise<void> => {
            storage.delete(key);
        },
        list: async (): Promise<{ objects: Array<{ key: string }> }> => {
            return {
                objects: Array.from(storage.keys()).map((key) => ({ key })),
            };
        },
    };
}
