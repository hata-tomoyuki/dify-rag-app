import { CaseRepository } from "@/lib/repositories/CaseRepository";
import { CaseChunkRepository } from "@/lib/repositories/CaseChunkRepository";
import { LlmService } from "@/lib/services/LlmService";
import { EmbeddingService } from "@/lib/services/EmbeddingService";
import type { Case } from "@/lib/usecases/types";

export interface SimilarCaseInput {
  title: string;
  industry: string;
  companySize: string;
  description: string;
}

export interface SimilarCase {
  case: Case;
  reason: string;
}

export interface FindSimilarCasesResult {
  success: boolean;
  data?: SimilarCase[];
  error?: string;
}

/**
 * FindSimilarCasesUseCase
 * 類似案件を検索するユースケース
 */
export class FindSimilarCasesUseCase {
  private caseRepository: CaseRepository;
  private caseChunkRepository: CaseChunkRepository;
  private llmService: LlmService;
  private embeddingService: EmbeddingService;

  constructor() {
    this.caseRepository = new CaseRepository();
    this.caseChunkRepository = new CaseChunkRepository();
    this.llmService = new LlmService();
    this.embeddingService = new EmbeddingService();
  }

  async execute(input: SimilarCaseInput): Promise<FindSimilarCasesResult> {
    try {
      // 1. 入力案件をsummary/challengeに変換（LLM）
      const inputSummary = await this.llmService.generateInputSummary(input);

      // 2. summaryをembedding
      const queryEmbedding = await this.embeddingService.generateEmbedding(inputSummary.summary);

      // 3. Vector DBからrole=summaryで上位10件取得（重複排除のため多めに取得）
      const similarChunks = await this.caseChunkRepository.findSimilar(queryEmbedding, "summary", 10);

      // 4. caseId単位でグルーピング（上位3件まで）
      const caseIdSet = new Set<string>();
      const topCaseIds: string[] = [];

      for (const chunk of similarChunks) {
        if (!caseIdSet.has(chunk.caseId) && topCaseIds.length < 3) {
          caseIdSet.add(chunk.caseId);
          topCaseIds.push(chunk.caseId);
        }
      }

      if (topCaseIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // 5. 案件データを取得
      const cases = await Promise.all(topCaseIds.map((id) => this.caseRepository.findById(id)));
      const validCases = cases.filter((c): c is Case => c !== null);

      if (validCases.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // 6. 各案件のチャンクを取得
      const casesWithChunks = await Promise.all(
        validCases.map(async (caseData) => {
          const chunks = await this.caseChunkRepository.findByCaseId(caseData.id);
          return {
            case: caseData,
            chunks,
          };
        })
      );

      // 7. 類似理由を生成（LLM）
      const similarCasesForReason = casesWithChunks.map(({ case: caseData, chunks }) => {
        const summaryChunk = chunks.find((c) => c.role === "summary");
        const challengeChunk = chunks.find((c) => c.role === "challenge");
        const solutionChunk = chunks.find((c) => c.role === "solution");

        return {
          title: caseData.title,
          summary: summaryChunk?.text || "",
          challenge: challengeChunk?.text || "",
          solution: solutionChunk?.text || "",
        };
      });

      const reasons = await this.llmService.generateSimilarityReason(inputSummary, similarCasesForReason);

      // 8. 結果を組み合わせ
      const result: SimilarCase[] = casesWithChunks.map(({ case: caseData }, index) => ({
        case: caseData,
        reason: reasons[index]?.reason || "類似している案件です",
      }));

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "類似案件検索に失敗しました",
      };
    }
  }
}

