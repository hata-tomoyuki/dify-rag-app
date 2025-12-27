"use client";

import type { IndexingStatus } from "../actions/upload";

interface ProgressIndicatorProps {
  status: IndexingStatus;
}

export function ProgressIndicator({ status }: ProgressIndicatorProps) {
  const progressPercentage =
    status.total_segments && status.total_segments > 0
      ? ((status.completed_segments || 0) / status.total_segments) * 100
      : 0;

  return (
    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          インデックス化中...
        </p>
        <span className="text-xs text-blue-600 dark:text-blue-400">
          {status.indexing_status}
        </span>
      </div>
      {status.total_segments && status.total_segments > 0 && (
        <div className="mt-2">
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {status.completed_segments || 0} / {status.total_segments} セグメント完了
          </p>
        </div>
      )}
      {status.error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
          エラー: {status.error}
        </p>
      )}
    </div>
  );
}

