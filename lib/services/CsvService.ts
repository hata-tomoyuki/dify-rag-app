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
   * 配列をCSV用の文字列に変換する（セミコロン区切り）
   */
  arrayToCsvString(array: string[]): string {
    return array.map((item) => this.escapeCsvValue(item)).join("; ");
  }

  /**
   * 案件データの配列をCSV形式の文字列に変換する
   */
  generateCsv(cases: Case[]): string {
    if (cases.length === 0) {
      throw new Error("エクスポートする案件がありません");
    }

    // CSVヘッダー
    const headers = [
      "案件ID",
      "案件名",
      "クライアント名",
      "業種",
      "規模",
      "予算最小値",
      "予算最大値",
      "目的",
      "課題",
      "提案要点",
      "技術スタック",
      "期間（週）",
      "成果物",
      "反省・注意点",
    ];
    const csvRows: string[] = [headers.join(",")];

    // CSVデータ行を生成
    for (const caseData of cases) {
      const row = [
        this.escapeCsvValue(caseData.id),
        this.escapeCsvValue(caseData.title),
        this.escapeCsvValue(caseData.clientName),
        this.escapeCsvValue(caseData.industry),
        this.escapeCsvValue(caseData.companySize),
        caseData.budgetMin.toString(),
        caseData.budgetMax.toString(),
        this.arrayToCsvString(caseData.goals),
        this.arrayToCsvString(caseData.challenges),
        this.arrayToCsvString(caseData.proposal),
        this.arrayToCsvString(caseData.stack),
        caseData.durationWeeks.toString(),
        this.arrayToCsvString(caseData.deliverables),
        this.arrayToCsvString(caseData.lessonsLearned),
      ];
      csvRows.push(row.join(","));
    }

    // UTF-8 BOM付きでCSV文字列を生成
    const csvContent = csvRows.join("\n");
    const bom = "\uFEFF"; // UTF-8 BOM
    return bom + csvContent;
  }
}

