"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
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
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
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
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen w-screen"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
        <p className="text-sm text-zinc-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 text-zinc-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

