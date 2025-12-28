import { CaseRepository } from "@/lib/repositories/CaseRepository";
import { CsvService } from "@/lib/services/CsvService";
import type { ExportCsvResult } from "@/lib/usecases/types";

/**
 * ExportCasesToCsvUseCase
 * CSVエクスポートのユースケース
 */
export class ExportCasesToCsvUseCase {
  private caseRepository: CaseRepository;
  private csvService: CsvService;

  constructor() {
    this.caseRepository = new CaseRepository();
    this.csvService = new CsvService();
  }

  async execute(): Promise<ExportCsvResult> {
    try {
      // 案件データを取得（作成日時の昇順）
      const cases = await this.caseRepository.findMany();

      // 作成日時の昇順にソート
      const sortedCases = [...cases].sort((a, b) =>
        a.createdAt.getTime() - b.createdAt.getTime()
      );

      // CSV生成
      const csv = this.csvService.generateCsv(sortedCases);

      return {
        success: true,
        csv,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "CSVの生成に失敗しました",
      };
    }
  }
}

