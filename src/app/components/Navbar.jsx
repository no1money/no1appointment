"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Calendar, Users, X, Menu, Bell, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import NotificationItem from "./NotificationItem";

// 1. Import Custom Hooks
import { useLiff } from "./Provider/LiffProvider";
import { useGetCustomerNotification } from "../(pages)/queue-services/hooks/useAppointments";

export default function Navbar({ onProfileOpen = () => {} }) {
  const { liffProfile } = useLiff();
  // 2. Use the hook to get REAL notifications
  const { data: notifications, isLoading: notificationsLoading } = useGetCustomerNotification(
    liffProfile?.sub,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const isEmployee = (pathname || "").startsWith("/queue-management");

  const customerNotifications = notifications || [];

  const unreadCount = customerNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isNotificationOpen]);

  const handleMenuClick = (action) => {
    setIsMenuOpen(false);
    switch (action) {
      case "employee-appointments":
        router.push("/queue-management/employee");
        break;
      case "admin":
        router.push("/queue-management");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 1, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        className="absolute top-0 z-10 flex h-20 w-full items-center justify-around bg-white p-2 shadow-sm shadow-black/10"
      >
        <div className="flex w-full items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100"
          >
            <Menu size={32} />
          </button>
          <Link
            href={"/queue-services"}
            onClick={() => window.dispatchEvent(new CustomEvent("go-home"))}
            className="bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-xl font-bold text-transparent"
          >
            OKM Queue
          </Link>
        </div>

        {/* Notification Bell */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative flex cursor-pointer items-center justify-center rounded-full bg-white p-3 shadow-md transition-colors hover:bg-slate-50"
        >
          <Bell size={24} className="text-slate-600" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </motion.div>
      </motion.header>

      {/* Sliding Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4">
              <button onClick={() => setIsMenuOpen(false)} className="mb-4">
                <X />
              </button>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">เมนู</h2>
                <Link
                  href="/appointments/my-appointment"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg p-4 text-left transition-colors hover:bg-slate-200"
                >
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>คิวของฉัน</span>
                </Link>
                {isEmployee && (
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="mb-2 text-sm font-medium text-slate-600">เมนูพนักงาน</h3>
                    <Link
                      href={"/queue-management"}
                      onClick={() => handleMenuClick("admin")}
                      className="flex w-full items-center gap-3 rounded-lg p-4 text-left"
                    >
                      <User className="h-5 w-5 text-green-600" />
                      <span>จัดการระบบ</span>
                    </Link>
                    <Link
                      href={"/queue-management/employee"}
                      onClick={() => handleMenuClick("employee-appointments")}
                      className="mb-2 flex w-full items-center gap-3 rounded-lg p-4 text-left"
                    >
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>นัดหมายของฉัน</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {isNotificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            className="absolute top-20 right-4 z-50 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-xl"
            ref={notificationRef}
          >
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">การแจ้งเตือน</h3>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="rounded-lg p-1 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-96 space-y-3 overflow-y-auto">
                {notificationsLoading ? (
                  <p className="py-8 text-center text-slate-500">กำลังโหลด...</p>
                ) : customerNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>ไม่มีการแจ้งเตือน</p>
                  </div>
                ) : (
                  customerNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                )}
              </div>

              {customerNotifications.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <button className="w-full rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
                    ดูทั้งหมด
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
