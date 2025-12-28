import { DifyRepository } from "@/lib/repositories/DifyRepository";
import { DifyService } from "@/lib/services/DifyService";
import type { UploadResult } from "@/lib/usecases/types";

/**
 * UploadCsvToDifyUseCase
 * Difyアップロードのユースケース
 */
export class UploadCsvToDifyUseCase {
  private difyRepository: DifyRepository;
  private difyService: DifyService;

  constructor() {
    this.difyRepository = new DifyRepository();
    this.difyService = new DifyService();
  }

  async execute(csvBlob: Blob, fileName: string = "cases.csv", docForm?: string): Promise<UploadResult> {
    try {
      // Dify設定を取得
      const config = this.difyService.getConfig(docForm);

      // ファイルをアップロード
      const result = await this.difyRepository.uploadFile(csvBlob, fileName, config);

      return {
        success: true,
        message: this.difyService.createSuccessMessage(result.document?.id),
        documentId: result.document?.id,
        batch: result.batch,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "アップロード中にエラーが発生しました";

      // doc_formエラーの場合、メッセージを拡張
      let enhancedMessage = errorMessage;
      try {
        const config = this.difyService.getConfig(docForm);
        enhancedMessage = this.difyService.enhanceDocFormErrorMessage(errorMessage, config.docForm);
      } catch {
        // 設定取得に失敗した場合は元のメッセージを使用
      }

      return {
        success: false,
        message: enhancedMessage,
      };
    }
  }
}

