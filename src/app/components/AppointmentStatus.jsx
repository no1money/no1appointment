"use client";

import { motion } from "framer-motion";
import { Smartphone, Building, Wrench } from "lucide-react";

export default function AppointmentStatus({ customer, isCreating }) {
  if (!customer?.appointments || customer.appointments.length === 0) {
    return (
      <motion.div className="p-4">
        <h2 className="text-xl font-semibold mb-4">คิวของฉัน</h2>
        <p className="text-gray-500">ไม่มีการจองในขณะนี้</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="p-4">
      <h2 className="text-xl font-semibold mb-4">คิวของฉัน</h2>
      {isCreating && <p>กำลังสร้างการจอง...</p>}
      <div className="space-y-6">
        {customer.appointments.map((appointment, idx) => {
          // Color and icon for type
          const typeMap = {
            ONSITE: {
              label: "หน้าร้าน",
              color: "from-blue-500 to-indigo-600",
              icon: <Building className="w-5 h-5 mr-1" />,
            },
            ONLINE: {
              label: "ออนไลน์",
              color: "from-green-400 to-blue-500",
              icon: <Smartphone className="w-5 h-5 mr-1" />,
            },
            OFFSITE: {
              label: "นอกสถานที่",
              color: "from-pink-500 to-orange-400",
              icon: <Wrench className="w-5 h-5 mr-1" />,
            },
          };
          const statusMap = {
            PENDING: { label: "รอดำเนินการ", bg: "bg-yellow-100", text: "text-yellow-800" },
            CONFIRMED: { label: "ยืนยันแล้ว", bg: "bg-green-100", text: "text-green-800" },
            COMPLETED: { label: "เสร็จสิ้น", bg: "bg-blue-100", text: "text-blue-800" },
            CANCELLED: { label: "ยกเลิก", bg: "bg-gray-200", text: "text-gray-500" },
            NO_SHOW: { label: "ไม่มาตามนัด", bg: "bg-red-100", text: "text-red-600" },
          };
          const type = typeMap[appointment.type] || typeMap.ONSITE;
          const status = statusMap[appointment.status] || statusMap.PENDING;

          return (
            <div
              key={appointment.id || appointment._id || idx}
              className={`relative flex flex-col md:flex-row bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden`}
              style={{
                borderLeft: `8px solid`,
                borderImage: `linear-gradient(to bottom, var(--tw-gradient-stops)) 1`,
              }}
            >
              {/* Colored left border using gradient */}
              <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${type.color} rounded-l-2xl`} />
              <div className="flex-1 p-5 pl-7">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${type.color} text-white shadow-sm`}
                  >
                    {type.icon}
                    {type.label}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mb-1 text-lg font-bold text-slate-900">
                  {appointment.note || `Service: ${appointment.serviceType || "ไม่ระบุ"}`}
                </div>

                {/* Add tags display if available */}
                {appointment.requiredTags && appointment.requiredTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {appointment.requiredTags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Date(appointment.date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {new Date(appointment.date).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
