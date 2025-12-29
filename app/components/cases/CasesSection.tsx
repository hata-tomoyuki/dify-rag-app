"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { generateChunksForAllCases } from "@/app/actions/chunks";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { CaseList } from "./CaseList";
import type { Case } from "@/app/actions/cases";

/**
 * 案件一覧セクションコンポーネント
 *
 * @returns 案件一覧を表示するコンポーネント
 */
export function CasesSection({cases}: {cases: Case[]}) {
  const { data: session } = useSession();
  // サーバーコンポーネントからデータを受け取っているため、読み込み完了とする
  const [isGeneratingChunks, setIsGeneratingChunks] = useState(false);
  const [chunkMessage, setChunkMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleGenerateChunksForAll = async () => {
    setIsGeneratingChunks(true);
    setError(null);
    setChunkMessage(null);
    // モーダルは開いたままにする

    const result = await generateChunksForAllCases();

    if (result.success) {
      const processedInfo = result.processedCases
        ? `${result.processedCases}件の案件を処理し、`
        : "";
      const chunksInfo = result.chunksCreated ? `${result.chunksCreated}個のチャンク` : "チャンク";
      setChunkMessage(`${processedInfo}${chunksInfo}が作成されました。${result.error || ""}`);
    } else {
      setError(result.error || "チャンク生成に失敗しました");
    }

    setIsGeneratingChunks(false);
    // 処理完了後にモーダルを閉じる
    setShowConfirmModal(false);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={showConfirmModal}
        title="案件ナレッジを一括更新"
        message="全案件のチャンクを生成しますか？この処理には時間がかかる場合があります。個別の案件ごとにナレッジを更新することも可能です。"
        confirmLabel="実行"
        cancelLabel="キャンセル"
        isLoading={isGeneratingChunks}
        loadingMessage="更新中..."
        onConfirm={handleGenerateChunksForAll}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <h2 className="text-2xl font-semibold text-black">過去の案件一覧</h2>
        <div className="flex gap-2">
          {session?.user ? (
            <>
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isGeneratingChunks || cases.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingChunks ? "一括更新中..." : "案件ナレッジを一括更新"}
              </button>
              <Link
                href="/cases/new"
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
              >
                案件を登録
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
            >
              ログインして案件を管理
            </Link>
          )}
        </div>
      </div>

      {chunkMessage && (
        <div className="p-4 rounded-lg bg-green-50 text-green-800">
          <p className="text-sm font-medium">{chunkMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <CaseList cases={cases} />
    </div>
  );
}

