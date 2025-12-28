import type { CreateCaseInput, UpdateCaseInput } from "@/lib/usecases/types";

/**
 * CaseService
 * 案件に関するビジネスロジックを提供
 */
export class CaseService {
  /**
   * 案件作成用の入力データをバリデーションする
   */
  validateCreateInput(input: CreateCaseInput): { isValid: boolean; error?: string } {
    if (!input.customer || !input.issue || !input.response) {
      return {
        isValid: false,
        error: "顧客、課題、対応は必須項目です",
      };
    }

    return { isValid: true };
  }

  /**
   * 入力データを整形する（前後の空白を削除）
   */
  sanitizeCreateInput(input: CreateCaseInput): CreateCaseInput {
    return {
      customer: input.customer.trim(),
      issue: input.issue.trim(),
      response: input.response.trim(),
    };
  }

  /**
   * 更新用の入力データを整形する（前後の空白を削除）
   */
  sanitizeUpdateInput(input: UpdateCaseInput): UpdateCaseInput {
    const sanitized: UpdateCaseInput = {};
    if (input.customer !== undefined) {
      sanitized.customer = input.customer.trim();
    }
    if (input.issue !== undefined) {
      sanitized.issue = input.issue.trim();
    }
    if (input.response !== undefined) {
      sanitized.response = input.response.trim();
    }
    return sanitized;
  }
}

