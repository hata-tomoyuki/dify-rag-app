"use client";

import Link from "next/link";
import type { SimilarCase } from "@/app/actions/similar";

interface SimilarCaseCardProps {
  similarCase: SimilarCase;
}

/**
 * 類似案件カード表示コンポーネント
 */
export function SimilarCaseCard({ similarCase }: SimilarCaseCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/cases/${similarCase.case.id}`} className="flex-1">
          <h4 className="text-lg font-semibold text-zinc-900 hover:text-zinc-700">
            {similarCase.case.title}
          </h4>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span className="font-semibold">{similarCase.case.clientName}</span>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold">{similarCase.case.industry}</span>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold">{similarCase.case.companySize}</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">類似理由</p>
          <p className="text-sm text-zinc-900">{similarCase.reason}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-700 mb-1">目的</p>
          <p className="text-sm text-zinc-900">{similarCase.case.goals.join(", ")}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <div className="flex">
            <p className="text-xs font-semibold text-zinc-700 mb-1">予算：</p>
            <p className="text-xs text-zinc-600">{similarCase.case.budgetMin.toLocaleString()}〜{similarCase.case.budgetMax.toLocaleString()}円</p>
          </div>
          <div className="flex">
            <p className="text-xs font-semibold text-zinc-700 mb-1">期間：</p>
            <p className="text-xs text-zinc-600">{similarCase.case.durationWeeks}週</p>
          </div>
        </div>
      </div>
    </div>
  );
}

