"use client";

interface FileInputProps {
  selectedFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function FileInput({ selectedFile, onChange, disabled }: FileInputProps) {
  return (
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
        onChange={onChange}
        disabled={disabled}
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
  );
}

