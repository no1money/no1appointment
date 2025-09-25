"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Bell,
  Inbox,
  Mail,
  CalendarPlus,
  XCircle,
  Megaphone,
  UserCheck,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { th } from "date-fns/locale";

// --- Mock Data (Expanded for this page) ---
const mockAllNotifications = [
  // Recent
  {
    id: 1,
    notificationType: "NEW_BOOKING_REQUEST",
    title: "มีคำจองใหม่จากคุณสมหญิง",
    description: "จองคิว ONSITE สำหรับวันที่ 5 ก.ย. เวลา 14:00",
    createdAt: new Date(),
    isRead: false,
    recipient: { type: "EMPLOYEE" },
  },
  {
    id: 2,
    notificationType: "BOOKING_CANCELLED_BY_USER_ALERT",
    title: "คุณสมชายยกเลิกนัด",
    description: "ยกเลิกนัดหมายวันที่ 4 ก.ย. เนื่องจากไม่สะดวก",
    createdAt: subDays(new Date(), 1),
    isRead: false,
    recipient: { type: "EMPLOYEE" },
  },
  // This week
  {
    id: 3,
    notificationType: "FEEDBACK_REQUEST",
    title: "ได้รับ Feedback 5 ดาว",
    description: "จากบริการของพนักงานนาคเสน",
    createdAt: subDays(new Date(), 2),
    isRead: true,
    recipient: { type: "EMPLOYEE" },
  },
  {
    id: 4,
    notificationType: "SYSTEM_ANNOUNCEMENT",
    title: "ปิดปรับปรุงระบบคืนนี้",
    description: "ระบบจะปิดให้บริการเวลา 23:00 - 01:00",
    createdAt: subDays(new Date(), 3),
    isRead: false,
    recipient: { type: "EMPLOYEE" },
  },
  {
    id: 5,
    notificationType: "NEW_BOOKING_REQUEST",
    title: "มีคำจองใหม่จากคุณวิชัย",
    description: "จองคิว ONLINE สำหรับวันที่ 10 ก.ย. เวลา 11:00",
    createdAt: subDays(new Date(), 4),
    isRead: true,
    recipient: { type: "EMPLOYEE" },
  },
  // Last month
  {
    id: 6,
    notificationType: "PROMOTION_ALERT",
    title: "โปรโมชั่นใหม่เดือนกันยายน",
    description: "ส่วนลด 15% สำหรับบริการ REFINANCE",
    createdAt: subDays(new Date(), 15),
    isRead: true,
    recipient: { type: "EMPLOYEE" },
  },
  {
    id: 7,
    notificationType: "BOOKING_MODIFIED_BY_STAFF",
    title: "คุณได้เลื่อนนัดลูกค้า",
    description: "เลื่อนนัดของคุณสมศรีเป็นวันที่ 20 ก.ย.",
    createdAt: subDays(new Date(), 20),
    isRead: true,
    recipient: { type: "EMPLOYEE" },
  },
  // Customer notification (to be filtered out)
  {
    id: 8,
    notificationType: "QUEUE_REMINDER_UPCOMING",
    title: "แจ้งเตือนคิวของคุณ",
    description: "คิวของคุณจะเริ่มในอีก 1 ชั่วโมง",
    createdAt: new Date(),
    isRead: false,
    recipient: { type: "CUSTOMER" },
  },
  // Generate more data for pagination
  ...Array.from({ length: 45 }, (_, i) => ({
    id: 9 + i,
    notificationType: i % 3 === 0 ? "NEW_BOOKING_REQUEST" : "FEEDBACK_REQUEST",
    title: `มีรายการใหม่ #${i + 1}`,
    description: `รายละเอียดของรายการที่ ${i + 1}`,
    createdAt: subDays(new Date(), 5 + i),
    isRead: i % 2 === 0,
    recipient: { type: "EMPLOYEE" },
  })),
];

const NOTIFICATION_META = {
  NEW_BOOKING_REQUEST: { icon: CalendarPlus, color: "text-blue-500", category: "Bookings" },
  BOOKING_CANCELLED_BY_USER_ALERT: { icon: XCircle, color: "text-rose-500", category: "Alerts" },
  SYSTEM_ANNOUNCEMENT: { icon: Megaphone, color: "text-purple-500", category: "System" },
  FEEDBACK_REQUEST: { icon: UserCheck, color: "text-emerald-500", category: "General" },
  PROMOTION_ALERT: { icon: Megaphone, color: "text-sky-500", category: "System" },
  BOOKING_MODIFIED_BY_STAFF: { icon: CalendarPlus, color: "text-indigo-500", category: "Bookings" },
  DEFAULT: { icon: Bell, color: "text-slate-500", category: "General" },
};

