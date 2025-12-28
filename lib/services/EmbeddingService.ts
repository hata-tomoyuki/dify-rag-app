import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * EmbeddingService
 * Embedding生成に関するビジネスロジックを提供
 */
export class EmbeddingService {
  /**
   * テキストからembeddingベクトルを生成する
   * @param text - 埋め込み対象のテキスト
   * @returns embeddingベクトル（3072次元）
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new Error("テキストが空です");
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      dimensions: 3072,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error("Embeddingの生成に失敗しました");
    }

    return embedding;
  }

  /**
   * 複数のテキストからembeddingベクトルを一括生成する
   * @param texts - 埋め込み対象のテキスト配列
   * @returns embeddingベクトルの配列
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(texts.map((text) => this.generateEmbedding(text)));
    return embeddings;
  }
}

