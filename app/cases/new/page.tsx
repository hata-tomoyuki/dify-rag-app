"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createCase } from "@/app/actions/cases";
import { CaseForm } from "@/app/components/cases/CaseForm";
import type { CreateCaseInput, UpdateCaseInput } from "@/app/actions/cases";

/**
 * 新規案件作成ページ
 *
 * @returns 新規案件作成ページコンポーネント
 */
export default function NewCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateCaseInput | UpdateCaseInput) => {
    setIsSubmitting(true);
    setError(null);

    const result = await createCase(data as CreateCaseInput);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "案件の作成に失敗しました");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-2xl py-16 px-8">
        <div className="mb-6">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900">
            ← 一覧に戻る
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-black mb-6">新規案件作成</h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <CaseForm onSubmit={handleSubmit} submitLabel="作成" />
        </div>
      </main>
    </div>
  );
}

