"use client";

interface FileInputProps {
  selectedFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * CSVファイル選択用の入力コンポーネント
 *
 * @param props - FileInputProps
 * @param props.selectedFile - 現在選択されているファイル
 * @param props.onChange - ファイル選択変更時のコールバック関数
 * @param props.disabled - 入力フィールドを無効化するかどうか
 * @returns ファイル選択入力と選択されたファイル情報を表示するコンポーネント
 */
export function FileInput({ selectedFile, onChange, disabled }: FileInputProps) {
  return (
    <div>
      <input
        id="csv-file-input"
        type="file"
        accept=".csv,text/csv"
        onChange={onChange}
        disabled={disabled}
        className="block w-full text-sm text-zinc-900
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-zinc-100 file:text-zinc-700
          hover:file:bg-zinc-200
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {selectedFile && (
        <p className="mt-2 text-sm text-zinc-600">
          選択されたファイル: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
}

