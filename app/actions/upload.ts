"use server";

interface UploadResult {
  success: boolean;
  message: string;
  documentId?: string;
  batch?: string;
}

export interface IndexingStatus {
  id: string;
  indexing_status: string;
  processing_started_at?: number;
  parsing_completed_at?: number;
  cleaning_completed_at?: number;
  splitting_completed_at?: number;
  completed_at?: number;
  paused_at?: number;
  error?: string;
  stopped_at?: number;
  completed_segments?: number;
  total_segments?: number;
}

export interface IndexingStatusResult {
  success: boolean;
  data?: IndexingStatus[];
  error?: string;
}

/**
 * CSV BlobをDify APIにアップロードするServer Action
 *
 * @param csvBlob - アップロードするCSV Blob
 * @param fileName - ファイル名（デフォルト: "cases.csv"）
 * @returns アップロード結果（成功/失敗、メッセージ、ドキュメントID、バッチID）
 * @throws 環境変数が設定されていない場合やAPIリクエストが失敗した場合にエラーを返す
 */
export async function uploadCsvBlob(
  csvBlob: Blob,
  fileName = "cases.csv"
): Promise<UploadResult> {
  // 環境変数をサーバーサイドで取得（NEXT_PUBLIC_プレフィックスなし）
  const apiKey = process.env.DIFY_API_KEY;
  const datasetId = process.env.DIFY_DATASET_ID;
  const baseUrl = process.env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";
  const defaultDocForm = process.env.DIFY_DOC_FORM || "qa_model";

  if (!apiKey || !datasetId) {
    return {
      success: false,
      message: "環境変数が設定されていません。.env.localファイルを確認してください。",
    };
  }

  try {
    // FormDataを作成
    const uploadFormData = new FormData();

    // dataフィールド: JSON文字列として設定
    const dataConfig = {
      indexing_technique: "high_quality",
      doc_form: defaultDocForm,
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

    // fileフィールド: CSV BlobをFileオブジェクトとして追加
    const csvFile = new File([csvBlob], fileName, { type: "text/csv" });
    uploadFormData.append("file", csvFile);

    // APIリクエストを送信
    const response = await fetch(`${baseUrl}/datasets/${datasetId}/document/create-by-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage =
        errorData.message || `アップロードに失敗しました: ${response.status} ${response.statusText}`;

      // doc_formエラーの場合、より詳細な情報を提供
      if (errorMessage.includes("doc_form")) {
        errorMessage += `\n\n現在の設定: doc_form="${defaultDocForm}"\nデータセットのdoc_formと一致しているか確認してください。\n一般的な値: "text_model", "qa_model", "book"`;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: `アップロードが成功しました！ドキュメントID: ${result.document?.id || "N/A"}`,
      documentId: result.document?.id,
      batch: result.batch,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "アップロード中にエラーが発生しました",
    };
  }
}

/**
 * CSVファイルをDify APIにアップロードするServer Action（既存の関数、後方互換性のため保持）
 *
 * @param formData - アップロードするファイルを含むFormDataオブジェクト
 * @returns アップロード結果（成功/失敗、メッセージ、ドキュメントID、バッチID）
 * @throws 環境変数が設定されていない場合やAPIリクエストが失敗した場合にエラーを返す
 */
export async function uploadCsvFile(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const docForm = formData.get("docForm") as string | null;

  if (!file) {
    return {
      success: false,
      message: "ファイルを選択してください",
    };
  }

  // CSVファイルかチェック
  if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
    return {
      success: false,
      message: "CSVファイルを選択してください",
    };
  }

  // 環境変数をサーバーサイドで取得（NEXT_PUBLIC_プレフィックスなし）
  const apiKey = process.env.DIFY_API_KEY;
  const datasetId = process.env.DIFY_DATASET_ID;
  const baseUrl = process.env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";
  const defaultDocForm = process.env.DIFY_DOC_FORM || "qa_model";

  if (!apiKey || !datasetId) {
    return {
      success: false,
      message: "環境変数が設定されていません。.env.localファイルを確認してください。",
    };
  }

  try {
    // FormDataを作成
    const uploadFormData = new FormData();

    // dataフィールド: JSON文字列として設定
    const dataConfig = {
      indexing_technique: "high_quality",
      doc_form: docForm || defaultDocForm,
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

    // fileフィールド: CSVファイルを追加
    uploadFormData.append("file", file);

    // APIリクエストを送信
    const response = await fetch(`${baseUrl}/datasets/${datasetId}/document/create-by-file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage =
        errorData.message || `アップロードに失敗しました: ${response.status} ${response.statusText}`;

      // doc_formエラーの場合、より詳細な情報を提供
      if (errorMessage.includes("doc_form")) {
        errorMessage += `\n\n現在の設定: doc_form="${docForm || defaultDocForm}"\nデータセットのdoc_formと一致しているか確認してください。\n一般的な値: "text_model", "qa_model", "book"`;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: `アップロードが成功しました！ドキュメントID: ${result.document?.id || "N/A"}`,
      documentId: result.document?.id,
      batch: result.batch,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "アップロード中にエラーが発生しました",
    };
  }
}

/**
 * ドキュメントのインデックス化進捗状況を取得するServer Action
 *
 * @param batch - ドキュメント作成時に返されたバッチID
 * @returns インデックス化ステータスの結果（成功/失敗、ステータスデータ、エラーメッセージ）
 * @throws 環境変数が設定されていない場合やAPIリクエストが失敗した場合にエラーを返す
 */
export async function getIndexingStatus(
  batch: string
): Promise<IndexingStatusResult> {
  const apiKey = process.env.DIFY_API_KEY;
  const datasetId = process.env.DIFY_DATASET_ID;
  const baseUrl = process.env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";

  if (!apiKey || !datasetId) {
    return {
      success: false,
      error: "環境変数が設定されていません",
    };
  }

  try {
    const response = await fetch(
      `${baseUrl}/datasets/${datasetId}/documents/${batch}/indexing-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message ||
          `ステータス取得に失敗しました: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "ステータス取得中にエラーが発生しました",
    };
  }
}

