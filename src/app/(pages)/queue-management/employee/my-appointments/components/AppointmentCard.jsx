"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Building,
  Smartphone,
  Wrench,
  Clock,
  Calendar,
  User,
  Phone,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ClockIcon,
  AlertCircle,
  BadgeCheck,
  CalendarOff,
  KeyRound,
} from "lucide-react";
import Swal from "sweetalert2";

import DateTimeOfferPicker from "@/app/components/DateTimeOfferPicker";

export default function AppointmentCard({
  appointment,
  index,
  onAction,
  showDatePicker,
  setShowDatePicker,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onOfferDateTime,
  loadingActions = {},
}) {
  // State to manage which action is currently active for authentication
  const [activeAction, setActiveAction] = useState(null); // Can be 'ACCEPT', 'REJECT', or 'OFFER'

  // State for the authentication form
  const [username, setUsername] = useState("OKM001");
  const [password, setPassword] = useState("");

  // Employee ID options for the dropdown
  const employeeOptions = Array.from({ length: 11 }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    const id = `OKM${num}`;
    return { value: id, label: id };
  });

  const typeMap = {
    ONSITE: {
      label: "หน้าร้าน",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      icon: <Building className="h-6 w-6" />,
      borderColor: "border-blue-200",
      color: "blue",
    },
    ONLINE: {
      label: "ออนไลน์",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      icon: <Smartphone className="h-6 w-6" />,
      borderColor: "border-green-200",
      color: "green",
    },
    OFFSITE: {
      label: "นอกสถานที่",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      icon: <Wrench className="h-6 w-6" />,
      borderColor: "border-purple-200",
      color: "purple",
    },
  };

  const statusMap = {
    PENDING: {
      label: "รอตอบกลับ",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <ClockIcon className="h-4 w-4" />,
    },
    CONFIRMED: {
      label: "ลูกค้ายืนยัน",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <BadgeCheck className="h-4 w-4" />,
    },
    ACCEPTED_BY_EMPLOYEE: {
      label: "รับทำแล้ว",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    REJECTED_BY_EMPLOYEE: {
      label: "ปฏิเสธแล้ว",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: <XCircle className="h-4 w-4" />,
    },
    OFFERED: {
      label: "เสนอเวลาใหม่",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: <Clock className="h-4 w-4" />,
    },
    CANCELLED: {
      label: "ยกเลิกแล้ว",
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
      icon: <CalendarOff className="h-4 w-4" />,
    },
    UNKNOWN: {
      label: "สถานะไม่ทราบ",
      color: "text-gray-600",
      bg: "bg-gray-100",
      border: "border-gray-200",
      icon: <AlertCircle className="h-4 w-4" />,
    },
  };

  const type = typeMap[appointment.type] || {
    label: "ไม่ระบุ",
    gradient: "from-gray-500 to-gray-600",
    bgGradient: "from-gray-50 to-gray-100",
    icon: <Building className="h-6 w-6" />,
    borderColor: "border-gray-200",
    color: "gray",
  };
  const status = statusMap[appointment.status] || statusMap.UNKNOWN;
  const isPending = appointment.status === "PENDING";

  const isAcceptLoading = loadingActions[`${appointment.id}-ACCEPT`];
  const isRejectLoading = loadingActions[`${appointment.id}-REJECT`];
  const isOfferLoading = loadingActions[`${appointment.id}-OFFER`];
  const isAnyLoading = isAcceptLoading || isRejectLoading || isOfferLoading;

  const handleActionClick = (action) => {
    setActiveAction(action);
    if (action === "OFFER") {
      setShowDatePicker(appointment.id);
    }
  };

  const handleCancelAction = () => {
    setActiveAction(null);
    setPassword("");
    if (showDatePicker === appointment.id) {
      setShowDatePicker(null);
    }
  };

  // Submits the action after authentication
  const handleConfirmAction = () => {
    if (!password) {
      Swal.fire({ title: "กรุณากรอกรหัสผ่าน", icon: "warning" });
      return;
    }
    const auth = { username, password };

    if (activeAction === "OFFER") {
      onOfferDateTime(appointment.id, auth);
    } else {
      onAction(appointment.id, activeAction, null, auth);
    }
    // Reset state after submission
    setActiveAction(null);
    setPassword("");
  };

  // When a new date/time is confirmed in the picker, show the auth form
  const handleOfferDatePicked = () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({ title: "กรุณาเลือกวันที่และเวลา", icon: "warning" });
      return;
    }
    setActiveAction("OFFER");
  };

  // UI details for the authentication section based on the active action
  const authActionDetails = {
    ACCEPT: {
      title: "ยืนยันตัวตนเพื่อรับงาน",
      color: "emerald",
      confirmText: "ยืนยันรับงาน",
    },
    REJECT: {
      title: "ยืนยันตัวตนเพื่อปฏิเสธ",
      color: "rose",
      confirmText: "ยืนยันการปฏิเสธ",
    },
    OFFER: {
      title: "ยืนยันตัวตนเพื่อเสนอเวลาใหม่",
      color: "indigo",
      confirmText: "ยืนยันและเสนอเวลา",
    },
  };
  const currentAuthDetails = authActionDetails[activeAction] || {};

  return (
    <div className="group">
      <div
        className={`relative overflow-hidden rounded-2xl border bg-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-xl ${type.borderColor}`}
      >
        <div className="p-5">
          {/* Card Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl bg-gradient-to-br p-2.5 ${type.bgGradient} border ${type.borderColor}`}
              >
                {/* --- ICON FIX: Applied a direct text color to the icon --- */}
                <div className={`text-${type.color}-500`}>{type.icon}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{type.label}</h3>
                <div
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${status.bg} ${status.border} ${status.color}`}
                >
                  {status.icon}
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                {appointment.customer?.picture_url ? (
                  <Image
                    src={appointment.customer.picture_url}
                    width={40}
                    height={40}
                    alt={appointment.customer.fullname || "user-profile-image"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">
                  {appointment.customer?.fullname ||
                    appointment.customer?.line_display_name ||
                    "ไม่ระบุชื่อ"}
                </h4>
                {appointment.customer?.phone && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="text-xs">{appointment.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
            {appointment.note && (
              <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                <p className="text-xs leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-800">รายละเอียด:</span> {appointment.note}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {appointment.requiredTags?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {appointment.requiredTags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-medium ${type.gradient} text-white shadow-sm`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Date & Time */}
          <div className="mb-5 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2.5">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-slate-500">วันที่</p>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(appointment.date).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2.5">
              <Clock className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs text-slate-500">เวลา</p>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(appointment.date).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  น.
                </p>
              </div>
            </div>
          </div>

          {/* --- ACTION SECTION --- */}
          {isPending && (
            <AnimatePresence mode="wait">
              {!activeAction ? (
                // STATE 1: Default Action Buttons
                <motion.div
                  key="action-buttons"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleActionClick("ACCEPT")}
                      disabled={isAnyLoading}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      {isAcceptLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      รับทำ
                    </button>
                    <button
                      onClick={() => handleActionClick("REJECT")}
                      disabled={isAnyLoading}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      {isRejectLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      ปฏิเสธ
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      setShowDatePicker(showDatePicker === appointment.id ? null : appointment.id)
                    }
                    disabled={isAnyLoading}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    {isOfferLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    เสนอเวลาใหม่
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${showDatePicker === appointment.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  <DateTimeOfferPicker
                    isOpen={showDatePicker === appointment.id}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    onConfirm={handleOfferDatePicked}
                    isLoading={isOfferLoading}
                  />
                </motion.div>
              ) : (
                // STATE 2: Authentication Form
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`space-y-3 rounded-xl border bg-white p-3 shadow-sm border-${currentAuthDetails.color}-200`}
                >
                  <h4 className={`text-sm font-semibold text-${currentAuthDetails.color}-700`}>
                    {currentAuthDetails.title}
                  </h4>
                  <div>
                    <label
                      htmlFor={`employee-select-${appointment.id}`}
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      เลือกพนักงาน
                    </label>
                    <select
                      id={`employee-select-${appointment.id}`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {employeeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`password-input-${appointment.id}`}
                      className="mb-1.5 block text-xs font-medium text-slate-600"
                    >
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        id={`password-input-${appointment.id}`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่าน"
                        className="w-full rounded-md border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCancelAction}
                      className="flex-1 cursor-pointer rounded-md bg-slate-100 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmAction}
                      disabled={!password || isAnyLoading}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-${currentAuthDetails.color}-500 py-2 text-xs font-medium text-white transition hover:bg-${currentAuthDetails.color}-600 disabled:cursor-not-allowed disabled:bg-slate-300`}
                    >
                      {isAnyLoading ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>กำลังยืนยัน...</span>
                        </>
                      ) : (
                        currentAuthDetails.confirmText
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Card Footer */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-400">
              สร้างเมื่อ:{" "}
              {new Date(appointment.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
