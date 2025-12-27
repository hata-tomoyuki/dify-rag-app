"use client";

import { CaseCard } from "./CaseCard";
import type { Case } from "@/app/actions/cases";

interface CaseListProps {
  cases: Case[];
}

/**
 * 案件一覧表示コンポーネント
 *
 * @param props - CaseListProps
 * @param props.cases - 表示する案件の配列
 * @returns 案件一覧をグリッド形式で表示するコンポーネント
 */
export function CaseList({ cases }: CaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600">案件がありません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cases.map((caseData) => (
        <CaseCard key={caseData.id} caseData={caseData} />
      ))}
    </div>
  );
}

