"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CalendarCheck2,
  CalendarX2,
  CalendarOff,
  MapPin,
  Video,
  Car,
  ChevronRight, // ลบ Tag ออกจากตรงนี้
  RotateCw,
  Search,
  CheckCircle2,
  XCircle,
  BadgeCheck,
} from "lucide-react";
import BottomNavbar from "../queue-services/components/BottomNavbar";
import { useGetHistoryAppointments } from "./hooks/useHistory";
import { useLiff } from "@/app/components/Provider/LiffProvider";

const STATUS_META = {
  COMPLETED: {
    label: "เสร็จสิ้น",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    bar: "from-emerald-600 to-emerald-400",
  },
  CANCELLED: {
    label: "ยกเลิก",
    color: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    bar: "from-rose-600 to-rose-400",
  },
  NO_SHOW: {
    label: "ไม่มา",
    color: "text-amber-800",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    bar: "from-amber-600 to-amber-400",
  },
  CONFIRMED: {
    label: "ยืนยันแล้ว",
    color: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    bar: "from-blue-600 to-blue-400",
  },
  OFFERED: {
    label: "เสนอเลื่อน",
    color: "text-violet-700",
    bg: "bg-violet-50",
    ring: "ring-violet-200",
    bar: "from-violet-600 to-violet-400",
  },
  ACCEPTED_BY_EMPLOYEE: {
    label: "พนักงานรับงาน",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    ring: "ring-indigo-200",
    bar: "from-indigo-600 to-indigo-400",
  },
  REJECTED_BY_EMPLOYEE: {
    label: "พนักงานปฏิเสธ",
    color: "text-slate-700",
    bg: "bg-slate-100",
    ring: "ring-slate-200",
    bar: "from-slate-600 to-slate-400",
  },
  PENDING: {
    label: "รอดำเนินการ",
    color: "text-slate-700",
    bg: "bg-slate-50",
    ring: "ring-slate-200",
    bar: "from-slate-500 to-slate-300",
  },
};

const TYPE_META = {
  ONSITE: { label: "Onsite", icon: MapPin, grad: "from-sky-900 via-sky-700 to-sky-400" },
  ONLINE: { label: "Online", icon: Video, grad: "from-indigo-950 via-indigo-700 to-sky-500" },
  OFFSITE: { label: "Offsite", icon: Car, grad: "from-slate-900 via-slate-700 to-zinc-500" },
};

function formatDate(d) {
  const dd = new Date(d);
  return dd.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short", // 'short' จะแสดงเป็น "ก.ย.", "ต.ค."
    day: "numeric",
    timeZone: "UTC", // <--- เพิ่มบรรทัดนี้
  });
}

function formatTimeRange(section, fallbackDate) {
  if (section) {
    if (typeof section === "string" && !section.includes(":")) {
      const hour = parseInt(section);
      return `${hour.toString().padStart(2, "0")}:00-${(hour + 1).toString().padStart(2, "0")}:00`;
    }
    return section;
  }
  const dd = new Date(fallbackDate);
  const hh = dd.getHours().toString().padStart(2, "0");
  return `${hh}:00-${(hh + 1).toString().padStart(2, "0")}:00`;
}

function groupByMonth(items) {
  return items.reduce((acc, it) => {
    const d = new Date(it.date);
    const key = d.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
    (acc[key] ||= []).push(it);
    return acc;
  }, {});
}

