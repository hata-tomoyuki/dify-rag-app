import { DifyRepository } from "@/lib/repositories/DifyRepository";
import { DifyService } from "@/lib/services/DifyService";
import type { IndexingStatusResult } from "@/lib/usecases/types";

/**
 * GetIndexingStatusUseCase
 * インデックス化ステータス取得のユースケース
 */
export class GetIndexingStatusUseCase {
  private difyRepository: DifyRepository;
  private difyService: DifyService;

  constructor() {
    this.difyRepository = new DifyRepository();
    this.difyService = new DifyService();
  }

  async execute(batch: string): Promise<IndexingStatusResult> {
    try {
      // Dify設定を取得（docFormは不要なので除外）
      const fullConfig = this.difyService.getConfig();
      const config = {
        apiKey: fullConfig.apiKey,
        datasetId: fullConfig.datasetId,
        baseUrl: fullConfig.baseUrl,
      };

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

