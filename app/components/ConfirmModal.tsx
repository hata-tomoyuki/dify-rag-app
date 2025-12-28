"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 確認モーダルコンポーネント
 *
 * @param props - ConfirmModalProps
 * @param props.isOpen - モーダルの表示状態
 * @param props.title - モーダルのタイトル
 * @param props.message - モーダルのメッセージ
 * @param props.confirmLabel - 確認ボタンのラベル（デフォルト: "実行"）
 * @param props.cancelLabel - キャンセルボタンのラベル（デフォルト: "キャンセル"）
 * @param props.onConfirm - 確認時のコールバック関数
 * @param props.onCancel - キャンセル時のコールバック関数
 * @returns 確認モーダルコンポーネント
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "実行",
  cancelLabel = "キャンセル",
  isLoading = false,
  loadingMessage = "処理中...",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // ESCキーで閉じる（処理中は無効化）
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // モーダル表示時にbodyのスクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen w-screen"
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
        {isLoading ? (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
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
              <p className="text-sm font-medium text-zinc-900">{loadingMessage}</p>
            </div>
            <p className="text-xs text-zinc-500">処理が完了するまでお待ちください...</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 mb-6">{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? loadingMessage : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

