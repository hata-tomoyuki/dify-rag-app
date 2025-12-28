import { DifyRepository } from "@/lib/repositories/DifyRepository";
import type { UploadResult } from "@/lib/usecases/types";

function getDifyConfig(docForm?: string) {
  const apiKey = process.env.DIFY_API_KEY;
  const datasetId = process.env.DIFY_DATASET_ID;
  const baseUrl = process.env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";
  const defaultDocForm = process.env.DIFY_DOC_FORM || "qa_model";

  if (!apiKey || !datasetId) {
    throw new Error("環境変数が設定されていません。.env.localファイルを確認してください。");
  }

  return {
    apiKey,
    datasetId,
    baseUrl,
    docForm: docForm || defaultDocForm,
  };
}

function enhanceDocFormErrorMessage(errorMessage: string, actualDocForm: string): string {
  if (errorMessage.includes("doc_form")) {
    return `${errorMessage}\n\n現在の設定: doc_form="${actualDocForm}"\nデータセットのdoc_formと一致しているか確認してください。\n一般的な値: "text_model", "qa_model", "book"`;
  }
  return errorMessage;
}

function createSuccessMessage(documentId?: string): string {
  return `アップロードが成功しました！ドキュメントID: ${documentId || "N/A"}`;
}

/**
 * UploadCsvToDifyUseCase
 * Difyアップロードのユースケース
 */
export class UploadCsvToDifyUseCase {
  private difyRepository: DifyRepository;

  constructor() {
    this.difyRepository = new DifyRepository();
  }

  async execute(csvBlob: Blob, fileName: string = "cases.csv", docForm?: string): Promise<UploadResult> {
    try {
      // Dify設定を取得
      const config = getDifyConfig(docForm);

      // ファイルをアップロード
      const result = await this.difyRepository.uploadFile(csvBlob, fileName, config);

      return {
        success: true,
        message: createSuccessMessage(result.document?.id),
        documentId: result.document?.id,
        batch: result.batch,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "アップロード中にエラーが発生しました";

      // doc_formエラーの場合、メッセージを拡張
      let enhancedMessage = errorMessage;
      try {
        const config = getDifyConfig(docForm);
        enhancedMessage = enhanceDocFormErrorMessage(errorMessage, config.docForm);
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

