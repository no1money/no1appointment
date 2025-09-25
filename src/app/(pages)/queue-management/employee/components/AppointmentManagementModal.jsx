"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EditAppointmentModal from "./EditAppointmentModal";
import AppointmentCard from "./AppointmentCard";
import { Calendar, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export default function AppointmentManagementModal({
  isOpen,
  onClose,
  employee,
  appointments = [],
  appointmentsLoading = false,
}) {
  const [selectedDateRange, setSelectedDateRange] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const itemsPerPage = 5;

  const mappedAppointments = (appointments || []).map((a) => {
    const dateObj = a.date ? new Date(a.date) : null;
    const appointmentDate = a.day || (dateObj ? dateObj.toISOString().split("T")[0] : "");

    let appointmentTime = "";
    if (a.section) {
      if (typeof a.section === "string" && !a.section.includes(":")) {
        const hour = parseInt(a.section, 10);
        appointmentTime = `${hour.toString().padStart(2, "0")}:00`;
      } else {
        appointmentTime = a.section;
      }
    } else if (dateObj) {
      appointmentTime = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    return {
      id: a.id,
      customerName: (a.customer && a.customer.name) || a.customerId || a.customerName || "",
      service: a.note ? a.note.replace(/^Service:\s*/i, "") : a.type || a.service || "",
      appointmentDate,
      appointmentTime,
      status: a.status,
      note: a.note || "",
      customerPhone: (a.customer && a.customer.phone) || a.customerPhone || "",
      rating: a.score || null,
    };
  });

  const getFilteredByDateRange = (appointments) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    switch (selectedDateRange) {
      case "upcoming":
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return appointments.filter(
          (apt) =>
            apt.appointmentDate >= todayStr &&
            apt.appointmentDate <= nextWeek.toISOString().split("T")[0],
        );
      case "today":
        return appointments.filter((apt) => apt.appointmentDate === todayStr);
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        return appointments.filter((apt) => apt.appointmentDate === tomorrowStr);
      case "next7days":
        const next7 = new Date(today);
        next7.setDate(next7.getDate() + 7);
        const tomorrowStart = new Date(today);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        return appointments.filter(
          (apt) =>
            apt.appointmentDate >= tomorrowStart.toISOString().split("T")[0] &&
            apt.appointmentDate <= next7.toISOString().split("T")[0],
        );
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        return appointments.filter((apt) => apt.appointmentDate === yesterdayStr);
      case "past7days":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const yesterdayEnd = new Date(today);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        return appointments.filter(
          (apt) =>
            apt.appointmentDate >= weekAgo.toISOString().split("T")[0] &&
            apt.appointmentDate <= yesterdayEnd.toISOString().split("T")[0],
        );
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return appointments.filter(
          (apt) => apt.appointmentDate >= monthAgo.toISOString().split("T")[0],
        );
      case "all":
      default:
        return appointments;
    }
  };

  const filteredAppointments = mappedAppointments
    .filter((apt) => statusFilter === "ALL" || apt.status === statusFilter)
    .filter(
      (apt) =>
        searchTerm === "" ||
        apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const dateFilteredAppointments = getFilteredByDateRange(filteredAppointments).sort((a, b) => {
    const dateCompare =
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
    if (dateCompare !== 0) return dateCompare;

    const timeA = a.appointmentTime.split(":").map(Number);
    const timeB = b.appointmentTime.split(":").map(Number);
    const timeAMinutes = timeA[0] * 60 + timeA[1];
    const timeBMinutes = timeB[0] * 60 + timeB[1];
    return timeAMinutes - timeBMinutes;
  });
  const totalPages = Math.ceil(dateFilteredAppointments.length / itemsPerPage);
  const paginatedAppointments = dateFilteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleUpdateStatus = (appointmentId, newStatus) => {
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = (appointmentData) => {
    console.log("Saving appointment:", appointmentData);
    setEditingAppointment(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="h-[80vh] max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">จัดการนัดหมาย</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ช่วงเวลา</label>
              <select
                value={selectedDateRange}
                onChange={(e) => {
                  setSelectedDateRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="upcoming">📅 คิวที่จะมา (วันนี้ + 7 วัน)</option>
                <option value="today">🔥 วันนี้</option>
                <option value="tomorrow">⏰ พรุ่งนี้</option>
                <option value="next7days">📆 7 วันข้างหน้า</option>
                <option value="yesterday">📋 เมื่อวาน</option>
                <option value="past7days">📊 7 วันที่แล้ว</option>
                <option value="month">📈 30 วันที่แล้ว</option>
                <option value="all">🗂️ ทั้งหมด</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">สถานะ</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="PENDING">รอดำเนินการ</option>
                <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                <option value="COMPLETED">เสร็จแล้ว</option>
                <option value="CANCELLED">ยกเลิก</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">ค้นหา</label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อลูกค้าหรือบริการ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              นัดหมาย ({dateFilteredAppointments.length} รายการ)
            </h3>
          </div>

          {paginatedAppointments.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="text-slate-500">ไม่พบนัดหมายในช่วงเวลาที่เลือก</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onUpdateStatus={handleUpdateStatus}
                  onEdit={handleEditAppointment}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                แสดง {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, dateFilteredAppointments.length)} จาก{" "}
                {dateFilteredAppointments.length} รายการ
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-slate-700">
                  หน้า {currentPage} จาก {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {editingAppointment && (
          <EditAppointmentModal
            appointment={editingAppointment}
            onSave={handleSaveEdit}
            onClose={() => setEditingAppointment(null)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
