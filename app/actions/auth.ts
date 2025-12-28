"use server";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export interface SignInResult {
  success: boolean;
  error?: string;
}

/**
 * ログイン処理
 *
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns ログイン結果
 */
export async function signInAction(
  email: string,
  password: string
): Promise<SignInResult> {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      return {
        success: false,
        error: "メールアドレスまたはパスワードが正しくありません",
      };
    }

    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "ログインに失敗しました",
    };
  }
}

/**
 * ログアウト処理
 */
export async function signOutAction() {
  await signOut({ redirect: false });
  revalidatePath("/");
}

