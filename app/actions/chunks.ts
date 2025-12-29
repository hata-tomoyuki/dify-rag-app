"use server";

import { GenerateCaseChunksUseCase } from "@/lib/usecases/chunks/GenerateCaseChunksUseCase";
import { CaseRepository } from "@/lib/repositories/CaseRepository";
import type { GenerateChunksResult } from "@/lib/usecases/chunks/GenerateCaseChunksUseCase";

/**
 * 指定された案件のチャンクを生成するServer Action
 *
 * @param caseId - 案件ID（UUID）
 * @returns チャンク生成結果（成功/失敗、作成されたチャンク数、エラーメッセージ）
 */
export async function generateChunksForCase(caseId: string): Promise<GenerateChunksResult> {
  try {
    const caseRepository = new CaseRepository();
    const caseData = await caseRepository.findById(caseId);

    if (!caseData) {
      return {
        success: false,
        error: "案件が見つかりませんでした",
      };
    }

    const useCase = new GenerateCaseChunksUseCase();
    return await useCase.execute(caseData);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "チャンク生成に失敗しました",
    };
  }
}

/**
 * 全案件のチャンクを生成するServer Action
 *
 * @returns チャンク生成結果（成功/失敗、作成されたチャンク数、エラーメッセージ）
 */
export async function generateChunksForAllCases(): Promise<GenerateChunksResult & { processedCases?: number }> {
  try {
    const caseRepository = new CaseRepository();
    const caseSummaries = await caseRepository.findMany();

    if (caseSummaries.length === 0) {
      return {
        success: false,
        error: "案件が登録されていません",
      };
    }

    const useCase = new GenerateCaseChunksUseCase();
    let totalChunksCreated = 0;
    let processedCases = 0;
    const errors: string[] = [];

    // 各案件の完全なデータを取得してチャンク生成
    for (const caseSummary of caseSummaries) {
      const caseData = await caseRepository.findById(caseSummary.id);
      if (!caseData) {
        errors.push(`${caseSummary.title}: 案件が見つかりませんでした`);
        continue;
      }

      const result = await useCase.execute(caseData);
      if (result.success) {
        totalChunksCreated += result.chunksCreated || 0;
        processedCases++;
      } else {
        errors.push(`${caseSummary.title}: ${result.error || "チャンク生成に失敗しました"}`);
      }
    }

    if (errors.length > 0 && processedCases === 0) {
      return {
        success: false,
        error: `すべての案件でチャンク生成に失敗しました: ${errors.join(", ")}`,
      };
    }

    return {
      success: true,
      chunksCreated: totalChunksCreated,
      processedCases,
      error: errors.length > 0 ? `一部の案件でエラーが発生しました: ${errors.join(", ")}` : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "チャンク生成に失敗しました",
    };
  }
}

