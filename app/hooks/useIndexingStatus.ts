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

/**
 * インデックス化進捗状況をポーリングするカスタムフック
 * 2秒間隔で進捗状況を取得し、完了またはエラー時に自動的に停止する
 *
 * @param props - UseIndexingStatusProps
 * @param props.batch - 進捗を監視するバッチID
 * @param props.isIndexing - インデックス化が進行中かどうか
 * @param props.onStatusUpdate - ステータス更新時のコールバック関数
 * @param props.onComplete - インデックス化完了時のコールバック関数
 * @param props.onError - エラー発生時のコールバック関数
 * @returns 進捗状況のポーリングを管理するフック
 */
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

