import { TrendingUp } from "lucide-react";

export default function PerformanceInsights({ employee }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 text-white">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">สถิติการทำงาน</h2>
          <p className="text-sm text-slate-500">ภาพรวมประสิทธิภาพของคุณ</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-slate-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">งานเสร็จวันนี้</span>
            <span className="text-lg font-bold text-slate-800">
              {employee.todayStats.completedTasks}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{
                width: `${(employee.todayStats.completedTasks / employee.todayStats.assignedTasks) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">คะแนนเฉลี่ย</span>
            <span className="text-lg font-bold text-slate-800">
              {employee.todayStats.averageRating}/5
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-yellow-500"
              style={{ width: `${(employee.todayStats.averageRating / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="mb-3 font-semibold text-slate-700">เป้าหมายสัปดาห์นี้</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">งานเสร็จ 40 รายการ</span>
              <span className="font-medium text-slate-800">32/40</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full bg-blue-500" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <button className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            ดูรายงานแบบละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}
