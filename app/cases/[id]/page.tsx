"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCaseById, updateCase, deleteCase } from "@/app/actions/cases";
import { CaseForm } from "@/app/components/cases/CaseForm";
import type { Case, CreateCaseInput, UpdateCaseInput } from "@/app/actions/cases";

/**
 * 案件詳細/編集ページ
 *
 * @returns 案件詳細/編集ページコンポーネント
 */
export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCase = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCaseById(id);
      if (result.success && result.data) {
        setCaseData(result.data);
      } else {
        setError(result.error || "案件の取得に失敗しました");
      }
      setIsLoading(false);
    };

    if (id) {
      loadCase();
    }
  }, [id]);

  const handleUpdate = async (data: CreateCaseInput | UpdateCaseInput) => {
    setError(null);

    const result = await updateCase(id, data as UpdateCaseInput);

    if (result.success && result.data) {
      setCaseData(result.data);
      setIsEditing(false);
      router.refresh();
    } else {
      setError(result.error || "案件の更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteCase(id);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "案件の削除に失敗しました");
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <main className="w-full max-w-2xl py-16 px-8">
          <p className="text-center text-zinc-600">読み込み中...</p>
        </main>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <main className="w-full max-w-2xl py-16 px-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-6">
              <Link href="/" className="text-zinc-600 hover:text-zinc-900">
                ← 一覧に戻る
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-red-50 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-2xl py-16 px-8">
        <div className="mb-6">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900">
            ← 一覧に戻る
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-black">案件詳細</h1>
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50"
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "削除中..." : "削除"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isEditing ? (
            <CaseForm
              initialData={caseData}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="更新"
            />
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">案件ID</p>
                <p className="text-xs text-zinc-500 break-all">{caseData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">案件名</p>
                <p className="text-sm text-zinc-900">{caseData.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">クライアント名</p>
                <p className="text-sm text-zinc-900">{caseData.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">業種</p>
                <p className="text-sm text-zinc-900">{caseData.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">規模</p>
                <p className="text-sm text-zinc-900">{caseData.companySize}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">予算</p>
                <p className="text-sm text-zinc-900">
                  {caseData.budgetMin.toLocaleString()}円 〜 {caseData.budgetMax.toLocaleString()}円
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">目的</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">課題</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">提案要点</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.proposal.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">技術スタック</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.stack.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">期間</p>
                <p className="text-sm text-zinc-900">{caseData.durationWeeks}週</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">成果物</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.deliverables.map((deliverable, index) => (
                    <li key={index}>{deliverable}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">成果</p>
                <p className="text-sm text-zinc-900 whitespace-pre-wrap">{caseData.result}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">反省・注意点</p>
                <ul className="list-disc list-inside text-sm text-zinc-900">
                  {caseData.lessonsLearned.map((lesson, index) => (
                    <li key={index}>{lesson}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">作成日時</p>
                <p className="text-sm text-zinc-600">{formatDate(caseData.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">更新日時</p>
                <p className="text-sm text-zinc-600">{formatDate(caseData.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

