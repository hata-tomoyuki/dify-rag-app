import { AuthStatus } from "./auth/AuthStatus"

export function Header() {
    return (
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
    )
}
