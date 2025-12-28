"use client";

import { useState } from "react";
import { findSimilarCases } from "@/app/actions/similar";
import type { SimilarCaseInput, SimilarCase } from "@/app/actions/similar";
import { SimilarCaseCard } from "./SimilarCaseCard";

/**
 * 類似案件検索フォームコンポーネント
 */
export function SimilarCasesForm() {
  const [formData, setFormData] = useState<SimilarCaseInput>({
    title: "",
    industry: "",
    companySize: "",
    description: "",
  });
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSearching(true);

    try {
      const result = await findSimilarCases(formData);
      if (result.success && result.data) {
        console.log("類似案件検索結果:", result.data);
        setSimilarCases(result.data);
      } else {
        setError(result.error || "類似案件の検索に失敗しました");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-2">類似案件検索</h3>
        <p className="text-sm text-zinc-600 mb-4">
          新規案件の情報を入力すると、過去の類似案件を最大3件提示します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-900 mb-2">
              案件名 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              placeholder="例: 多言語対応LP制作"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-zinc-900 mb-2">
              業種 <span className="text-red-500">*</span>
            </label>
            <input
              id="industry"
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              required
              placeholder="例: SaaS, EC・小売, 製造業"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-zinc-900 mb-2">
              規模 <span className="text-red-500">*</span>
            </label>
            <input
              id="companySize"
              type="text"
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              required
              placeholder="例: 1-10, 11-30, 31-50"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-900 mb-2">
              案件概要 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              placeholder="案件の目的、課題、提案内容などを記入してください"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="w-full px-4 py-2 bg-zinc-900 text-white rounded-lg cursor-pointer hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "検索中..." : "類似案件を検索"}
          </button>
        </form>
      </div>

      {similarCases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black">類似案件（{similarCases.length}件）</h3>
          <div className="grid grid-cols-1 gap-4">
            {similarCases.map((similarCase) => (
              <SimilarCaseCard key={similarCase.case.id} similarCase={similarCase} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

