"use client";

import { useState, useCallback } from "react";
import { uploadCsvFile, type IndexingStatus } from "./actions/upload";
import { FileInput } from "./components/FileInput";
import { UploadButton } from "./components/UploadButton";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { MessageDisplay } from "./components/MessageDisplay";
import { useIndexingStatus } from "./hooks/useIndexingStatus";

/**
 * CSVファイルアップロードページのメインコンポーネント
 *
 * @returns CSVファイルのアップロードとインデックス化進捗を管理するページコンポーネント
 */
export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string | null>(null);

  /**
   * ファイル選択時のハンドラー
   * CSVファイルかどうかを検証し、選択されたファイルを状態に保存する
   *
   * @param e - ファイル入力の変更イベント
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // CSVファイルかチェック
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setMessage(null);
      } else {
        setMessage({ type: "error", text: "CSVファイルを選択してください" });
        setSelectedFile(null);
      }
    }
  }, []);

  /**
   * ファイルアップロード処理のハンドラー
   * 選択されたCSVファイルをDify APIにアップロードし、進捗監視を開始する
   *
   * @throws ファイルが選択されていない場合やアップロードが失敗した場合にエラーを表示
   */
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "ファイルを選択してください" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await uploadCsvFile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "ファイルのアップロードが完了しました。インデックス化を開始します...",
        });

        // バッチIDを保存して進捗監視を開始
        if (result.batch) {
          setCurrentBatch(result.batch);
          setIsIndexing(true);
          setIndexingStatus(null);
        } else {
          setMessage({
            type: "success",
            text: result.message,
          });
        }

        setSelectedFile(null);
        // ファイル入力もリセット
        const fileInput = document.getElementById("csv-file-input") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        setMessage({
          type: "error",
          text: result.message,
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
  }, [selectedFile]);

  /**
   * インデックス化完了時のハンドラー
   * 進捗監視を停止し、成功メッセージを表示する
   *
   * @param status - 完了したインデックス化ステータス
   */
  const handleIndexingComplete = useCallback((status: IndexingStatus) => {
    setIsIndexing(false);
    setMessage({
      type: "success",
      text: `インデックス化が完了しました！ドキュメントID: ${status.id}`,
    });
    setCurrentBatch(null);
  }, []);

  /**
   * インデックス化エラー時のハンドラー
   * 進捗監視を停止し、エラーメッセージを表示する
   *
   * @param error - エラーメッセージ
   */
  const handleIndexingError = useCallback((error: string) => {
    setIsIndexing(false);
    setMessage({
      type: "error",
      text: error,
    });
    setCurrentBatch(null);
  }, []);

  // 進捗状況をポーリング
  useIndexingStatus({
    batch: currentBatch,
    isIndexing,
    onStatusUpdate: setIndexingStatus,
    onComplete: handleIndexingComplete,
    onError: handleIndexingError,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-16 px-8 bg-white dark:bg-black">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-4">
              CSVファイルアップロード
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              DifyナレッジベースにCSVファイルをアップロードします
            </p>
          </div>

          <div className="space-y-6">
            <FileInput
              selectedFile={selectedFile}
              onChange={handleFileChange}
              disabled={isUploading || isIndexing}
            />

            <UploadButton
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isIndexing}
              isLoading={isUploading || isIndexing}
            />

            {isIndexing && indexingStatus && <ProgressIndicator status={indexingStatus} />}

            {message && <MessageDisplay message={message} />}
          </div>
        </div>
      </main>
    </div>
  );
}
