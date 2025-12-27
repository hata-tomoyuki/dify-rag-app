"use client";

interface UploadButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

/**
 * ファイルアップロード用のボタンコンポーネント
 *
 * @param props - UploadButtonProps
 * @param props.onClick - ボタンクリック時のコールバック関数
 * @param props.disabled - ボタンを無効化するかどうか
 * @param props.isLoading - ローディング状態かどうか
 * @returns アップロードボタンコンポーネント（ローディング状態の表示を含む）
 */
export function UploadButton({ onClick, disabled, isLoading }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
    >
      {isLoading ? (
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
  );
}

