"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

/**
 * 案件を作成するServer Action
 *
 * @param input - 案件作成用の入力データ
 * @returns 作成結果（成功/失敗、データ、エラーメッセージ）
 */
export async function createCase(input: CreateCaseInput): Promise<CaseResult> {
  try {
    if (!input.customer || !input.issue || !input.response) {
      return {
        success: false,
        error: "顧客、課題、対応は必須項目です",
      };
    }

    const newCase = await prisma.case.create({
      data: {
        customer: input.customer.trim(),
        issue: input.issue.trim(),
        response: input.response.trim(),
      },
    });

    revalidatePath("/");
    revalidatePath("/cases");

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

/**
 * すべての案件を取得するServer Action
 *
 * @returns 案件一覧の取得結果（成功/失敗、データ、エラーメッセージ）
 */
export async function getCases(): Promise<CasesResult> {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      data: cases,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "案件一覧の取得に失敗しました",
    };
  }
}

/**
 * IDで案件を取得するServer Action
 *
 * @param id - 案件ID（UUID）
 * @returns 案件の取得結果（成功/失敗、データ、エラーメッセージ）
 */
export async function getCaseById(id: string): Promise<CaseResult> {
  try {
    const caseData = await prisma.case.findUnique({
      where: {
        id,
      },
    });

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
  try {
    const updatedCase = await prisma.case.update({
      where: {
        id,
      },
      data: {
        ...(input.customer !== undefined && { customer: input.customer.trim() }),
        ...(input.issue !== undefined && { issue: input.issue.trim() }),
        ...(input.response !== undefined && { response: input.response.trim() }),
      },
    });

    revalidatePath("/");
    revalidatePath(`/cases/${id}`);

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

/**
 * 案件を削除するServer Action
 *
 * @param id - 案件ID（UUID）
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 */
export async function deleteCase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.case.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/cases");

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

