import { MainContents } from "./components/MainContents";
import { Header } from "./components/Header";
import { getCases } from "./actions/cases";

/**
 * メインページコンポーネント
 * 類似案件検索と案件管理のタブ切り替え機能を提供
 *
 * @returns メインページコンポーネント
 */
export default async function Home() {
  const casesResult = await getCases();
  const cases = casesResult.success && casesResult.data ? casesResult.data : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-8 px-8 sm:py-16">
        <div className="w-full space-y-4 sm:space-y-8">
          <Header />
          <MainContents cases={cases} />
        </div>
      </main>
    </div>
  );
}
