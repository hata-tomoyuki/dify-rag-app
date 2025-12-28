import { prisma } from "@/lib/prisma";
import type { Case, CreateCaseInput, UpdateCaseInput } from "@/lib/usecases/types";

/**
 * CaseRepositoryインターフェース
 * データアクセス層の抽象化
 */
export interface ICaseRepository {
  create(input: CreateCaseInput): Promise<Case>;
  findMany(): Promise<Case[]>;
  findById(id: string): Promise<Case | null>;
  update(id: string, input: UpdateCaseInput): Promise<Case>;
  delete(id: string): Promise<void>;
}

/**
 * CaseRepository実装
 * Prismaクライアントを使用したデータアクセス層
 */
export class CaseRepository implements ICaseRepository {
  /**
   * 案件を作成する
   */
  async create(input: CreateCaseInput): Promise<Case> {
    return await prisma.case.create({
      data: {
        customer: input.customer.trim(),
        issue: input.issue.trim(),
        response: input.response.trim(),
      },
    });
  }

  /**
   * すべての案件を取得する（更新日時の降順）
   */
  async findMany(): Promise<Case[]> {
    return await prisma.case.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * IDで案件を取得する
   */
  async findById(id: string): Promise<Case | null> {
    return await prisma.case.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 案件を更新する
   */
  async update(id: string, input: UpdateCaseInput): Promise<Case> {
    return await prisma.case.update({
      where: {
        id,
      },
      data: {
        ...(input.customer !== undefined && { customer: input.customer.trim() }),
        ...(input.issue !== undefined && { issue: input.issue.trim() }),
        ...(input.response !== undefined && { response: input.response.trim() }),
      },
    });
  }

  /**
   * 案件を削除する
   */
  async delete(id: string): Promise<void> {
    await prisma.case.delete({
      where: {
        id,
      },
    });
  }
}

