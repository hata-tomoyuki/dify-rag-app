import { prisma } from "@/lib/prisma";
import type { CaseChunk } from "@prisma/client";

export interface ICaseChunkRepository {
  create(data: { caseId: string; role: string; text: string; embedding: number[] }): Promise<CaseChunk>;
  findByCaseId(caseId: string): Promise<CaseChunk[]>;
  deleteByCaseId(caseId: string): Promise<void>;
  findSimilar(embedding: number[], role: string, limit: number): Promise<Array<CaseChunk & { similarity: number }>>;
}

/**
 * CaseChunkRepository実装
 * Prismaクライアントを使用したデータアクセス層
 */
export class CaseChunkRepository implements ICaseChunkRepository {
  /**
   * チャンクを作成する
   */
  async create(data: { caseId: string; role: string; text: string; embedding: number[] }): Promise<CaseChunk> {
    // embeddingをPostgreSQLのvector型に変換
    const embeddingVector = `[${data.embedding.join(",")}]`;

    // Prismaのraw queryを使用（vector型はUnsupported型のため）
    const result = await prisma.$queryRaw<CaseChunk[]>`
      INSERT INTO case_chunks (id, case_id, role, text, embedding, "createdAt")
      VALUES (gen_random_uuid()::text, ${data.caseId}, ${data.role}, ${data.text}, ${embeddingVector}::vector, NOW())
      RETURNING *
    `;

    if (!result[0]) {
      throw new Error("チャンクの作成に失敗しました");
    }

    return result[0];
  }

  /**
   * caseIdでチャンクを取得する
   */
  async findByCaseId(caseId: string): Promise<CaseChunk[]> {
    // Prismaのraw queryを使用（vector型はUnsupported型のため）
    return await prisma.$queryRaw<CaseChunk[]>`
      SELECT
        id,
        case_id as "caseId",
        role,
        text,
        embedding,
        "createdAt"
      FROM case_chunks
      WHERE case_id = ${caseId}
      ORDER BY "createdAt" ASC
    `;
  }

  /**
   * caseIdでチャンクを削除する
   */
  async deleteByCaseId(caseId: string): Promise<void> {
    // Prismaのraw queryを使用（vector型はUnsupported型のため）
    await prisma.$executeRaw`
      DELETE FROM case_chunks WHERE case_id = ${caseId}
    `;
  }

  /**
   * 類似チャンクを検索する（コサイン類似度）
   */
  async findSimilar(
    embedding: number[],
    role: string,
    limit: number
  ): Promise<Array<CaseChunk & { similarity: number }>> {
    const embeddingVector = `[${embedding.join(",")}]`;

    // コサイン類似度で検索（1 - cosine_distance）
    const results = await prisma.$queryRaw<
      Array<CaseChunk & { similarity: number }>
    >`
      SELECT
        id,
        case_id as "caseId",
        role,
        text,
        embedding,
        "createdAt",
        1 - (embedding <=> ${embeddingVector}::vector) as similarity
      FROM case_chunks
      WHERE role = ${role}
      ORDER BY embedding <=> ${embeddingVector}::vector
      LIMIT ${limit}
    `;

    return results;
  }
}

