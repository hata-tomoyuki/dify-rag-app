import { CaseRepository } from "@/lib/repositories/CaseRepository";
import { CaseService } from "@/lib/services/CaseService";
import type { UpdateCaseInput, CaseResult } from "@/lib/usecases/types";

/**
 * UpdateCaseUseCase
 * 案件更新のユースケース
 */
export class UpdateCaseUseCase {
  private caseRepository: CaseRepository;
  private caseService: CaseService;

  constructor() {
    this.caseRepository = new CaseRepository();
    this.caseService = new CaseService();
  }

  async execute(id: string, input: UpdateCaseInput): Promise<CaseResult> {
    try {
      // データ整形
      const sanitizedInput = this.caseService.sanitizeUpdateInput(input);

      // 案件更新
      const updatedCase = await this.caseRepository.update(id, sanitizedInput);

      return {
        success: true,
        data: updatedCase,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "案件の更新に失敗しました",
      };
    }
  }
}

