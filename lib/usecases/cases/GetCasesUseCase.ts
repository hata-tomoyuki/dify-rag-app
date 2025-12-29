import { CaseRepository } from "@/lib/repositories/CaseRepository";
import type { CaseSummariesResult } from "@/lib/usecases/types";

/**
 * GetCasesUseCase
 * 案件一覧取得のユースケース（一覧表示用のサマリー情報のみ）
 */
export class GetCasesUseCase {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async execute(): Promise<CaseSummariesResult> {
    try {
      const cases = await this.caseRepository.findMany();

      return {
        success: true,
        data: cases,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "案件一覧の取得に失敗しました",
      };
    }
  }
}

