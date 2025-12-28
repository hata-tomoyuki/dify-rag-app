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
    // サーバーサイドでは、BlobからFileオブジェクトを作成する必要がある
    let fileObj: File | Blob;
    if (file instanceof File) {
      fileObj = file;
    } else {
      // BlobからFileオブジェクトを作成
      // サーバーサイドでは、Fileコンストラクタが利用可能
      fileObj = new File([file], fileName, {
        type: "text/csv;charset=utf-8",
        lastModified: Date.now(),
      });
    }
    uploadFormData.append("file", fileObj, fileName);

    // APIリクエストを送信
    const response = await fetch(`${config.baseUrl}/datasets/${config.datasetId}/document/create-by-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      let errorMessage = `アップロードに失敗しました: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Dify APIのエラーレスポンス構造に応じてメッセージを取得
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
        // エラーの詳細情報があれば追加
        if (errorData.code) {
          errorMessage += ` (コード: ${errorData.code})`;
        }
        if (errorData.details) {
          errorMessage += `\n詳細: ${JSON.stringify(errorData.details)}`;
        }
      } catch {
        // JSONパースに失敗した場合は、レスポンステキストを取得
        try {
          const text = await response.text();
          if (text) {
            errorMessage += `\nレスポンス: ${text}`;
          }
        } catch {
          // テキスト取得にも失敗した場合はデフォルトメッセージを使用
        }
      }
      throw new Error(errorMessage);
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

