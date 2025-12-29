import { MainContents } from "./components/MainContents";
import { Header } from "./components/Header";

/**
 * メインページコンポーネント
 * 類似案件検索と案件管理のタブ切り替え機能を提供
 *
 * @returns メインページコンポーネント
 */
export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-8 px-8 sm:py-16">
        <div className="w-full space-y-4 sm:space-y-8">
          <Header />
          <MainContents />
        </div>
      </main>
    </div>
  );
}
