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

export interface CasesResult {
  success: boolean;
  data?: Case[];
  error?: string;
}

