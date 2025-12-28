"use client";

import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { useSession } from "next-auth/react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { update: updateSession } = useSession();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOutAction();
      // セッションを明示的に更新
      await updateSession();
      // ページを強制的にリロードしてセッション状態を確実に反映
      window.location.href = "/";
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
    >
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}

