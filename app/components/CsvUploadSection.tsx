"use client";

import { useState, useCallback } from "react";
import { uploadCsvBlob, type IndexingStatus } from "../actions/upload";
import { exportCasesToCsv } from "../actions/export";
import { UploadButton } from "./UploadButton";
import { ProgressIndicator } from "./ProgressIndicator";
import { MessageDisplay } from "./MessageDisplay";
import { useIndexingStatus } from "../hooks/useIndexingStatus";

/**
 * CSVアップロードセクションコンポーネント
 * CaseテーブルからCSVを生成してDifyにアップロードする機能を提供
 *
 * @returns CSV生成とアップロード、インデックス化進捗を管理するコンポーネント
 */
export function CsvUploadSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string | null>(null);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    setMessage(null);

    try {
      // 1. CaseテーブルからCSVを生成
      const exportResult = await exportCasesToCsv();

      if (!exportResult.success || !exportResult.csv) {
        setMessage({
          type: "error",
          text: exportResult.error || "CSVの生成に失敗しました",
        });
        setIsUploading(false);
        return;
      }

      // 2. CSV文字列をBlobに変換
      const csvBlob = new Blob([exportResult.csv], { type: "text/csv;charset=utf-8;" });

      // 3. Dify APIにアップロード
      const uploadResult = await uploadCsvBlob(csvBlob, "cases.csv");

      if (uploadResult.success) {
        setMessage({
          type: "success",
          text: "ファイルのアップロードが完了しました。インデックス化を開始します...",
        });

        if (uploadResult.batch) {
          setCurrentBatch(uploadResult.batch);
          setIsIndexing(true);
          setIndexingStatus(null);
        } else {
          setMessage({
            type: "success",
            text: uploadResult.message,
          });
        }
      } else {
        setMessage({
          type: "error",
          text: uploadResult.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "アップロード中にエラーが発生しました",
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleIndexingComplete = useCallback((status: IndexingStatus) => {
    setIsIndexing(false);
    setMessage({
      type: "success",
      text: `インデックス化が完了しました！ドキュメントID: ${status.id}`,
    });
    setCurrentBatch(null);
  }, []);

  const handleIndexingError = useCallback((error: string) => {
    setIsIndexing(false);
    setMessage({
      type: "error",
      text: error,
    });
    setCurrentBatch(null);
  }, []);

  useIndexingStatus({
    batch: currentBatch,
    isIndexing,
    onStatusUpdate: setIndexingStatus,
    onComplete: handleIndexingComplete,
    onError: handleIndexingError,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-2">Difyへのアップロード</h3>
        <p className="text-sm text-zinc-600 mb-4">
          Caseテーブルの全データをCSV形式に変換してDifyにアップロードします。
        </p>

        <UploadButton
          onClick={handleUpload}
          disabled={isUploading || isIndexing}
          isLoading={isUploading || isIndexing}
        />
      </div>

      {isIndexing && indexingStatus && <ProgressIndicator status={indexingStatus} />}

      {message && <MessageDisplay message={message} />}
    </div>
  );
}

