"use client";

import Link from "next/link";
import type { Case } from "@/app/actions/cases";

interface CaseCardProps {
  caseData: Case;
}

/**
 * 案件カード表示コンポーネント
 *
 * @param props - CaseCardProps
 * @param props.caseData - 表示する案件データ
 * @returns 案件情報をカード形式で表示するコンポーネント
 */
export function CaseCard({ caseData }: CaseCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Link
      href={`/cases/${caseData.id}`}
      className="block p-4 bg-white border border-zinc-200 rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-zinc-900">{caseData.customer}</h3>
        <span className="text-xs text-zinc-500">{formatDate(caseData.updatedAt)}</span>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-zinc-700 mb-1">課題</p>
          <p className="text-sm text-zinc-600 line-clamp-2">{caseData.issue}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-700 mb-1">対応</p>
          <p className="text-sm text-zinc-600 line-clamp-2">{caseData.response}</p>
        </div>
      </div>
    </Link>
  );
}

