"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

import AppointmentCard from "./components/AppointmentCard";
import DropDownComponent from "../../../../components/DropDownComponent";
import { useGetEmployeeAppointmentByTags, useUpdateAppointmentAction } from "../hooks/useEmployee";

export default function EmployeeAppointmentsPage() {
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState("ALL");

  const statusFilters = [
    { value: "ALL", label: "ทั้งหมด" },
    { value: "PENDING", label: "รอดำเนินการ" },
    { value: "ACCEPTED_BY_EMPLOYEE", label: "รับทำแล้ว" },
    { value: "CONFIRMED", label: "ลูกค้ายืนยันแล้ว" },
    { value: "OFFERED", label: "เสนอเวลาใหม่" },
    { value: "WAITING_FOR_PAYMENT", label: "รอการชำระเงิน" },
    { value: "PAYMENT_RECEIVED", label: "ได้รับการชำระเงิน" },
    { value: "PAYMENT_CONFIRMED", label: "ยืนยันการชำระเงิน" },
    { value: "PAYMENT_INVALID", label: "การชำระเงินไม่ถูกต้อง" },
    { value: "COMPLETED", label: "เสร็จสิ้น" },
    { value: "CANCELLED", label: "ยกเลิก" },
    { value: "NO_SHOW", label: "ไม่มาตามนัด" },
    { value: "REJECTED_BY_EMPLOYEE", label: "ปฏิเสธแล้ว" },
  ];

  // GET hook
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch: refetchAppointments,
  } = useGetEmployeeAppointmentByTags(null, filterStatus); // Assuming tags can be null for now

  // POST hook
  const { mutate: updateAppointmentAction } = useUpdateAppointmentAction();

  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingActions, setLoadingActions] = useState({});

  const handleAppointmentAction = (appointmentId, action, offerDate = null, auth = null) => {
    const actionText = {
      ACCEPT: "รับทำ",
      REJECT: "ปฏิเสธ",
      OFFER: "เสนอเวลาใหม่",
    };

    const loadingKey = `${appointmentId}-${action}`;
    setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));

    updateAppointmentAction(
      { appointmentId, action, offerDate, auth },
      {
        onSuccess: () => {
          Swal.fire({
            title: "สำเร็จ!",
            text: `${actionText[action]}นัดหมายเรียบร้อยแล้ว`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          setShowDatePicker(null);
          setLoadingActions((prev) => {
            const newState = { ...prev };
            delete newState[loadingKey];
            return newState;
          });
        },
        onError: (err) => {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: err.message || "ไม่สามารถอัปเดตนัดหมายได้",
            icon: "error",
          });
          setLoadingActions((prev) => {
            const newState = { ...prev };
            delete newState[loadingKey];
            return newState;
          });
        },
      },
    );
  };

  const handleOfferDateTime = (appointmentId, auth) => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({ title: "กรุณาเลือกวันที่และเวลา", icon: "warning" });
      return;
    }
    const offerDate = new Date(`${selectedDate}T${selectedTime}`);
    handleAppointmentAction(appointmentId, "OFFER", offerDate, auth);
  };

  const handleStatusChange = (selectedOption) => {
    setFilterStatus(selectedOption.value);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูลนัดหมาย...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mb-4 text-4xl text-red-500">❌</div>
          <h1 className="mb-2 text-xl font-semibold text-slate-900">เกิดข้อผิดพลาด</h1>
          <p className="mb-4 text-slate-600">{error.message}</p>
          <button
            onClick={() => refetchAppointments()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <button
            onClick={() => router.push("/queue-management/employee")}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/50 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปแดชบอร์ด
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-6 rounded-3xl border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-lg sm:p-6 md:mb-8 md:p-8"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
            <div className="mb-4 md:mb-0">
              <h1 className="mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:mb-2 md:text-4xl">
                นัดหมายสำหรับคุณ
              </h1>
              <p className="text-base text-slate-600 sm:text-lg">
                จัดการและตอบกลับนัดหมายที่ตรงกับทักษะของคุณ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm text-white shadow-lg sm:px-6 sm:py-3 sm:text-base">
                <span className="font-semibold">{appointments.length} รายการ</span>
              </div>
              <button
                onClick={() => refetchAppointments()}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-lg transition-all duration-200 hover:bg-slate-50 hover:shadow-xl sm:px-6 sm:py-3 sm:text-base"
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-700">รีโหลด</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 w-full sm:mt-6 md:max-w-xs">
            <DropDownComponent
              label="กรองตามสถานะ"
              options={statusFilters}
              selectedOption={statusFilters.find((f) => f.value === filterStatus)}
              onSelect={handleStatusChange}
            />
          </div>
        </motion.div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center sm:py-16"
          >
            <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-lg sm:p-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 sm:mb-6 sm:h-24 sm:w-24">
                <Calendar className="h-8 w-8 text-blue-500 sm:h-12 sm:w-12" />
              </div>
              <h2 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-2xl">
                ไม่มีนัดหมาย
              </h2>
              <p className="text-base text-slate-600 sm:text-lg">
                {filterStatus === "ALL"
                  ? "ยังไม่มีนัดหมายที่เกี่ยวข้องในขณะนี้"
                  : `ไม่มีนัดหมายที่มีสถานะ "${statusFilters.find((f) => f.value === filterStatus)?.label}"`}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            <AnimatePresence>
              {appointments.map((appointment, index) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  index={index}
                  onAction={handleAppointmentAction}
                  showDatePicker={showDatePicker}
                  setShowDatePicker={setShowDatePicker}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  onOfferDateTime={handleOfferDateTime}
                  loadingActions={loadingActions}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
