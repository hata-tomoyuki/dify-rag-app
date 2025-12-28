"use server";

import { ExportCasesToCsvUseCase } from "@/lib/usecases/csv/ExportCasesToCsvUseCase";
import type { ExportCsvResult } from "@/lib/usecases/types";

/**
 * Caseテーブルから全データを取得し、CSV形式の文字列を生成するServer Action
 *
 * @returns CSV形式の文字列（UTF-8 BOM付き）
 */
export async function exportCasesToCsv(): Promise<ExportCsvResult> {
  const useCase = new ExportCasesToCsvUseCase();
  return await useCase.execute();
}

