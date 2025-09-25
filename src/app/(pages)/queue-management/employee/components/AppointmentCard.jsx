import { Check, CheckCircle, Edit, X } from "lucide-react";

export default function AppointmentCard({ appointment, onUpdateStatus, onEdit }) {
  const statusConfig = {
    PENDING: {
      label: "รอดำเนินการ",
      color: "bg-yellow-100 text-yellow-800",
      actions: ["accept", "reject"],
    },
    IN_PROGRESS: {
      label: "กำลังดำเนินการ",
      color: "bg-blue-100 text-blue-800",
      actions: ["complete", "cancel"],
    },
    COMPLETED: { label: "เสร็จแล้ว", color: "bg-green-100 text-green-800", actions: [] },
    CANCELLED: { label: "ยกเลิก", color: "bg-red-100 text-red-800", actions: [] },
  };

  const config = statusConfig[appointment.status] || {
    label: appointment.status || "ไม่ระบุ",
    color: "bg-slate-100 text-slate-800",
    actions: [],
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h4 className="font-semibold text-slate-800">{appointment.customerName}</h4>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-3">
            <div>📞 {appointment.customerPhone}</div>
            <div>🛠️ {appointment.service}</div>
            <div>
              📅 {appointment.appointmentDate} เวลา {appointment.appointmentTime}
            </div>
          </div>
          {appointment.note && <p className="mt-2 text-sm text-slate-500">📝 {appointment.note}</p>}
          {appointment.rating && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-sm text-slate-600">⭐ คะแนน:</span>
              <span className="font-medium text-yellow-600">{appointment.rating}/5</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(appointment)}
            className="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
            title="แก้ไข"
          >
            <Edit className="h-4 w-4" />
          </button>

          {config.actions.includes("accept") && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "IN_PROGRESS")}
              className="rounded-lg bg-green-100 p-2 text-green-600 transition-colors hover:bg-green-200"
              title="ยอมรับ"
            >
              <Check className="h-4 w-4" />
            </button>
          )}

          {config.actions.includes("reject") && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "CANCELLED")}
              className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
              title="ปฏิเสธ"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {config.actions.includes("complete") && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "COMPLETED")}
              className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200"
              title="เสร็จสิ้น"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