const categories = [
  { id: "all", label: "ทั้งหมด", icon: Inbox },
  { id: "unread", label: "ยังไม่อ่าน", icon: Mail },
  { id: "bookings", label: "การจองและคิว", icon: CalendarPlus },
  { id: "alerts", label: "การแจ้งเตือนด่วน", icon: XCircle },
  { id: "system", label: "ประกาศจากระบบ", icon: Megaphone },
];

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState(mockAllNotifications);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all_time");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- Memoized Filtering ---
  const employeeNotifications = useMemo(() => {
    return notifications
      .filter((n) => n.recipient.type === "EMPLOYEE")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let items = [...employeeNotifications];
    if (activeCategory === "unread") items = items.filter((n) => !n.isRead);
    else if (activeCategory !== "all") {
      const categoryTypes = Object.entries(NOTIFICATION_META)
        .filter(([, meta]) => meta.category.toLowerCase() === activeCategory)
        .map(([type]) => type);
      items = items.filter((n) => categoryTypes.includes(n.notificationType));
    }
    if (dateFilter === "today")
      items = items.filter(
        (n) => new Date(n.createdAt).toDateString() === new Date().toDateString(),
      );
    else if (dateFilter === "last_7_days")
      items = items.filter((n) => new Date(n.createdAt) >= subDays(new Date(), 7));
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(lowercasedQuery) ||
          n.description.toLowerCase().includes(lowercasedQuery),
      );
    }
    return items;
  }, [employeeNotifications, activeCategory, dateFilter, searchQuery]);

  // --- Memoized Pagination Calculation ---
  const currentNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage, itemsPerPage]);

  // --- Effect to reset page on filter change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, dateFilter, itemsPerPage]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadCount = employeeNotifications.filter((n) => !n.isRead).length;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-b from-slate-50 to-white/50 px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900">ศูนย์การแจ้งเตือน</h1>
          <p className="mt-1 text-slate-500">
            คุณมีการแจ้งเตือนที่ยังไม่ได้อ่าน {unreadCount} รายการ
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isUnread = cat.id === "unread";
                const count = isUnread ? unreadCount : 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeCategory === cat.id ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="flex-1">{cat.label}</span>
                    {isUnread && count > 0 && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-600">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Controls */}
            <div className="mb-4 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
              <div className="relative flex-grow">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาการแจ้งเตือน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all_time">เวลาทั้งหมด</option>
                  <option value="today">วันนี้</option>
                  <option value="last_7_days">7 วันล่าสุด</option>
                </select>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={10}>10 / หน้า</option>
                  <option value={20}>20 / หน้า</option>
                  <option value={50}>50 / หน้า</option>
                </select>
              </div>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
              {currentNotifications.length > 0 ? (
                currentNotifications.map((n) => {
                  const meta = NOTIFICATION_META[n.notificationType] || NOTIFICATION_META.DEFAULT;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id)}
                      className={`relative flex cursor-pointer items-start gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-blue-500 ${n.isRead ? "border-slate-200" : "border-blue-400"}`}
                    >
                      {!n.isRead && (
                        <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                      )}
                      <div className={`mt-1 flex-shrink-0 ${meta.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-sm text-slate-600">{n.description}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {format(new Date(n.createdAt), "d MMM yyyy, HH:mm", { locale: th })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white py-24 text-center">
                  <Inbox className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-semibold text-slate-800">ไม่พบการแจ้งเตือน</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    ลองปรับเปลี่ยนตัวกรองของคุณ หรือกลับมาตรวจสอบใหม่ภายหลัง
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredNotifications.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Pagination Component ---
function PaginationControls({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <div className="text-sm text-slate-600">
        แสดง <span className="font-semibold">{startItem}</span> -{" "}
        <span className="font-semibold">{endItem}</span> จาก{" "}
        <span className="font-semibold">{totalItems}</span> รายการ
      </div>
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-500 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </button>

        {/* Page numbers can be dynamically generated here for more complex scenarios */}
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 ring-inset">
          หน้า {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-500 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
