import type { IndexingStatus } from "@/lib/usecases/types";

/**
 * Difyアップロード用の設定
 */
export interface DifyUploadConfig {
  apiKey: string;
  datasetId: string;
  baseUrl: string;
  docForm: string;
}

/**
 * Difyアップロード用のデータ設定
 */
export interface DifyDataConfig {
  indexing_technique: string;
  doc_form: string;
  doc_language: string;
  process_rule: {
    mode: string;
    rules: {
      pre_processing_rules: Array<{
        id: string;
        enabled: boolean;
      }>;
      segmentation: {
        separator: string;
        max_tokens: number;
      };
    };
  };
}

/**
 * Difyアップロード結果
 */
export interface DifyUploadResponse {
  document?: {
    id: string;
  };
  batch: string;
}

/**
 * DifyRepositoryインターフェース
 * Dify APIへのアクセスを抽象化
 */
export interface IDifyRepository {
  uploadFile(file: File | Blob, fileName: string, config: DifyUploadConfig): Promise<DifyUploadResponse>;
  getIndexingStatus(batch: string, config: Omit<DifyUploadConfig, "docForm">): Promise<IndexingStatus[]>;
}

/**
 * DifyRepository実装
 * Dify APIへのHTTPリクエストを処理
 */
export class DifyRepository implements IDifyRepository {
  /**
   * ファイルをDify APIにアップロードする
   */
  async uploadFile(
    file: File | Blob,
    fileName: string,
    config: DifyUploadConfig
  ): Promise<DifyUploadResponse> {
    const uploadFormData = new FormData();

    // dataフィールド: JSON文字列として設定
    const dataConfig: DifyDataConfig = {
      indexing_technique: "high_quality",
      doc_form: config.docForm,
      doc_language: "Japanese",
      process_rule: {
        mode: "custom",
        rules: {
          pre_processing_rules: [
            {
              id: "remove_extra_spaces",
              enabled: true,
            },
            {
              id: "remove_urls_emails",
              enabled: false,
            },
          ],
          segmentation: {
            separator: "###",
            max_tokens: 500,
          },
        },
      },
    };
    uploadFormData.append("data", JSON.stringify(dataConfig));

    // fileフィールド: ファイルを追加
    const fileObj = file instanceof File ? file : new File([file], fileName, { type: "text/csv" });
    uploadFormData.append("file", fileObj);

    // APIリクエストを送信
    const response = await fetch(`${config.baseUrl}/datasets/${config.datasetId}/document/create-by-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `アップロードに失敗しました: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * インデックス化ステータスを取得する
   */
  async getIndexingStatus(
    batch: string,
    config: Omit<DifyUploadConfig, "docForm">
  ): Promise<IndexingStatus[]> {
    const response = await fetch(
      `${config.baseUrl}/datasets/${config.datasetId}/documents/${batch}/indexing-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `ステータス取得に失敗しました: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.data || [];
  }
}

