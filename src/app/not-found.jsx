"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchX, ArrowLeft, Home, ListChecks } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-24">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-950 via-indigo-700 to-purple-500 text-white shadow-lg">
          <SearchX size={28} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">ไม่พบหน้า (404)</h1>
        <p className="mt-2 text-slate-600">
          ขอโทษด้วย เราไม่พบหน้าที่คุณต้องการ อาจถูกย้ายหรือลิงก์ไม่ถูกต้อง
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            กลับ
          </button>

          <Link
            href="/queue-services"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Home size={16} />
            หน้าหลัก
          </Link>

          <Link
            href="/appointments/my-appointment"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ListChecks size={16} />
            คิวของฉัน
          </Link>
        </div>
      </div>
    </main>
  );
}
