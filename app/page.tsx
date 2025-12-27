"use client";

import { useState } from "react";
import { Tabs } from "./components/Tabs";
import { CsvUploadSection } from "./components/CsvUploadSection";
import { CasesSection } from "./components/cases/CasesSection";

/**
 * メインページコンポーネント
 * CSVアップロードと案件管理のタブ切り替え機能を提供
 *
 * @returns メインページコンポーネント
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState("csv");

  const tabs = [
    { id: "csv", label: "CSVアップロード" },
    { id: "cases", label: "案件管理" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black mb-4">
              Dify RAG アプリケーション
            </h1>
            <p className="text-lg leading-8 text-zinc-600">
              CSVファイルのアップロードと案件管理を行えます
            </p>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

          <div className="mt-8">
            {activeTab === "csv" && <CsvUploadSection />}
            {activeTab === "cases" && <CasesSection />}
          </div>
        </div>
      </main>
    </div>
  );
}
