"use client";

interface MessageDisplayProps {
  message: { type: "success" | "error"; text: string };
}

/**
 * 成功/エラーメッセージを表示するコンポーネント
 *
 * @param props - MessageDisplayProps
 * @param props.message - 表示するメッセージ（タイプとテキスト）
 * @returns メッセージを表示するコンポーネント（成功は緑、エラーは赤で表示）
 */
export function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        message.type === "success"
          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      }`}
    >
      <p className="text-sm font-medium whitespace-pre-line">{message.text}</p>
    </div>
  );
}

