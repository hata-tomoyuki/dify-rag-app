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
        title: input.title.trim(),
        clientName: input.clientName.trim(),
        industry: input.industry.trim(),
        companySize: input.companySize.trim(),
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        goals: input.goals.map((g) => g.trim()),
        challenges: input.challenges.map((c) => c.trim()),
        proposal: input.proposal.map((p) => p.trim()),
        stack: input.stack.map((s) => s.trim()),
        durationWeeks: input.durationWeeks,
        deliverables: input.deliverables.map((d) => d.trim()),
        result: input.result.trim(),
        lessonsLearned: input.lessonsLearned.map((l) => l.trim()),
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
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.clientName !== undefined) updateData.clientName = input.clientName.trim();
    if (input.industry !== undefined) updateData.industry = input.industry.trim();
    if (input.companySize !== undefined) updateData.companySize = input.companySize.trim();
    if (input.budgetMin !== undefined) updateData.budgetMin = input.budgetMin;
    if (input.budgetMax !== undefined) updateData.budgetMax = input.budgetMax;
    if (input.goals !== undefined) updateData.goals = input.goals.map((g) => g.trim());
    if (input.challenges !== undefined) updateData.challenges = input.challenges.map((c) => c.trim());
    if (input.proposal !== undefined) updateData.proposal = input.proposal.map((p) => p.trim());
    if (input.stack !== undefined) updateData.stack = input.stack.map((s) => s.trim());
    if (input.durationWeeks !== undefined) updateData.durationWeeks = input.durationWeeks;
    if (input.deliverables !== undefined) updateData.deliverables = input.deliverables.map((d) => d.trim());
    if (input.result !== undefined) updateData.result = input.result.trim();
    if (input.lessonsLearned !== undefined) updateData.lessonsLearned = input.lessonsLearned.map((l) => l.trim());

    return await prisma.case.update({
      where: {
        id,
      },
      data: updateData,
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

