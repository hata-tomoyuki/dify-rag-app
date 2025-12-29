"use client";

import { useState, useEffect } from "react";
import { CaseCard } from "./CaseCard";
import { getCasesPaginated } from "@/app/actions/cases";
import type { CaseSummary } from "@/app/actions/cases";

interface CaseListProps {
  pageSize?: number;
}

/**
 * 案件一覧表示コンポーネント（ページネーション対応）
 *
 * @param props - CaseListProps
 * @param props.pageSize - 1ページあたりの件数（デフォルト: 10）
 * @returns 案件一覧をグリッド形式で表示するコンポーネント
 */
export function CaseList({ pageSize = 10 }: CaseListProps) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getCasesPaginated(currentPage, pageSize);
        if (result.success && result.data) {
          setCases(result.data);
          setTotalPages(result.totalPages || 0);
          setTotal(result.total || 0);
        } else {
          setError(result.error || "案件の取得に失敗しました");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "案件の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600">案件がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前へ
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // 現在のページ周辺と最初・最後のページを表示
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                );
              })
              .map((page, index, array) => {
                // 前のページとの間に省略記号を挿入
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-2 text-zinc-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            次へ
          </button>
        </div>
      )}

      {total > 0 && (
        <div className="text-center text-sm text-zinc-600 mt-4">
          {total}件中 {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)}件を表示
        </div>
      )}
    </div>
  );
}

