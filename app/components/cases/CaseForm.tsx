"use client";

import { useState } from "react";
import type { CreateCaseInput, UpdateCaseInput, Case } from "@/app/actions/cases";

interface CaseFormProps {
  initialData?: Case;
  onSubmit: (data: CreateCaseInput | UpdateCaseInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

/**
 * 案件作成/編集フォームコンポーネント
 *
 * @param props - CaseFormProps
 * @param props.initialData - 編集時の初期データ
 * @param props.onSubmit - フォーム送信時のコールバック関数
 * @param props.onCancel - キャンセル時のコールバック関数
 * @param props.submitLabel - 送信ボタンのラベル
 * @returns 案件作成/編集フォームコンポーネント
 */
export function CaseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "保存",
}: CaseFormProps) {
  const [formData, setFormData] = useState({
    customer: initialData?.customer || "",
    issue: initialData?.issue || "",
    response: initialData?.response || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customer.trim() || !formData.issue.trim() || !formData.response.trim()) {
      setError("すべての項目を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-800">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-zinc-700 mb-2">
          顧客 <span className="text-red-500">*</span>
        </label>
        <input
          id="customer"
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          required
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="issue" className="block text-sm font-medium text-zinc-700 mb-2">
          課題 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="issue"
          value={formData.issue}
          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="response" className="block text-sm font-medium text-zinc-700 mb-2">
          対応 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="response"
          value={formData.response}
          onChange={(e) => setFormData({ ...formData, response: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "保存中..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

