"use client";

import { useEffect } from "react";
import { getIndexingStatus, type IndexingStatus } from "../actions/upload";

interface UseIndexingStatusProps {
  batch: string | null;
  isIndexing: boolean;
  onStatusUpdate: (status: IndexingStatus | null) => void;
  onComplete: (status: IndexingStatus) => void;
  onError: (error: string) => void;
}

export function useIndexingStatus({
  batch,
  isIndexing,
  onStatusUpdate,
  onComplete,
  onError,
}: UseIndexingStatusProps) {
  useEffect(() => {
    if (!batch || !isIndexing) return;

    const pollStatus = async () => {
      const result = await getIndexingStatus(batch);

      if (result.success && result.data && result.data.length > 0) {
        const status = result.data[0];
        onStatusUpdate(status);

        // 完了またはエラーでポーリングを停止
        if (
          status.indexing_status === "completed" ||
          status.indexing_status === "error" ||
          status.error
        ) {
          if (status.indexing_status === "completed") {
            onComplete(status);
          } else if (status.error) {
            onError(`インデックス化中にエラーが発生しました: ${status.error}`);
          }
        }
      } else if (result.error) {
        onError(`進捗状況の取得に失敗しました: ${result.error}`);
      }
    };

    // 初回実行
    pollStatus();

    // 2秒ごとにポーリング
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [batch, isIndexing, onStatusUpdate, onComplete, onError]);
}

