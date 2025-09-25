import { ArrowRight, Calendar, Check, X } from "lucide-react";

export default function TodaySchedule({ router, appointments = [], loading = false }) {
  // Map appointments to today's schedule entries
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const mapped = (appointments || []).map((a) => {
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
      time: appointmentTime,
      customer: (a.customer && a.customer.name) || a.customerName || a.customerId || "",
      service: a.note ? a.note.replace(/^Service:\s*/i, "") : a.type || a.service || "",
      status: a.status,
      note: a.note || "",
      appointmentDate,
    };
  });

  const todaySchedule = mapped
    .filter((m) => m.appointmentDate === todayStr)
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      const [ah, am] = a.time.split(":").map(Number);
      const [bh, bm] = b.time.split(":").map(Number);
      return ah * 60 + am - (bh * 60 + bm);
    });

  const statusMap = {
    COMPLETED: { label: "เสร็จแล้ว", color: "bg-green-100 text-green-800" },
    IN_PROGRESS: { label: "กำลังดำเนินการ", color: "bg-blue-100 text-blue-800" },
    PENDING: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
  };

  const handleAcceptAppointment = (appointmentId) => {
    console.log("Accepting appointment:", appointmentId);
  };

  const handleRejectAppointment = (appointmentId) => {
    console.log("Rejecting appointment:", appointmentId);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">ตารางงานวันนี้</h2>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{todaySchedule.length} นัด</span>
          <button
            onClick={() => router.push("/queue-management/employee/my-appointments")}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
          >
            ดูทั้งหมด
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todaySchedule.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-600">{item.time}</div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.customer}</p>
                <p className="text-sm text-slate-600">{item.service}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.status === "PENDING" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptAppointment(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200"
                    title="ยอมรับ"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectAppointment(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                    title="ปฏิเสธ"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {(() => {
                const sm = statusMap[item.status] || {
                  label: item.status || "ไม่ระบุ",
                  color: "bg-slate-100 text-slate-800",
                };
                return (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sm.color}`}
                  >
                    {sm.label}
                  </span>
                );
              })()}
            </div>
          </div>
        ))}

        {todaySchedule.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">ไม่มีงานที่กำหนดในวันนี้</p>
        )}
      </div>
    </div>
  );
}
