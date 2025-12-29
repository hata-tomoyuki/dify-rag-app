"use client";

import Link from "next/link";
import type { CaseSummary } from "@/app/actions/cases";

interface CaseCardProps {
  caseData: CaseSummary;
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
      className="block p-4 bg-white border border-zinc-300 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-zinc-900 line-clamp-1">{caseData.title}</h3>
        <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{formatDate(caseData.updatedAt)}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span className="font-semibold">{caseData.clientName}</span>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold">{caseData.industry}</span>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold">{caseData.companySize}人</span>
        </div>
        <div className="flex">
          <p className="text-sm font-semibold text-zinc-700 mb-1">目的：</p>
          <p className="text-sm text-zinc-600 line-clamp-1">{caseData.goals.join(", ")}</p>
        </div>
        <div className="flex">
          <p className="text-sm font-semibold text-zinc-700 mb-1">技術スタック：</p>
          <p className="text-sm text-zinc-600 line-clamp-1">{caseData.stack.join(", ")}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex">
            <p className="text-xs font-semibold text-zinc-700 mb-1">予算：</p>
            <p className="text-xs text-zinc-600 line-clamp-1">{caseData.budgetMin.toLocaleString()}〜{caseData.budgetMax.toLocaleString()}円</p>
          </div>
          <div className="flex">
            <p className="text-xs font-semibold text-zinc-700 mb-1">期間：</p>
            <p className="text-xs text-zinc-600 line-clamp-1">{caseData.durationWeeks}週</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

