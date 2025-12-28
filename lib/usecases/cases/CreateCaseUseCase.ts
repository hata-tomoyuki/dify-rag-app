import { CaseRepository } from "@/lib/repositories/CaseRepository";
import { CaseService } from "@/lib/services/CaseService";
import type { CreateCaseInput, CaseResult } from "@/lib/usecases/types";

/**
 * CreateCaseUseCase
 * 案件作成のユースケース
 */
export class CreateCaseUseCase {
  private caseRepository: CaseRepository;
  private caseService: CaseService;

  constructor() {
    this.caseRepository = new CaseRepository();
    this.caseService = new CaseService();
  }

  async execute(input: CreateCaseInput): Promise<CaseResult> {
    try {
      // バリデーション
      const validation = this.caseService.validateCreateInput(input);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // データ整形
      const sanitizedInput = this.caseService.sanitizeCreateInput(input);

      // 案件作成
      const newCase = await this.caseRepository.create(sanitizedInput);

      return {
        success: true,
        data: newCase,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "案件の作成に失敗しました",
      };
    }
  }
}

