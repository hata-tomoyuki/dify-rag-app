import type { DifyUploadConfig } from "@/lib/repositories/DifyRepository";

/**
 * DifyService
 * Dify API設定の管理とリクエストフォーマットの構築を提供
 */
export class DifyService {
  /**
   * 環境変数からDify設定を取得する
   */
  getConfig(docForm?: string): DifyUploadConfig {
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

  /**
   * doc_formエラーメッセージを拡張する
   */
  enhanceDocFormErrorMessage(errorMessage: string, docForm: string): string {
    if (errorMessage.includes("doc_form")) {
      return `${errorMessage}\n\n現在の設定: doc_form="${docForm}"\nデータセットのdoc_formと一致しているか確認してください。\n一般的な値: "text_model", "qa_model", "book"`;
    }
    return errorMessage;
  }

  /**
   * アップロード成功メッセージを生成する
   */
  createSuccessMessage(documentId?: string): string {
    return `アップロードが成功しました！ドキュメントID: ${documentId || "N/A"}`;
  }
}

