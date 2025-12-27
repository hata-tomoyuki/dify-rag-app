"use server";

interface UploadResult {
  success: boolean;
  message: string;
  documentId?: string;
}

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
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "アップロード中にエラーが発生しました",
    };
  }
}

