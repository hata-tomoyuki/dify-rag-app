"use client";

import { useState } from "react";
import { uploadCsvFile } from "./actions/upload";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleUpload = async () => {
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
          text: result.message,
        });
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
  };

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
            {/* ファイル選択 */}
            <div>
              <label
                htmlFor="csv-file-input"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                ファイルを選択
              </label>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full text-sm text-zinc-900 dark:text-zinc-100
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-zinc-100 file:text-zinc-700
                  hover:file:bg-zinc-200
                  dark:file:bg-zinc-800 dark:file:text-zinc-300
                  dark:hover:file:bg-zinc-700
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  選択されたファイル: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {/* アップロードボタン */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>アップロード中...</span>
                </>
              ) : (
                <span>アップロード</span>
              )}
            </button>

            {/* メッセージ表示 */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
