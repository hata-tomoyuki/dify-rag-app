import { auth } from "@/auth";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export async function AuthStatus() {
    const session = await auth();

    return (
        <div className="mt-4 sm:mt-0 relative sm:absolute sm:top-8 sm:right-8">
            {session?.user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-600">
                        {session.user.name || session.user.email}
                    </span>
                    <LogoutButton />
                </div>
            ) : (
                <Link
                    href="/login"
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 text-sm"
                >
                    ログイン
                </Link>
            )}
        </div>
    );
}

