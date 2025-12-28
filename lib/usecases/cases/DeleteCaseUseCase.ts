import { CaseRepository } from "@/lib/repositories/CaseRepository";

/**
 * DeleteCaseUseCase
 * 案件削除のユースケース
 */
export class DeleteCaseUseCase {
  private caseRepository: CaseRepository;

  constructor() {
    this.caseRepository = new CaseRepository();
  }

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.caseRepository.delete(id);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "案件の削除に失敗しました",
      };
    }
  }
}

