"use server";

import { revalidatePath } from "next/cache";
import { CreateCaseUseCase } from "@/lib/usecases/cases/CreateCaseUseCase";
import { GetCaseUseCase } from "@/lib/usecases/cases/GetCaseUseCase";
import { GetCasesUseCase } from "@/lib/usecases/cases/GetCasesUseCase";
import { UpdateCaseUseCase } from "@/lib/usecases/cases/UpdateCaseUseCase";
import { DeleteCaseUseCase } from "@/lib/usecases/cases/DeleteCaseUseCase";
import { GenerateCaseChunksUseCase } from "@/lib/usecases/chunks/GenerateCaseChunksUseCase";
import { CaseChunkRepository } from "@/lib/repositories/CaseChunkRepository";
import type {
  Case as CaseType,
  CreateCaseInput as CreateCaseInputType,
  UpdateCaseInput as UpdateCaseInputType,
  CaseResult as CaseResultType,
  CasesResult as CasesResultType,
} from "@/lib/usecases/types";

// 型定義をエクスポート（既存のコンポーネントとの互換性のため）
export type Case = CaseType;
export type CreateCaseInput = CreateCaseInputType;
export type UpdateCaseInput = UpdateCaseInputType;
export type CaseResult = CaseResultType;
export type CasesResult = CasesResultType;

/**
 * 案件を作成するServer Action
 *
 * @param input - 案件作成用の入力データ
 * @returns 作成結果（成功/失敗、データ、エラーメッセージ）
 */
export async function createCase(input: CreateCaseInput): Promise<CaseResult> {
  const useCase = new CreateCaseUseCase();
  const result = await useCase.execute(input);

  if (result.success && result.data) {
    // Case作成後にチャンクを自動生成
    try {
      const chunkUseCase = new GenerateCaseChunksUseCase();
      await chunkUseCase.execute(result.data);
    } catch (error) {
      // チャンク生成に失敗してもCase作成は成功とする（ログに記録するなど）
      console.error("チャンク生成に失敗しました:", error);
    }

    revalidatePath("/");
    revalidatePath("/cases");
  }

  return result;
}

/**
 * すべての案件を取得するServer Action
 *
 * @returns 案件一覧の取得結果（成功/失敗、データ、エラーメッセージ）
 */
export async function getCases(): Promise<CasesResult> {
  const useCase = new GetCasesUseCase();
  return await useCase.execute();
}

/**
 * IDで案件を取得するServer Action
 *
 * @param id - 案件ID（UUID）
 * @returns 案件の取得結果（成功/失敗、データ、エラーメッセージ）
 */
export async function getCaseById(id: string): Promise<CaseResult> {
  const useCase = new GetCaseUseCase();
  return await useCase.execute(id);
}

/**
 * 案件を更新するServer Action
 *
 * @param id - 案件ID（UUID）
 * @param input - 更新用の入力データ
 * @returns 更新結果（成功/失敗、データ、エラーメッセージ）
 */
export async function updateCase(
  id: string,
  input: UpdateCaseInput
): Promise<CaseResult> {
  const useCase = new UpdateCaseUseCase();
  const result = await useCase.execute(id, input);

  if (result.success && result.data) {
    // Case更新後にチャンクを自動再生成
    try {
      const chunkUseCase = new GenerateCaseChunksUseCase();
      await chunkUseCase.execute(result.data);
    } catch (error) {
      // チャンク生成に失敗してもCase更新は成功とする（ログに記録するなど）
      console.error("チャンク再生成に失敗しました:", error);
    }

    revalidatePath("/");
    revalidatePath(`/cases/${id}`);
  }

  return result;
}

/**
 * 案件を削除するServer Action
 *
 * @param id - 案件ID（UUID）
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 */
export async function deleteCase(id: string): Promise<{ success: boolean; error?: string }> {
  // Case削除前にチャンクを削除（Cascadeで自動削除されるが、明示的に削除）
  try {
    const chunkRepository = new CaseChunkRepository();
    await chunkRepository.deleteByCaseId(id);
  } catch (error) {
    // チャンク削除に失敗してもCase削除は続行する（ログに記録するなど）
    console.error("チャンク削除に失敗しました:", error);
  }

  const useCase = new DeleteCaseUseCase();
  const result = await useCase.execute(id);

  if (result.success) {
    revalidatePath("/");
    revalidatePath("/cases");
  }

  return result;
}

