"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  UserCheck,
  Power,
  PowerOff,
  X,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import NotificationPanel from "./components/NotificationPanel";

const mockEmployees = [
  {
    adminId: "68aea10ba4d0d8f4b37327cc",
    username: "nakasen",
    fullName: "นาคเสน พุทธเจริญ",
    staffId: "OKM011",
    centralRole: ["admin", "ENGINEER"],
    isActive: true,
    hasCurrentTask: true,
  },
  {
    adminId: "68aea10ba4d0d8f4b37327cd",
    username: "somchai",
    fullName: "สมชาย ใจดี",
    staffId: "OKM012",
    centralRole: ["REFINANCE"],
    isActive: true,
    hasCurrentTask: false,
  },
  {
    adminId: "68aea10ba4d0d8f4b37327ce",
    username: "somsri",
    fullName: "สมศรี มีสุข",
    staffId: "OKM013",
    centralRole: ["GENERAL"],
    isActive: false,
    hasCurrentTask: false,
  },
];

const initialMockNotifications = [
  {
    id: 1,
    notificationType: "NEW_BOOKING_REQUEST",
    title: "มีคำจองใหม่",
    description: "คุณสมศรีได้ทำการจองคิวประเภท ONSITE",
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
  },
  {
    id: 2,
    notificationType: "BOOKING_CANCELLED_BY_USER_ALERT",
    title: "ยกเลิกคิว",
    description: "คุณสมชายได้ยกเลิกนัดหมายวันที่ 2 ก.ย.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: 3,
    notificationType: "SYSTEM_ANNOUNCEMENT",
    title: "ประกาศจากระบบ",
    description: "จะมีการปิดปรับปรุงระบบในเวลา 23:00",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: 4,
    notificationType: "FEEDBACK_REQUEST",
    title: "ได้รับ Feedback ใหม่",
    description: "ลูกค้าให้คะแนน 5 ดาว สำหรับบริการล่าสุด",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
  },
];

// --- Main Component ---

export default function QueueManagementPage() {
  const kpiData = {
    pending: 5,
    confirmed: 12,
    completedToday: 23,
    cancelledToday: 4,
  };

  const [notifications, setNotifications] = useState(initialMockNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 py-24 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-slate-500">ภาพรวมและจัดการร้านของคุณ</p>
          </div>
          <NotificationBell
            unreadCount={unreadCount}
            isOpen={isNotificationOpen}
            setIsOpen={setIsNotificationOpen}
          >
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setIsNotificationOpen(false)}
            />
          </NotificationBell>
        </header>

        {/* KPIs Section */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="คิวรอดำเนินการ" value={kpiData.pending} icon={Clock} color="amber" />
          <KpiCard
            title="คิวยืนยันแล้ว"
            value={kpiData.confirmed}
            icon={CheckCircle}
            color="blue"
          />
          <KpiCard
            title="สำเร็จวันนี้"
            value={kpiData.completedToday}
            icon={UserCheck}
            color="emerald"
          />
          <KpiCard
            title="ยกเลิกวันนี้"
            value={kpiData.cancelledToday}
            icon={XCircle}
            color="rose"
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EmployeeStatus employees={mockEmployees} />
          </div>
          <div className="lg:col-span-1">
            <StoreConfiguration />
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Sub-components for this page ---

function NotificationBell({ unreadCount, isOpen, setIsOpen, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>{isOpen && children}</AnimatePresence>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }) {
  const colors = {
    amber: "from-amber-500 to-yellow-500",
    blue: "from-blue-600 to-sky-500",
    emerald: "from-emerald-600 to-green-500",
    rose: "from-rose-600 to-red-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase">{title}</h3>
          <Icon className="h-7 w-7 text-white/50" />
        </div>
        <p className="mt-2 text-4xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function EmployeeStatus({ employees }) {
  const activeEmployees = employees.filter((e) => e.isActive);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">พนักงานที่เข้างานวันนี้</h2>
          <p className="text-sm text-slate-500">
            {activeEmployees.length} จาก {employees.length} คน
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {activeEmployees.map((emp) => (
          <div
            key={emp.adminId}
            className="flex items-center justify-between rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <span className="font-semibold">{emp.fullName.charAt(0)}</span>
                </div>
                <span
                  className={`absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full ${
                    emp.hasCurrentTask ? "bg-emerald-500" : "bg-slate-400"
                  } ring-2 ring-slate-50`}
                ></span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{emp.fullName}</p>
                <div className="flex items-center gap-1.5">
                  {emp.centralRole.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  emp.hasCurrentTask ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {emp.hasCurrentTask ? "กำลังให้บริการ" : "ว่าง"}
              </p>
              <p className="text-xs text-slate-400">ID: {emp.staffId}</p>
            </div>
          </div>
        ))}
        {activeEmployees.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-500">ไม่มีพนักงานที่เข้างานในวันนี้</p>
        )}
      </div>
    </div>
  );
}

function StoreConfiguration() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 text-white">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">ตั้งค่าร้านค้า</h2>
          <p className="text-sm text-slate-500">จัดการสถานะและการแจ้งเตือน</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
          <div className="flex items-center gap-2">
            {isStoreOpen ? (
              <Power className="h-5 w-5 text-emerald-500" />
            ) : (
              <PowerOff className="h-5 w-5 text-rose-500" />
            )}
            <span className="font-semibold">
              สถานะร้าน: {isStoreOpen ? "เปิดให้บริการ" : "ปิดให้บริการ"}
            </span>
          </div>
          <button
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white shadow-sm ${
              isStoreOpen ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isStoreOpen ? "ปิดร้านทันที" : "เปิดร้าน"}
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <h3 className="font-semibold text-slate-700">แจ้งปิดร้านล่วงหน้า</h3>
        <form className="mt-3 space-y-3">
          <div>
            <label htmlFor="close-date" className="mb-1 block text-sm font-medium text-slate-600">
              วันที่ปิด
            </label>
            <input
              type="date"
              id="close-date"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="close-reason" className="mb-1 block text-sm font-medium text-slate-600">
              เหตุผล (ไม่จำเป็น)
            </label>
            <textarea
              id="close-reason"
              rows={3}
              placeholder="เช่น ปรับปรุงร้าน, หยุดกรณีพิเศษ"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            ตั้งเวลาปิดร้าน
          </button>
        </form>
      </div>
    </div>
  );
}
