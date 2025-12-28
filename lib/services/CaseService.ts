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
    // 必須フィールドのチェック
    if (!input.title?.trim()) {
      return { isValid: false, error: "案件名は必須項目です" };
    }
    if (!input.clientName?.trim()) {
      return { isValid: false, error: "クライアント名は必須項目です" };
    }
    if (!input.industry?.trim()) {
      return { isValid: false, error: "業種は必須項目です" };
    }
    if (!input.companySize?.trim()) {
      return { isValid: false, error: "規模は必須項目です" };
    }
    if (input.budgetMin === undefined || input.budgetMin === null) {
      return { isValid: false, error: "予算最小値は必須項目です" };
    }
    if (input.budgetMax === undefined || input.budgetMax === null) {
      return { isValid: false, error: "予算最大値は必須項目です" };
    }
    if (input.budgetMin > input.budgetMax) {
      return { isValid: false, error: "予算最小値は予算最大値以下である必要があります" };
    }
    if (!input.goals || input.goals.length === 0) {
      return { isValid: false, error: "目的は最低1つ以上必要です" };
    }
    if (!input.challenges || input.challenges.length === 0) {
      return { isValid: false, error: "課題は最低1つ以上必要です" };
    }
    if (!input.proposal || input.proposal.length === 0) {
      return { isValid: false, error: "提案要点は最低1つ以上必要です" };
    }
    if (!input.stack || input.stack.length === 0) {
      return { isValid: false, error: "技術スタックは最低1つ以上必要です" };
    }
    if (input.durationWeeks === undefined || input.durationWeeks === null || input.durationWeeks <= 0) {
      return { isValid: false, error: "期間（週）は1以上の数値である必要があります" };
    }
    if (!input.deliverables || input.deliverables.length === 0) {
      return { isValid: false, error: "成果物は最低1つ以上必要です" };
    }
    if (!input.result?.trim()) {
      return { isValid: false, error: "成果は必須項目です" };
    }
    if (!input.lessonsLearned || input.lessonsLearned.length === 0) {
      return { isValid: false, error: "反省・注意点は最低1つ以上必要です" };
    }

    return { isValid: true };
  }

  /**
   * 入力データを整形する（前後の空白を削除）
   */
  sanitizeCreateInput(input: CreateCaseInput): CreateCaseInput {
    return {
      title: input.title.trim(),
      clientName: input.clientName.trim(),
      industry: input.industry.trim(),
      companySize: input.companySize.trim(),
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      goals: input.goals.map((g) => g.trim()).filter((g) => g.length > 0),
      challenges: input.challenges.map((c) => c.trim()).filter((c) => c.length > 0),
      proposal: input.proposal.map((p) => p.trim()).filter((p) => p.length > 0),
      stack: input.stack.map((s) => s.trim()).filter((s) => s.length > 0),
      durationWeeks: input.durationWeeks,
      deliverables: input.deliverables.map((d) => d.trim()).filter((d) => d.length > 0),
      result: input.result.trim(),
      lessonsLearned: input.lessonsLearned.map((l) => l.trim()).filter((l) => l.length > 0),
    };
  }

  /**
   * 更新用の入力データを整形する（前後の空白を削除）
   */
  sanitizeUpdateInput(input: UpdateCaseInput): UpdateCaseInput {
    const sanitized: UpdateCaseInput = {};

    if (input.title !== undefined) sanitized.title = input.title.trim();
    if (input.clientName !== undefined) sanitized.clientName = input.clientName.trim();
    if (input.industry !== undefined) sanitized.industry = input.industry.trim();
    if (input.companySize !== undefined) sanitized.companySize = input.companySize.trim();
    if (input.budgetMin !== undefined) sanitized.budgetMin = input.budgetMin;
    if (input.budgetMax !== undefined) sanitized.budgetMax = input.budgetMax;
    if (input.goals !== undefined) {
      sanitized.goals = input.goals.map((g) => g.trim()).filter((g) => g.length > 0);
    }
    if (input.challenges !== undefined) {
      sanitized.challenges = input.challenges.map((c) => c.trim()).filter((c) => c.length > 0);
    }
    if (input.proposal !== undefined) {
      sanitized.proposal = input.proposal.map((p) => p.trim()).filter((p) => p.length > 0);
    }
    if (input.stack !== undefined) {
      sanitized.stack = input.stack.map((s) => s.trim()).filter((s) => s.length > 0);
    }
    if (input.durationWeeks !== undefined) sanitized.durationWeeks = input.durationWeeks;
    if (input.deliverables !== undefined) {
      sanitized.deliverables = input.deliverables.map((d) => d.trim()).filter((d) => d.length > 0);
    }
    if (input.result !== undefined) sanitized.result = input.result.trim();
    if (input.lessonsLearned !== undefined) {
      sanitized.lessonsLearned = input.lessonsLearned.map((l) => l.trim()).filter((l) => l.length > 0);
    }

    return sanitized;
  }
}

