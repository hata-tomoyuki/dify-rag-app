import { CaseRepository } from "@/lib/repositories/CaseRepository";
import type { CasesResult } from "@/lib/usecases/types";

/**
 * GetCasesUseCase
 * 案件一覧取得のユースケース
 */
export class GetCasesUseCase {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async execute(): Promise<CasesResult> {
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

