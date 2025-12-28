import type { Case } from "@/lib/usecases/types";

/**
 * CsvService
 * CSV生成に関するビジネスロジックを提供
 */
export class CsvService {
  /**
   * CSV形式の文字列をエスケープする
   */
  escapeCsvValue(value: string): string {
    // 値にカンマ、改行、ダブルクォートが含まれる場合はダブルクォートで囲む
    if (value.includes(",") || value.includes("\n") || value.includes('"')) {
      // ダブルクォートを2つにエスケープ
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * 案件データの配列をCSV形式の文字列に変換する
   */
  generateCsv(cases: Case[]): string {
    if (cases.length === 0) {
      throw new Error("エクスポートする案件がありません");
    }

    // CSVヘッダー
    const headers = ["案件ID", "顧客", "課題", "対応"];
    const csvRows: string[] = [headers.join(",")];

    // CSVデータ行を生成
    for (const caseData of cases) {
      const row = [
        this.escapeCsvValue(caseData.id),
        this.escapeCsvValue(caseData.customer),
        this.escapeCsvValue(caseData.issue),
        this.escapeCsvValue(caseData.response),
      ];
      csvRows.push(row.join(","));
    }

    // UTF-8 BOM付きでCSV文字列を生成
    const csvContent = csvRows.join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM
    return bom + csvContent;
  }
}

