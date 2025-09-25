export default function KpiCard({ title, value, icon: Icon, color }) {
  const colors = {
    amber: "from-amber-500 to-yellow-500",
    blue: "from-blue-600 to-sky-500",
    emerald: "from-emerald-600 to-green-500",
    rose: "from-rose-600 to-red-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase">{title}</h3>
          <Icon className="h-7 w-7 text-white/50" />
        </div>
        <p className="mt-2 text-4xl font-bold">{value}</p>
      </div>
    </div>
  );
}
