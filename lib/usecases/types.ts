/**
 * 共通型定義
 */

export interface Case {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  companySize: string;
  budgetMin: number;
  budgetMax: number;
  goals: string[];
  challenges: string[];
  proposal: string[];
  stack: string[];
  durationWeeks: number;
  deliverables: string[];
  result: string;
  lessonsLearned: string[];
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateCaseInput {
  title: string;
  clientName: string;
  industry: string;
  companySize: string;
  budgetMin: number;
  budgetMax: number;
  goals: string[];
  challenges: string[];
  proposal: string[];
  stack: string[];
  durationWeeks: number;
  deliverables: string[];
  result: string;
  lessonsLearned: string[];
}

export interface UpdateCaseInput {
  title?: string;
  clientName?: string;
  industry?: string;
  companySize?: string;
  budgetMin?: number;
  budgetMax?: number;
  goals?: string[];
  challenges?: string[];
  proposal?: string[];
  stack?: string[];
  durationWeeks?: number;
  deliverables?: string[];
  result?: string;
  lessonsLearned?: string[];
}

export interface CaseResult {
  success: boolean;
  data?: Case;
  error?: string;
}

/**
 * 案件一覧表示用の型（必要なフィールドのみ）
 */
export interface CaseSummary {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  companySize: string;
  budgetMin: number;
  budgetMax: number;
  goals: string[];
  stack: string[];
  durationWeeks: number;
  deliverables: string[];
  updatedAt: Date;
}

export interface CasesResult {
  success: boolean;
  data?: Case[];
  error?: string;
}

/**
 * 案件一覧取得結果（CaseSummaryを使用）
 */
export interface CaseSummariesResult {
  success: boolean;
  data?: CaseSummary[];
  error?: string;
}

