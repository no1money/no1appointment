"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Wrench,
  ChevronLeft,
  User,
  Info,
  AlertTriangle,
  SearchX,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  Tag,
  FileText,
  Receipt,
} from "lucide-react";
import BottomNavbar from "../../../queue-services/components/BottomNavbar";
import { useGetAppointmentDetails } from "./hooks/useAppointment";

const statusThai = (status) => {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "CONFIRMED":
      return "ยืนยันแล้ว";
    case "COMPLETED":
      return "เสร็จสิ้น";
    case "CANCELLED":
      return "ยกเลิก";
    case "NO_SHOW":
      return "ไม่มา";
    case "OFFERED":
      return "เสนอเวลาใหม่";
    case "ACCEPTED_BY_EMPLOYEE":
      return "รับโดยพนักงาน";
    case "REJECTED_BY_EMPLOYEE":
      return "ปฏิเสธโดยพนักงาน";
    default:
      return status || "-";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "CANCELLED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "NO_SHOW":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "OFFERED":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "ACCEPTED_BY_EMPLOYEE":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "REJECTED_BY_EMPLOYEE":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const typeColor = (type) => {
  switch (type) {
    case "ONSITE":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ONLINE":
      return "bg-green-100 text-green-800 border-green-200";
    case "OFFSITE":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const typeThai = (type) => {
  switch (type) {
    case "ONSITE":
      return "หน้าร้าน";
    case "ONLINE":
      return "ออนไลน์";
    case "OFFSITE":
      return "นอกสถานที่";
    default:
      return type || "-";
  }
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const formatTime = (hourNumberLike) => `${hourNumberLike}:00 น.`;

export default function AppointmentDetailsPage() {
  const params = useParams();
  const id = params.id;

  // Fetch data for the specific appointment using the ID from the URL
  const { data: appointmentDetails, isLoading, error } = useGetAppointmentDetails(id);

  if (isLoading) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 font-sans text-slate-800">
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
              <div className="h-full w-full rounded-full border-4 border-t-indigo-500 border-r-indigo-100 border-b-indigo-100 border-l-indigo-500" />
            </div>
            <Wrench
              size={32}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500"
            />
          </div>
          <div className="mt-6">
            <div className="text-base font-semibold text-slate-700">กำลังโหลดข้อมูลการจอง...</div>
            <div className="mt-1 text-sm text-slate-500">กรุณารอสักครู่</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-center">
        <div className="mx-auto max-w-sm">
          <div className="inline-flex items-center justify-center rounded-full bg-rose-100 p-3">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-800">เกิดข้อผิดพลาด</h1>
          <p className="mt-2 text-slate-600">{error.message}</p>
          <Link
            href="/appointments/history"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
          >
            <ChevronLeft size={16} /> กลับไปที่ประวัติ
          </Link>
        </div>
      </main>
    );
  }

  if (!appointmentDetails) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-center">
        <div className="mx-auto max-w-sm">
          <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-3">
            <SearchX className="h-8 w-8 text-slate-500" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-800">ไม่พบข้อมูลการจอง</h1>
          <p className="mt-2 text-slate-600">ไม่พบข้อมูลสำหรับการจองนี้ หรืออาจถูกลบไปแล้ว</p>
          <Link
            href="/appointments/history"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
          >
            <ChevronLeft size={16} /> กลับไปที่ประวัติ
          </Link>
        </div>
        <BottomNavbar />
      </main>
    );
  }

  const translatedStatus = statusThai(appointmentDetails.status);
  const statusClass = statusColor(appointmentDetails.status);
  const typeClass = typeColor(appointmentDetails.type);
  const translatedType = typeThai(appointmentDetails.type);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 py-24 pb-24 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/queue-history"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ChevronLeft size={16} /> กลับ
          </Link>
          <div className="text-xs text-slate-500">
            อัปเดตล่าสุด: {new Date(appointmentDetails.updatedAt).toLocaleString("th-TH")}
          </div>
        </header>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-6 p-6">
            {/* Header with status and type */}
            <div className="flex flex-wrap gap-2">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass}`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {translatedStatus}
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${typeClass}`}
              >
                <MapPin size={12} />
                {translatedType}
              </div>
            </div>

            {/* Service Type */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Wrench size={18} className="text-indigo-500" /> บริการ
              </h2>
              <div className="inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">
                {appointmentDetails.serviceType}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">วันที่นัด</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatDate(appointmentDetails.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">เวลานัด</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatTime(appointmentDetails.section)}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {appointmentDetails.customer && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <UserCircle size={18} className="text-blue-500" /> ข้อมูลลูกค้า
                </h2>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    {appointmentDetails.customer.picture_url ? (
                      <img
                        src={appointmentDetails.customer.picture_url}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                        <UserCircle size={24} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        {appointmentDetails.customer.fullname ||
                          appointmentDetails.customer.line_display_name ||
                          "-"}
                      </div>
                      <div className="mt-1 grid grid-cols-1 gap-2 text-sm text-slate-600">
                        {appointmentDetails.customer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{appointmentDetails.customer.phone}</span>
                          </div>
                        )}
                        {appointmentDetails.customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} />
                            <span>{appointmentDetails.customer.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <FileText size={18} className="text-slate-500" /> รายละเอียดเพิ่มเติม
              </h2>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {appointmentDetails.note || "ไม่มีข้อมูลเพิ่มเติม"}
                </p>
              </div>
            </div>
            
            {/* --- START: MODIFIED SECTION FOR SLIP URL --- */}
            {appointmentDetails.type === "OFFSITE" && appointmentDetails.slipUrl && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Receipt size={18} className="text-emerald-500" /> หลักฐานการชำระเงินมัดจำ
                </h2>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <a
                    href={appointmentDetails.slipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="คลิกเพื่อดูภาพขนาดเต็ม"
                  >
                    <img
                      src={appointmentDetails.slipUrl}
                      alt="สลิปค่ามัดจำ"
                      className="h-auto w-full max-w-xs rounded-lg shadow-sm transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                  </a>
                </div>
              </div>
            )}
            {/* --- END: MODIFIED SECTION FOR SLIP URL --- */}

            {/* Appointment ID */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-500">รหัสการนัดหมาย</div>
              <div className="mt-1 font-mono text-sm text-slate-700">{appointmentDetails.id}</div>
            </div>
          </div>
        </article>
      </div>

      <BottomNavbar />
    </main>
  );
}