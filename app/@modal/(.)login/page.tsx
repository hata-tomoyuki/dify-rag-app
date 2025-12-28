"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/app/components/auth/AuthModal";

export default function LoginModal() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // 認証済みの場合はリダイレクト
    if (status !== "loading" && session) {
      router.replace("/");
    }
  }, [session, status, router]);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  if (status === "loading") {
    return null;
  }

  if (session) {
    return null;
  }

  return <AuthModal isOpen={isOpen} onClose={handleClose} />;
}

