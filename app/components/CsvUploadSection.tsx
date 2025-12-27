"use client";

import { useState, useCallback } from "react";
import { uploadCsvFile, type IndexingStatus } from "../actions/upload";
import { FileInput } from "./FileInput";
import { UploadButton } from "./UploadButton";
import { ProgressIndicator } from "./ProgressIndicator";
import { MessageDisplay } from "./MessageDisplay";
import { useIndexingStatus } from "../hooks/useIndexingStatus";

/**
 * CSVアップロードセクションコンポーネント
 *
 * @returns CSVファイルのアップロードとインデックス化進捗を管理するコンポーネント
 */
export function CsvUploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [indexingStatus, setIndexingStatus] = useState<IndexingStatus | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setMessage(null);
      } else {
        setMessage({ type: "error", text: "CSVファイルを選択してください" });
        setSelectedFile(null);
      }
    }
  }, []);

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
  );
}

