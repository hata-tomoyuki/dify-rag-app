import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChunkGenerationResult {
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  similarity_reason: string;
}

export interface SimilarityReasonResult {
  reason: string;
}

/**
 * LlmService
 * LLM呼び出しに関するビジネスロジックを提供
 */
export class LlmService {
  /**
   * 案件情報からチャンクを生成する
   */
  async generateChunks(caseData: {
    title: string;
    clientName: string;
    industry: string;
    companySize: string;
    goals: string[];
    challenges: string[];
    proposal: string[];
    result: string;
  }): Promise<ChunkGenerationResult> {
    const prompt = `以下の案件情報を、検索と比較に適した意味単位に分解してください。

出力形式（JSON）：
{
  "summary": "案件全体を1文で要約",
  "challenge": "主な課題を箇条書き1〜2文で",
  "solution": "主要施策を箇条書き1〜2文で",
  "result": "成果があれば1文、なければ空文字列",
  "similarity_reason": "類似判断に使える理由を1文で"
}

案件情報：
- 案件名: ${caseData.title}
- クライアント名: ${caseData.clientName}
- 業種: ${caseData.industry}
- 規模: ${caseData.companySize}
- 目的: ${caseData.goals.join(", ")}
- 課題: ${caseData.challenges.join(", ")}
- 提案要点: ${caseData.proposal.join(", ")}
- 成果: ${caseData.result || "なし"}

必ずJSON形式で出力してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは案件情報を分析し、検索と比較に適した形式に変換する専門家です。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("LLMからの応答が空です");
    }

    try {
      const parsed = JSON.parse(content) as ChunkGenerationResult;
      return {
        summary: parsed.summary || "",
        challenge: parsed.challenge || "",
        solution: parsed.solution || "",
        result: parsed.result || "",
        similarity_reason: parsed.similarity_reason || "",
      };
    } catch (error) {
      throw new Error(`LLM応答のパースに失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 新規案件のsummary/challengeを生成する
   */
  async generateInputSummary(input: {
    title: string;
    industry: string;
    companySize: string;
    description: string;
  }): Promise<{ summary: string; challenge: string }> {
    const prompt = `以下の新規案件情報から、検索用のsummaryとchallengeを生成してください。

出力形式（JSON）：
{
  "summary": "案件全体を1文で要約",
  "challenge": "主な課題を1〜2文で"
}

案件情報：
- 案件名: ${input.title}
- 業種: ${input.industry}
- 規模: ${input.companySize}
- 概要: ${input.description}

必ずJSON形式で出力してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは案件情報を分析し、検索用の要約を生成する専門家です。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("LLMからの応答が空です");
    }

    try {
      const parsed = JSON.parse(content) as { summary: string; challenge: string };
      return {
        summary: parsed.summary || "",
        challenge: parsed.challenge || "",
      };
    } catch (error) {
      throw new Error(`LLM応答のパースに失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 類似理由を生成する
   */
  async generateSimilarityReason(
    newCase: {
      summary: string;
      challenge: string;
    },
    similarCases: Array<{
      title: string;
      summary: string;
      challenge: string;
      solution: string;
    }>
  ): Promise<SimilarityReasonResult[]> {
    const prompt = `以下の新規案件と過去案件について、それぞれなぜ類似しているかを説明してください。

観点：
- 業種・規模
- 課題
- 目的・解決したいこと

新規案件：
- 概要: ${newCase.summary}
- 課題: ${newCase.challenge}

過去案件：
${similarCases
  .map(
    (c, i) => `
案件${i + 1}:
- タイトル: ${c.title}
- 概要: ${c.summary}
- 課題: ${c.challenge}
- 提案: ${c.solution}`
  )
  .join("\n")}

出力形式（JSON配列）：
[
  {
    "reason": "案件1との類似理由を1〜2文で"
  },
  {
    "reason": "案件2との類似理由を1〜2文で"
  },
  {
    "reason": "案件3との類似理由を1〜2文で"
  }
]

必ずJSON配列形式で出力してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは案件の類似性を分析し、分かりやすく説明する専門家です。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("LLMからの応答が空です");
    }

    try {
      const parsed = JSON.parse(content) as { reasons?: Array<{ reason: string }> } | Array<{ reason: string }>;
      // JSONオブジェクトの場合、reasonsキーから取得
      const reasons = Array.isArray(parsed) ? parsed : parsed.reasons || [];
      if (Array.isArray(reasons)) {
        return reasons.map((r) => ({ reason: r.reason || "" }));
      }
      // フォールバック: 空配列を返す
      return [];
    } catch (error) {
      throw new Error(`LLM応答のパースに失敗しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

