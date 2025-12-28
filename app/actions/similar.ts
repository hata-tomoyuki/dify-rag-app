"use server";

import { FindSimilarCasesUseCase } from "@/lib/usecases/similar/FindSimilarCasesUseCase";
import type { FindSimilarCasesResult, SimilarCaseInput } from "@/lib/usecases/similar/FindSimilarCasesUseCase";

// 型定義をエクスポート
export type { SimilarCaseInput, SimilarCase, FindSimilarCasesResult } from "@/lib/usecases/similar/FindSimilarCasesUseCase";

/**
 * 類似案件を検索するServer Action
 *
 * @param input - 新規案件情報
 * @returns 類似案件検索結果（成功/失敗、データ、エラーメッセージ）
 */
export async function findSimilarCases(input: SimilarCaseInput): Promise<FindSimilarCasesResult> {
  const useCase = new FindSimilarCasesUseCase();
  return await useCase.execute(input);
}

