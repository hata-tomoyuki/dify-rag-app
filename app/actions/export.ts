"use server";

import { prisma } from "@/lib/prisma";

/**
 * CSV形式の文字列をエスケープする
 *
 * @param value - エスケープする値
 * @returns エスケープされたCSV値
 */
function escapeCsvValue(value: string): string {
  // 値にカンマ、改行、ダブルクォートが含まれる場合はダブルクォートで囲む
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    // ダブルクォートを2つにエスケープ
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Caseテーブルから全データを取得し、CSV形式の文字列を生成するServer Action
 *
 * @returns CSV形式の文字列（UTF-8 BOM付き）
 */
export async function exportCasesToCsv(): Promise<{ success: boolean; csv?: string; error?: string }> {
  try {
    // Caseテーブルから全データを取得
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (cases.length === 0) {
      return {
        success: false,
        error: "エクスポートする案件がありません",
      };
    }

    // CSVヘッダー
    const headers = ["案件ID", "顧客", "課題", "対応"];
    const csvRows: string[] = [headers.join(",")];

    // CSVデータ行を生成
    for (const caseData of cases) {
      const row = [
        escapeCsvValue(caseData.id),
        escapeCsvValue(caseData.customer),
        escapeCsvValue(caseData.issue),
        escapeCsvValue(caseData.response),
      ];
      csvRows.push(row.join(","));
    }

    // UTF-8 BOM付きでCSV文字列を生成
    const csvContent = csvRows.join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM
    const csvWithBom = bom + csvContent;

    return {
      success: true,
      csv: csvWithBom,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "CSVの生成に失敗しました",
    };
  }
}

