import Image from "next/image";
import Link from "next/link";
import { Home as HomeIcon, ListChecks, Clock, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNavbar({ liffProfile }) {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 py-2 backdrop-blur"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4 gap-0">
        {/* Home */}
        <li>
          <Link
            href="/queue-services"
            className={`flex flex-col items-center gap-1 py-2 text-xs ${
              pathname === "/queue-services" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <HomeIcon size={24} />
            <span className="text-[10px]">หน้าแรก</span>
          </Link>
        </li>
        {/* My Queue */}
        <li>
          <Link
            href="/appointments/my-appointment"
            className={`flex flex-col items-center gap-1 py-2 text-xs ${
              pathname?.startsWith("/appointments/my-appointment")
                ? "text-blue-600"
                : "text-slate-500"
            }`}
          >
            <ListChecks size={24} />
            <span className="text-[10px]">คิวของฉัน</span>
          </Link>
        </li>
        {/* History */}
        <li>
          <Link
            href="/queue-history"
            className={`flex flex-col items-center gap-1 py-2 text-xs ${
              pathname?.startsWith("/appointments/history") ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <Clock size={24} />
            <span className="text-[10px]">ประวัติ</span>
          </Link>
        </li>
        {/* Profile */}
        <li>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 py-2 text-xs ${
              pathname?.startsWith("/profile") ? "text-blue-600" : "text-slate-500"
            }`}
          >
            {liffProfile?.picture ? (
              <Image
                src={liffProfile?.picture}
                alt="Profile"
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <UserCircle size={24} />
            )}
            <span className="text-[10px]">โปรไฟล์</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
