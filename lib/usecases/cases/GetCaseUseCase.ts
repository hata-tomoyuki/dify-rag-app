import { CaseRepository } from "@/lib/repositories/CaseRepository";
import type { CaseResult } from "@/lib/usecases/types";

/**
 * GetCaseUseCase
 * 案件取得のユースケース
 */
export class GetCaseUseCase {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async execute(id: string): Promise<CaseResult> {
    try {
      const caseData = await this.caseRepository.findById(id);

      if (!caseData) {
        return {
          success: false,
          error: "案件が見つかりませんでした",
        };
      }

      return {
        success: true,
        data: caseData,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "案件の取得に失敗しました",
      };
    }
  }
}

