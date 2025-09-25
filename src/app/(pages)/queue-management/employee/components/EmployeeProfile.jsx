import { Star } from "lucide-react";

export default function EmployeeProfile({ employee }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <span className="text-2xl font-bold">{employee.fullName.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-800">{employee.fullName}</h2>
          <p className="text-slate-500">รหัสพนักงาน: {employee.staffId}</p>
          <div className="mt-2 flex items-center gap-2">
            {employee.centralRole.map((role) => (
              <span
                key={role}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {role}
              </span>
            ))}
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${employee.isActive ? "bg-green-500" : "bg-gray-400"}`}
              ></div>
              <span className="text-sm text-slate-600">
                {employee.isActive ? "ออนไลน์" : "ออฟไลน์"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {employee.todayStats.averageRating}
          </div>
          <div className="text-sm text-slate-500">คะแนนเฉลี่ย</div>
          <div className="mt-1 flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(employee.todayStats.averageRating)
                    ? "fill-current text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
