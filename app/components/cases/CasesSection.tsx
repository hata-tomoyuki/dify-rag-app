"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCases } from "@/app/actions/cases";
import { generateChunksForAllCases } from "@/app/actions/chunks";
import { CaseList } from "./CaseList";
import type { Case } from "@/app/actions/cases";

/**
 * 案件一覧セクションコンポーネント
 *
 * @returns 案件一覧を表示するコンポーネント
 */
export function CasesSection() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingChunks, setIsGeneratingChunks] = useState(false);
  const [chunkMessage, setChunkMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCases();
      if (result.success && result.data) {
        setCases(result.data);
      } else {
        setError(result.error || "案件一覧の取得に失敗しました");
      }
      setIsLoading(false);
    };

    loadCases();
  }, []);

  const handleGenerateChunksForAll = async () => {
    if (!confirm("全案件のチャンクを生成しますか？この処理には時間がかかる場合があります。")) {
      return;
    }

    setIsGeneratingChunks(true);
    setError(null);
    setChunkMessage(null);

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
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">過去の案件一覧</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateChunksForAll}
            disabled={isGeneratingChunks || cases.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingChunks ? "更新中..." : "案件ナレッジを更新"}
          </button>
          <Link
            href="/cases/new"
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
          >
            案件を登録
          </Link>
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

