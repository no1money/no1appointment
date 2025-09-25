"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Building,
  Wrench,
  User,
  Calendar,
  Clock,
  BadgeCheck,
  XCircle,
  CalendarOff,
  CheckCircle2,
} from "lucide-react";
import InfoPill from "./InfoPill";

export default function LatestAppointmentCard({ appointment, loading }) {
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  if (loading) {
    return (
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/50 shadow-sm"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="p-6 pl-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-slate-100" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            </div>

            <div className="my-4 border-t border-slate-200/90" />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!appointment) {
    return null;
  }

  const typeMap = {
    ONSITE: {
      label: "หน้าร้าน",
      grad: "from-sky-900 via-sky-700 to-sky-400",
      icon: <Building className="h-5 w-5" />,
    },
    ONLINE: {
      label: "ออนไลน์",
      grad: "from-indigo-950 via-indigo-700 to-sky-500",
      icon: <Smartphone className="h-5 w-5" />,
    },
    OFFSITE: {
      label: "นอกสถานที่",
      grad: "from-slate-900 via-slate-700 to-zinc-500",
      icon: <Wrench className="h-5 w-5" />,
    },
  };

  const statusMap = {
    PENDING: { label: "รอดำเนินการ", badge: "bg-slate-100 text-slate-700", Icon: Calendar },
    CONFIRMED: { label: "ยืนยันแล้ว", badge: "bg-blue-50 text-blue-700", Icon: BadgeCheck },
    COMPLETED: { label: "เสร็จสิ้น", badge: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
    CANCELLED: { label: "ยกเลิก", badge: "bg-rose-50 text-rose-700", Icon: XCircle },
    NO_SHOW: { label: "ไม่มาตามนัด", badge: "bg-amber-50 text-amber-800", Icon: CalendarOff },
  };

  const type = typeMap[appointment.type] || typeMap.ONSITE;
  const status = statusMap[appointment.status] || statusMap.PENDING;
  const formatUTCTimeString = (isoString) => {
    if (!isoString) return "";
  
    return new Date(isoString).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC", // <--- เปลี่ยนเป็น UTC ที่นี่
    });
  };

  if (appointment !== null)
    return (
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <motion.div
          whileHover={{
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/50 shadow-lg"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          {/* Decorative Gradient Border */}

          <div className="p-6 pl-8">
            {/* Header Section */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b ${type.grad} text-white`}
                >
                  {type.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{type.label}</h3>
                  <p className="text-sm text-slate-500">{appointment.note}</p>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.badge}`}
              >
                {status.Icon ? <status.Icon size={14} /> : null}
                {status.label}
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-200/90" />

            {/* Details Section */}
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <InfoPill
                icon={<Calendar className="h-4 w-4 text-blue-500" />}
                label={new Date(appointment.date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoPill
  icon={<Clock className="h-4 w-4 text-indigo-500" />}
  label={`${formatUTCTimeString(appointment.date)} น.`}
/>
            </div>

            {/* Footer Section */}
            <div className="mt-5 border-t border-slate-200/90 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">พนักงาน:</span>
                {appointment.adminInfo && appointment.adminInfo.fullName ? (
                  <div className="flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-800">
                      {appointment.adminInfo.fullName}
                    </span>
                  </div>
                ) : (
                  <div className="flex animate-pulse items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500">รอการยืนยัน</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
}
