"use client";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

/**
 * タブコンポーネント
 *
 * @param props - TabsProps
 * @param props.activeTab - 現在アクティブなタブのID
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @param props.tabs - タブの配列
 * @returns タブ切り替えUIコンポーネント
 */
export function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="border-b border-zinc-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === tab.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

