import { Suspense } from "react";
import { AuthStatus } from "./components/auth/AuthStatus";
import { MainContents } from "./components/MainContents";

/**
 * メインページコンポーネント
 * 類似案件検索と案件管理のタブ切り替え機能を提供
 *
 * @returns メインページコンポーネント
 */
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-16 px-8">
        <div className="w-full space-y-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black mb-4">
                類似案件提案アシスタント
              </h1>
              <p className="text-lg leading-8 text-zinc-600">
                過去の案件から AI が類似案件を提案し、効率的な案件管理をサポート
              </p>
            </div>
            <div className="ml-4">
              <AuthStatus />
            </div>
          </div>

          <MainContents />

        </div>
      </main>
    </div>
  );
}
