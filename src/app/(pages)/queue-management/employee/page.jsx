"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import {
  useGetEmployeeAppointmentByTags,
  useGetEmployeeNotificationsByTags,
} from "./hooks/useEmployee";
import NotificationBell from "./components/NotificationBell";
import NotificationPanel from "../components/NotificationPanel";
import TodaySchedule from "./components/TodaySchedule";

export default function EmployeeDashboardPage() {
  const router = useRouter();

  const { data: employeeAppointments, isLoading: employeeAppointmentsLoading } =
    useGetEmployeeAppointmentByTags();

  const { data: employeeNotificationsData, isLoading: employeeNotificationsLoading } =
    useGetEmployeeNotificationsByTags();

  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (employeeNotificationsData) {
      const formattedNotifications = employeeNotificationsData.map((n) => ({
        ...n,
        notificationType: n.type,
      }));
      setNotifications(formattedNotifications);
    }
  }, [employeeNotificationsData]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Employee Dashboard
            </h1>
            <p className="mt-1 text-slate-500">สวัสดี, ภาพรวมงานของคุณสำหรับวันนี้</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/queue-management/employee/appointments")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              จัดการนัดหมายทั้งหมด
            </button>
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
          </div>
        </header>

        {/* Main Content: Today's Schedule */}
        <div className="grid grid-cols-1 gap-8">
          <div>
            <TodaySchedule
              router={router}
              appointments={employeeAppointments}
              loading={employeeAppointmentsLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