export default function QueueHistoryPage() {
  const { liffProfile } = useLiff();
  const {
    data: appointmentHistory,
    isLoading: appointmentHistoryLoading,
    isError: appointmentHistoryError,
  } = useGetHistoryAppointments(liffProfile?.sub);
  console.log("Appointment History: ", appointmentHistory);

  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const base = { COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0, CONFIRMED: 0, PENDING: 0 };
    if (appointmentHistory && Array.isArray(appointmentHistory)) {
      for (const a of appointmentHistory) {
        if (base[a.status] !== undefined) base[a.status] += 1;
      }
    }
    return base;
  }, [appointmentHistory]);

  const filtered = useMemo(() => {
    if (!appointmentHistory || !Array.isArray(appointmentHistory)) {
      return [];
    }

    let out = [...appointmentHistory];
    if (filter !== "ALL") out = out.filter((a) => a.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (a) =>
          a.note?.toLowerCase().includes(q) ||
          a.requiredTags?.some((t) => t.toLowerCase().includes(q)) ||
          TYPE_META[a.type]?.label.toLowerCase().includes(q),
      );
    }
    out.sort((a, b) => new Date(b.date) - new Date(a.date));
    return out;
  }, [appointmentHistory, filter, query]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);
  const months = Object.keys(grouped);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <header className="bg-gradient-to-b from-blue-950 via-indigo-700 to-purple-600 px-5 pt-24 pb-6 text-white shadow">
        <div className="mx-auto max-w-xl">
          <h1 className="text-lg font-semibold">ประวัติการจอง</h1>
          <p className="mt-0.5 text-sm text-white/80">ดูคิวที่ผ่านมาและสถานะย้อนหลัง</p>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <KPI
              label="เสร็จสิ้น"
              icon={CheckCircle2}
              value={stats.COMPLETED}
              color="text-emerald-300"
            />
            <KPI label="ยกเลิก" icon={XCircle} value={stats.CANCELLED} color="text-rose-300" />
            <KPI label="ไม่มา" icon={CalendarOff} value={stats.NO_SHOW} color="text-amber-300" />
            <KPI label="รอดำเนินการ" icon={BadgeCheck} value={stats.PENDING} color="text-sky-300" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-white/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาจากโน้ต ประเภท หรือแท็ก…"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-9 py-2 text-sm placeholder:text-white/70 focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            {["ALL", "PENDING", "COMPLETED", "CANCELLED", "NO_SHOW", "CONFIRMED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-2 py-1 font-medium transition ${
                  filter === s
                    ? "bg-white text-indigo-700"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {s === "ALL" ? "All" : STATUS_META[s]?.label || s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-xl space-y-6 px-4 py-6">
        {appointmentHistoryLoading ? (
          <LoadingHistory />
        ) : appointmentHistoryError ? (
          <ErrorHistory />
        ) : months.length === 0 ? (
          <EmptyHistory />
        ) : (
          months.map((m) => (
            <div key={m} className="space-y-3">
              <h2 className="px-1 text-sm font-semibold text-slate-600">{m}</h2>
              <div className="space-y-3">
                {grouped[m].map((a) => (
                  <HistoryCard key={a.id} a={a} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <BottomNavbar />
    </main>
  );
}

function KPI({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-lg bg-white/10 py-2">
      <div className={`flex items-center justify-center gap-1 text-xs ${color}`}>
        {Icon ? <Icon size={14} /> : null}
        <span>{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function HistoryCard({ a }) {
  const status = STATUS_META[a.status] || STATUS_META.PENDING;
  const type = TYPE_META[a.type] || TYPE_META.ONSITE;
  const TypeIcon = type.icon;

  const getTitleContent = () => {
    switch (a.type) {
      case "ONSITE":
        return a.branchId;
      case "ONLINE":
        return TYPE_META.ONLINE.label;
      case "OFFSITE": {
        if (!a.note) return "นัดหมายนอกสถานที่";
        const keyword = "สถานที่นัดหมาย: ";
        const parts = a.note.split(keyword);
        if (parts.length > 1) {
          return parts[1].trim();
        }
        return a.note;
      }
      default:
        return a.branchId;
    }
  };
  const titleContent = getTitleContent();
  // --- END: MODIFIED SECTION ---

  return (
    <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm shadow-black/15">
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b ${type.grad} text-white`}
            >
              <TypeIcon size={18} />
            </div>
            <div>
              {/* --- START: MODIFIED LINE --- */}
              <div className="truncate text-sm font-semibold text-slate-900" title={titleContent}>
                {titleContent}
              </div>
              {/* --- END: MODIFIED LINE --- */}
              <div className="text-xs text-slate-500">
                {formatDate(a.date)} · {formatTimeRange(a.section, a.date)}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${status.bg} ${status.color} ring-1 ${status.ring}`}
          >
            {status.label}
          </span>
        </div>

        {a.note ? (
          <p className="mt-3 line-clamp-2 text-sm text-slate-700">บริการ : {a.serviceType}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-400">ไม่มีรายละเอียดเพิ่มเติม</p>
        )}

        {/* --- START: REMOVED TAGS SECTION --- */}
        {/* The entire tags block has been removed from here. */}
        {/* --- END: REMOVED TAGS SECTION --- */}

        {a.employeeResponse === "OFFER" && a.offerDate && (
          <div className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700 ring-1 ring-violet-200">
            เสนอเลื่อนนัด: {formatDate(a.offerDate)}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/appointments/my-appointment/${a.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            รายละเอียด <ChevronRight size={16} />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/queue-services"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              จองอีกครั้ง
            </Link>
            <Link
              href="/appointments/my-appointment"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              ดูคิวปัจจุบัน
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-950 via-indigo-700 to-purple-500 text-white shadow-lg">
        <CalendarClock size={28} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">ยังไม่มีประวัติการจอง</h3>
      <p className="mt-1 text-sm text-slate-600">เมื่อมีการจองเสร็จสิ้น จะปรากฏที่หน้านี้</p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <Link
          href="/queue-services"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          เริ่มจองใหม่
        </Link>
        <Link
          href="/appointments/my-appointment"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ไปที่คิวของฉัน
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <CalendarCheck2 size={14} /> Completed
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarX2 size={14} /> Cancelled
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarOff size={14} /> No show
        </span>
      </div>
    </div>
  );
}

function LoadingHistory() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-950 via-indigo-700 to-purple-500 text-white shadow-lg">
        <RotateCw size={28} className="animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">กำลังโหลดประวัติ</h3>
      <p className="mt-1 text-sm text-slate-600">กรุณารอสักครู่...</p>
    </div>
  );
}

function ErrorHistory() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-red-600 to-red-400 text-white shadow-lg">
        <XCircle size={28} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">เกิดข้อผิดพลาด</h3>
      <p className="mt-1 text-sm text-slate-600">ไม่สามารถโหลดประวัติการจองได้</p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RotateCw size={16} />
          ลองใหม่
        </button>
        <Link
          href="/queue-services"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}