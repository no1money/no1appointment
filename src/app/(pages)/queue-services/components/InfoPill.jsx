export default function InfoPill({ icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50/80 p-2 rounded-lg border border-slate-200/70">
      {icon}
      <span className="font-medium text-slate-700">{label}</span>
    </div>
  );
}
