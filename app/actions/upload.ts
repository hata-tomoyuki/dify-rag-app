"use server";

import { UploadCsvToDifyUseCase } from "@/lib/usecases/csv/UploadCsvToDifyUseCase";
import { GetIndexingStatusUseCase } from "@/lib/usecases/csv/GetIndexingStatusUseCase";
import type {
  UploadResult,
  IndexingStatus,
  IndexingStatusResult,
} from "@/lib/usecases/types";

// 型定義をエクスポート（既存のコンポーネントとの互換性のため）
export type { UploadResult, IndexingStatus, IndexingStatusResult };

/**
 * CSV BlobをDify APIにアップロードするServer Action
 *
 * @param csvBlob - アップロードするCSV Blob
 * @param fileName - ファイル名（デフォルト: "cases.csv"）
 * @returns アップロード結果（成功/失敗、メッセージ、ドキュメントID、バッチID）
 */
export async function uploadCsvBlob(
  csvBlob: Blob,
  fileName = "cases.csv"
): Promise<UploadResult> {
  const useCase = new UploadCsvToDifyUseCase();
  return await useCase.execute(csvBlob, fileName);
}

/**
 * CSVファイルをDify APIにアップロードするServer Action（既存の関数、後方互換性のため保持）
 *
 * @param formData - アップロードするファイルを含むFormDataオブジェクト
 * @returns アップロード結果（成功/失敗、メッセージ、ドキュメントID、バッチID）
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

  const useCase = new UploadCsvToDifyUseCase();
  return await useCase.execute(file, file.name, docForm || undefined);
}

/**
 * ドキュメントのインデックス化進捗状況を取得するServer Action
 *
 * @param batch - ドキュメント作成時に返されたバッチID
 * @returns インデックス化ステータスの結果（成功/失敗、ステータスデータ、エラーメッセージ）
 */
export async function getIndexingStatus(
  batch: string
): Promise<IndexingStatusResult> {
  const useCase = new GetIndexingStatusUseCase();
  return await useCase.execute(batch);
}

