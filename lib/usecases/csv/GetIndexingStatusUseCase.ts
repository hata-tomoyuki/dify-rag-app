import { DifyRepository } from "@/lib/repositories/DifyRepository";
import type { IndexingStatusResult } from "@/lib/usecases/types";

function getDifyBaseConfig() {
  const apiKey = process.env.DIFY_API_KEY;
  const datasetId = process.env.DIFY_DATASET_ID;
  const baseUrl = process.env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";

  if (!apiKey || !datasetId) {
    throw new Error("環境変数が設定されていません");
  }

  return { apiKey, datasetId, baseUrl };
}

/**
 * GetIndexingStatusUseCase
 * インデックス化ステータス取得のユースケース
 */
export class GetIndexingStatusUseCase {
  private difyRepository: DifyRepository;

  constructor() {
    this.difyRepository = new DifyRepository();
  }

  async execute(batch: string): Promise<IndexingStatusResult> {
    try {
      const config = getDifyBaseConfig();

      // ステータスを取得
      const data = await this.difyRepository.getIndexingStatus(batch, config);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "ステータス取得中にエラーが発生しました",
      };
    }
  }
}

