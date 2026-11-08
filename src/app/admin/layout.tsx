import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { BrandMark } from "@/components/landing";
import { SERVICE_NAME } from "@/lib/brand";

// 全社管理者の画面に共通の上の帯。権限の確認は各画面で行う
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-3 sm:px-6">
          {/* マイページとログアウトの位置は、担当のトップ（AppShell）とそろえる */}
          <div className="flex items-center justify-between gap-3">
            <Link href="/coach" className="group flex items-center gap-3 font-bold">
              <BrandMark className="h-9 w-9 shrink-0" />
              <span>
                <span className="block text-xs font-medium text-muted">{SERVICE_NAME}</span>
                <span className="block text-base font-black">コタム管理画面</span>
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/mypage" className="flex items-center gap-1 font-bold text-brand-dark underline-offset-4 hover:underline">
                <span aria-hidden>👤</span>
                マイページ
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-secondary min-h-9 px-3 py-1 text-sm">
                  ログアウト
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </div>
      </header>
      {children}
    </>
  );
}
