"use client";

import { useState } from "react";
import { Tabs } from "./components/Tabs";
import { CasesSection } from "./components/cases/CasesSection";
import { SimilarCasesForm } from "./components/similar/SimilarCasesForm";

/**
 * メインページコンポーネント
 * 類似案件検索と案件管理のタブ切り替え機能を提供
 *
 * @returns メインページコンポーネント
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState("similar");

  const tabs = [
    { id: "similar", label: "類似案件検索" },
    { id: "cases", label: "案件管理" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black mb-4">
              類似案件提案アシスタント
            </h1>
            <p className="text-lg leading-8 text-zinc-600">
              新規案件の情報を入力すると、過去の類似案件を最大3件提示します
            </p>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

          <div className="mt-8">
            {activeTab === "similar" && <SimilarCasesForm />}
            {activeTab === "cases" && <CasesSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
