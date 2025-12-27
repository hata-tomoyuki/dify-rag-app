"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCases } from "@/app/actions/cases";
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
        <div>
          <h2 className="text-2xl font-semibold text-black mb-2">案件一覧</h2>
          <p className="text-zinc-600">登録されている案件を確認・管理できます</p>
        </div>
        <Link
          href="/cases/new"
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
        >
          新規作成
        </Link>
      </div>

      <CaseList cases={cases} />
    </div>
  );
}

