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
 * 配列フィールド用のコンポーネント
 */
function ArrayField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const addItem = () => {
    onChange([...values, ""]);
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                削除
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-zinc-600 hover:text-zinc-900 px-2 py-1 border border-zinc-300 rounded hover:bg-zinc-50"
        >
          + 追加
        </button>
      </div>
    </div>
  );
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
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    industry: initialData?.industry || "",
    companySize: initialData?.companySize || "",
    budgetMin: initialData?.budgetMin?.toString() || "",
    budgetMax: initialData?.budgetMax?.toString() || "",
    goals: initialData?.goals && initialData.goals.length > 0 ? initialData.goals : [""],
    challenges: initialData?.challenges && initialData.challenges.length > 0 ? initialData.challenges : [""],
    proposal: initialData?.proposal && initialData.proposal.length > 0 ? initialData.proposal : [""],
    stack: initialData?.stack && initialData.stack.length > 0 ? initialData.stack : [""],
    durationWeeks: initialData?.durationWeeks?.toString() || "",
    deliverables: initialData?.deliverables && initialData.deliverables.length > 0 ? initialData.deliverables : [""],
    result: initialData?.result || "",
    lessonsLearned: initialData?.lessonsLearned && initialData.lessonsLearned.length > 0 ? initialData.lessonsLearned : [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (
      !formData.title.trim() ||
      !formData.clientName.trim() ||
      !formData.industry.trim() ||
      !formData.companySize.trim() ||
      !formData.budgetMin.trim() ||
      !formData.budgetMax.trim() ||
      formData.goals.filter((g) => g.trim()).length === 0 ||
      formData.challenges.filter((c) => c.trim()).length === 0 ||
      formData.proposal.filter((p) => p.trim()).length === 0 ||
      formData.stack.filter((s) => s.trim()).length === 0 ||
      !formData.durationWeeks.trim() ||
      formData.deliverables.filter((d) => d.trim()).length === 0 ||
      !formData.result.trim() ||
      formData.lessonsLearned.filter((l) => l.trim()).length === 0
    ) {
      setError("すべての必須項目を入力してください");
      return;
    }

    const budgetMin = parseInt(formData.budgetMin, 10);
    const budgetMax = parseInt(formData.budgetMax, 10);
    const durationWeeks = parseInt(formData.durationWeeks, 10);

    if (isNaN(budgetMin) || isNaN(budgetMax) || budgetMin > budgetMax) {
      setError("予算の値が正しくありません");
      return;
    }

    if (isNaN(durationWeeks) || durationWeeks <= 0) {
      setError("期間（週）は1以上の数値である必要があります");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: CreateCaseInput | UpdateCaseInput = {
        title: formData.title.trim(),
        clientName: formData.clientName.trim(),
        industry: formData.industry.trim(),
        companySize: formData.companySize.trim(),
        budgetMin,
        budgetMax,
        goals: formData.goals.filter((g) => g.trim()),
        challenges: formData.challenges.filter((c) => c.trim()),
        proposal: formData.proposal.filter((p) => p.trim()),
        stack: formData.stack.filter((s) => s.trim()),
        durationWeeks,
        deliverables: formData.deliverables.filter((d) => d.trim()),
        result: formData.result.trim(),
        lessonsLearned: formData.lessonsLearned.filter((l) => l.trim()),
      };
      await onSubmit(submitData);
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
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-2">
          案件名 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-zinc-700 mb-2">
          クライアント名 <span className="text-red-500">*</span>
        </label>
        <input
          id="clientName"
          type="text"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          required
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-zinc-700 mb-2">
          業種 <span className="text-red-500">*</span>
        </label>
        <input
          id="industry"
          type="text"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          required
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label htmlFor="companySize" className="block text-sm font-medium text-zinc-700 mb-2">
          規模 <span className="text-red-500">*</span>
        </label>
        <input
          id="companySize"
          type="text"
          value={formData.companySize}
          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
          placeholder="例: 31-50"
          required
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium text-zinc-700 mb-2">
            予算最小値（円） <span className="text-red-500">*</span>
          </label>
          <input
            id="budgetMin"
            type="number"
            value={formData.budgetMin}
            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
            required
            min="0"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium text-zinc-700 mb-2">
            予算最大値（円） <span className="text-red-500">*</span>
          </label>
          <input
            id="budgetMax"
            type="number"
            value={formData.budgetMax}
            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
            required
            min="0"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
      </div>

      <ArrayField
        label="目的"
        values={formData.goals}
        onChange={(values) => setFormData({ ...formData, goals: values })}
        placeholder="例: 問い合わせ削減"
      />

      <ArrayField
        label="課題"
        values={formData.challenges}
        onChange={(values) => setFormData({ ...formData, challenges: values })}
        placeholder="例: 同じ問い合わせが繰り返される"
      />

      <ArrayField
        label="提案要点"
        values={formData.proposal}
        onChange={(values) => setFormData({ ...formData, proposal: values })}
        placeholder="例: FAQの分類と優先度付け"
      />

      <ArrayField
        label="技術スタック"
        values={formData.stack}
        onChange={(values) => setFormData({ ...formData, stack: values })}
        placeholder="例: Next.js"
      />

      <div>
        <label htmlFor="durationWeeks" className="block text-sm font-medium text-zinc-700 mb-2">
          期間（週） <span className="text-red-500">*</span>
        </label>
        <input
          id="durationWeeks"
          type="number"
          value={formData.durationWeeks}
          onChange={(e) => setFormData({ ...formData, durationWeeks: e.target.value })}
          required
          min="1"
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <ArrayField
        label="成果物"
        values={formData.deliverables}
        onChange={(values) => setFormData({ ...formData, deliverables: values })}
        placeholder="例: ヘルプセンター"
      />

      <div>
        <label htmlFor="result" className="block text-sm font-medium text-zinc-700 mb-2">
          成果 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="result"
          value={formData.result}
          onChange={(e) => setFormData({ ...formData, result: e.target.value })}
          required
          rows={6}
          placeholder="例: 問い合わせ件数が35%削減、自己解決率が55%に向上"
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      <ArrayField
        label="反省・注意点"
        values={formData.lessonsLearned}
        onChange={(values) => setFormData({ ...formData, lessonsLearned: values })}
        placeholder="例: 情報が増えるほどメンテ導線が必要"
      />

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
