/**
 * 共通型定義
 */

export interface Case {
  id: string;
  customer: string;
  issue: string;
  response: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateCaseInput {
  customer: string;
  issue: string;
  response: string;
}

export interface UpdateCaseInput {
  customer?: string;
  issue?: string;
  response?: string;
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

export interface UploadResult {
  success: boolean;
  message: string;
  documentId?: string;
  batch?: string;
}

export interface IndexingStatus {
  id: string;
  indexing_status: string;
  processing_started_at?: number;
  parsing_completed_at?: number;
  cleaning_completed_at?: number;
  splitting_completed_at?: number;
  completed_at?: number;
  paused_at?: number;
  error?: string;
  stopped_at?: number;
  completed_segments?: number;
  total_segments?: number;
}

export interface IndexingStatusResult {
  success: boolean;
  data?: IndexingStatus[];
  error?: string;
}

export interface ExportCsvResult {
  success: boolean;
  csv?: string;
  error?: string;
}

