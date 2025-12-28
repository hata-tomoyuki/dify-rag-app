"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/app/components/auth/AuthModal";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 認証済みの場合はリダイレクト
    if (status !== "loading" && session) {
      router.replace("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <p className="text-zinc-600">読み込み中...</p>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-md py-16 px-8">
        <AuthModal isOpen={true} onClose={() => router.push("/")} />
      </main>
    </div>
  );
}
