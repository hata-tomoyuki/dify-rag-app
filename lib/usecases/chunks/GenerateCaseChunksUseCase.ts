import { CaseChunkRepository } from "@/lib/repositories/CaseChunkRepository";
import { LlmService } from "@/lib/services/LlmService";
import { EmbeddingService } from "@/lib/services/EmbeddingService";
import type { Case } from "@/lib/usecases/types";

export interface GenerateChunksResult {
  success: boolean;
  chunksCreated?: number;
  error?: string;
}

/**
 * GenerateCaseChunksUseCase
 * 案件からチャンクを生成するユースケース
 */
export class GenerateCaseChunksUseCase {
  private caseChunkRepository: CaseChunkRepository;
  private llmService: LlmService;
  private embeddingService: EmbeddingService;

  constructor() {
    this.caseChunkRepository = new CaseChunkRepository();
    this.llmService = new LlmService();
    this.embeddingService = new EmbeddingService();
  }

  async execute(caseData: Case): Promise<GenerateChunksResult> {
    try {
      // 既存のチャンクを削除
      await this.caseChunkRepository.deleteByCaseId(caseData.id);

      // LLMでチャンクを生成
      const chunks = await this.llmService.generateChunks({
        title: caseData.title,
        clientName: caseData.clientName,
        industry: caseData.industry,
        companySize: caseData.companySize,
        goals: caseData.goals,
        challenges: caseData.challenges,
        proposal: caseData.proposal,
        result: caseData.result,
      });

      // 各チャンクのembeddingを生成
      const roles: Array<keyof typeof chunks> = ["summary", "challenge", "solution", "result", "similarity_reason"];
      let chunksCreated = 0;

      for (const role of roles) {
        const text = chunks[role];
        if (!text.trim()) {
          continue; // 空のチャンクはスキップ
        }

        // Embedding生成
        const embedding = await this.embeddingService.generateEmbedding(text);

        // チャンクを保存
        await this.caseChunkRepository.create({
          caseId: caseData.id,
          role,
          text,
          embedding,
        });

        chunksCreated++;
      }

      return {
        success: true,
        chunksCreated,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "チャンク生成に失敗しました",
      };
    }
  }
}

