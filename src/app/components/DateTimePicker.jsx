"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { th } from "date-fns/locale";
import { addDays, format, isSameDay } from "date-fns";
import {
  ArrowLeft,
  Wrench,
  Building,
  Smartphone,
  Calendar,
  MapPin,
  ChevronsRight,
} from "lucide-react";
import { useGetAvailability } from "../(pages)/queue-services/hooks/useAppointments";

const HOURS = Array.from({ length: 9 }, (_, i) => 11 + i); // 11, 12, ..., 19

const slotLabel = (startHour, duration = 1) =>
  `${String(startHour).padStart(2, "0")}:00-${String(
    startHour + duration,
  ).padStart(2, "0")}:00`;

export default function DateTimePicker({ formData, setFormData, setAppState }) {
  
  // ========================================================================
  // --- การเปลี่ยนแปลงที่สำคัญอยู่ตรงนี้ ---
  // ย้าย daysList เข้ามาใน component และใช้ useMemo เพื่อให้คำนวณครั้งเดียว
  // ========================================================================
  const daysList = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  const [locationType, setLocationType] = useState(
    formData.appointmentType || "onsite",
  );
  // ทำให้ selectedDate เริ่มต้นจาก list ที่สดใหม่อยู่เสมอ
  const [selectedDate, setSelectedDate] = useState(daysList[0]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, appointmentType: locationType }));
  }, [locationType, setFormData]);

  const {
    data: availability,
    isLoading,
    error,
  } = useGetAvailability(selectedDate);

  const getSlotState = (day, slot) => {
    // ... โค้ดส่วนนี้เหมือนเดิม ไม่ต้องแก้ไข ...
    if (locationType === "offsite") {
      const offsiteData = availability?.summary?.OFFSITE_REFINANCE || {
        used: 0,
        cap: 1,
      };
      const { used, cap } = offsiteData;
      const full = used >= cap;
      return { used, cap, full, reason: full ? "คิวนอกสถานที่เต็มแล้ว" : "" };
    }
    const hour = HOURS[slot.startIndex];
    const availabilityForHour = availability?.[hour];
    if (!availabilityForHour) {
      return { used: 0, cap: 0, full: true, reason: "กำลังตรวจสอบ..." };
    }
    let slotData;
    switch (formData.serviceType) {
      case "รีไฟแนนซ์":
        if (locationType === "online") {
          slotData = availabilityForHour.REFINANCE_ONLINE;
        } else {
          slotData = availabilityForHour.REFINANCE;
        }
        break;
      case "ซ่อมมือถือ":
        slotData = availabilityForHour.ENGINEER;
        break;
      default:
        slotData = availabilityForHour.GENERAL;
        break;
    }
    if (!slotData) {
      return { used: 0, cap: 0, full: true, reason: "ไม่มีบริการนี้" };
    }
    const { used, cap } = slotData;
    const full = used >= cap;
    let reason = "";
    if (full) {
      if (formData.serviceType === "ซ่อมมือถือ" && cap === 0) {
        reason = "มีงานซ่อมด่วน";
      } else if (
        formData.serviceType === "รีไฟแนนซ์" &&
        locationType === "online" &&
        cap === 0
      ) {
        reason = "พนักงานไม่พอสำหรับคิวออนไลน์";
      } else {
        reason = "คิวเต็มแล้ว";
      }
    }
    return { used, cap, full, reason };
  };

  // Logic การ filter เวลาที่ถูกต้อง (ทำงานร่วมกับ daysList ที่สดใหม่)
  const hourlySlots = useMemo(() => {
    const now = new Date();
    const isToday = isSameDay(selectedDate, now);
    const currentHour = now.getHours();

    if (!isToday) {
      // ถ้าไม่ใช่วันนี้ แสดงทุกช่วงเวลา
      return HOURS.map((h) => ({
        startIndex: HOURS.indexOf(h),
        label: slotLabel(h, 1),
      }));
    }

    // ถ้าเป็นวันนี้ ให้กรองเฉพาะเวลาที่ยังมาไม่ถึง
    const availableHours = HOURS.filter((hour) => hour > currentHour);

    return availableHours.map((h) => ({
      startIndex: HOURS.indexOf(h),
      label: slotLabel(h, 1),
    }));
  }, [selectedDate]);

  const onlineBookingSlots = useMemo(() => {
    const now = new Date();
    const isToday = isSameDay(selectedDate, now);
    const currentHour = now.getHours();
    const baseHours = HOURS.slice(0, -1);

    if (!isToday) {
       return baseHours.map((h) => ({
        startIndex: HOURS.indexOf(h),
        label: slotLabel(h, 2),
      }));
    }
    
    const availableHours = baseHours.filter((hour) => hour > currentHour);

    return availableHours.map((h) => ({
      startIndex: HOURS.indexOf(h),
      label: slotLabel(h, 2),
    }));
  }, [selectedDate]);

  // ... ส่วนที่เหลือของ component (handleBook, return JSX) เหมือนเดิมทั้งหมด ...
  const handleBook = (day, slot) => {
    const selectedHour = HOURS[slot.startIndex];
    const appointmentDateTime = new Date(day);
    appointmentDateTime.setHours(selectedHour, 0, 0, 0);

    setFormData((prev) => ({
      ...prev,
      appointmentAt: appointmentDateTime.toISOString(),
    }));
    setAppState("user_details");
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        กำลังตรวจสอบคิวว่าง...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        เกิดข้อผิดพลาดในการตรวจสอบคิว: {error.message}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="mx-auto w-full max-w-full space-y-4 rounded-3xl p-4 sm:max-w-[480px] sm:p-5"
    >
      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={() => setAppState("selecting_service")}
          className="flex items-center gap-2 rounded-full border border-transparent bg-white/60 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 text-indigo-600" /> กลับ
        </button>
        <div>
          <h1 className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-lg font-extrabold text-transparent sm:text-xl">
            ระบบจองคิวออนไลน์
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            เลือกวันและเวลาที่สะดวก
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-white/60 to-white/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">บริการ</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                {formData.serviceType || "ไม่ระบุ"}
              </div>
              <div className="text-sm text-slate-500">({locationType})</div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>เวลาทำการ: 11:00 - 19:00</div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <MapPin className="h-4 w-4 text-indigo-500" />{" "}
              <span>สาขาหลัก</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {formData.serviceType === "รีไฟแนนซ์" && (
          <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">
              สถานที่
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "offsite", label: "นอกสถานที่" },
                { key: "onsite", label: "ที่ร้าน" },
                { key: "online", label: "ออนไลน์" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLocationType(opt.key)}
                  aria-pressed={locationType === opt.key}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    locationType === opt.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "border border-stone-200 bg-white text-slate-700 hover:bg-slate-50"
                  } flex items-center gap-2`}
                >
                  {opt.key === "offsite" && (
                    <Wrench
                      className={`h-4 w-4 ${
                        locationType === opt.key
                          ? "text-white"
                          : "text-purple-600"
                      }`}
                    />
                  )}
                  {opt.key === "onsite" && (
                    <Building
                      className={`h-4 w-4 ${
                        locationType === opt.key ? "text-white" : "text-blue-600"
                      }`}
                    />
                  )}
                  {opt.key === "online" && (
                    <Smartphone
                      className={`h-4 w-4 ${
                        locationType === opt.key
                          ? "text-white"
                          : "text-green-600"
                      }`}
                    />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl">
        <div className="text-sm font-semibold text-slate-700">
          เลือกวัน (ภายใน 7 วันถัดไป)
        </div>
        <div
          className="flex gap-2 overflow-x-scroll p-2"
          role="list"
          aria-label="เลือกวัน"
        >
          {daysList.map((d) => {
            const active = isSameDay(d, selectedDate);
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`flex h-16 w-16 flex-shrink-0 snap-center flex-col items-center justify-center gap-1.5 rounded-2xl border border-stone-200 text-center text-sm font-medium transition sm:w-20 ${
                  active
                    ? "bg-gradient-to-b from-blue-500 to-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="text-lg font-semibold leading-none">
                  {format(d, "d", { locale: th })}
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {format(d, "eee", { locale: th })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">
          ช่วงเวลานัดจอง
        </div>
        {locationType === "offsite" && (
          <TimeRowFullDay
            date={selectedDate}
            getSlotState={getSlotState}
            onBook={handleBook}
          />
        )}
        {locationType === "onsite" && (
          <div className="space-y-2">
            {hourlySlots.length > 0 ? (
              hourlySlots.map((slot) => (
                <TimeSlotRow
                  key={slot.label}
                  slot={slot}
                  state={getSlotState(selectedDate, slot)}
                  onBook={() => handleBook(selectedDate, slot)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-slate-500 py-4">ไม่มีช่วงเวลาว่างสำหรับวันนี้</p>
            )}
          </div>
        )}
        {locationType === "online" && (
          <div className="space-y-2">
            {onlineBookingSlots.length > 0 ? (
              onlineBookingSlots.map((slot) => (
                <TimeSlotRow
                  key={slot.label}
                  slot={slot}
                  state={getSlotState(selectedDate, slot)}
                  onBook={() => handleBook(selectedDate, slot)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-slate-500 py-4">ไม่มีช่วงเวลาว่างสำหรับวันนี้</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimeSlotRow({ slot, state, onBook }) {
  const { used, cap, full, reason } = state;
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-stone-200 bg-white/80 p-3 shadow-sm">
      <div className="text-sm font-medium text-slate-900">{slot.label}</div>
      <div className="text-right">
        <div
          className={`font-mono text-xs ${
            full ? "text-red-600" : "text-slate-600"
          }`}
        >
          {full ? "เต็ม" : `${used}/${cap}`}
        </div>
        {full && reason && (
          <div className="text-[10px] text-slate-400">{reason}</div>
        )}
      </div>
      <button
        onClick={onBook}
        disabled={full}
        className={`w-20 rounded-lg px-2 py-1.5 text-sm font-semibold transition ${
          full
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:opacity-95"
        }`}
      >
        {full ? "เต็ม" : "จองคิว"}
      </button>
    </div>
  );
}

function TimeRowFullDay({ date, getSlotState, onBook }) {
  const slot = { startIndex: 0, label: "ทั้งวัน", isFullDay: true };
  const { used, cap, full, reason } = getSlotState(date, slot);
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl border border-stone-200 bg-white/80 p-3 shadow-sm">
      <div className="text-sm font-medium text-slate-900">ทั้งวัน</div>
      <div
        className={`font-mono text-xs ${
          full ? "text-red-600" : "text-slate-600"
        }`}
      >
        {full ? "เต็ม" : `${used}/${cap}`}
      </div>
      <button
        onClick={() => onBook(date, slot)}
        disabled={full}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
          full
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:opacity-95"
        }`}
      >
        {full ? "เต็ม" : "จองคิว"}
      </button>
    </div>
  );
}