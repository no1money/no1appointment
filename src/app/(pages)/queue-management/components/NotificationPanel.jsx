import { motion } from "framer-motion";
import {
  Bell,
  CalendarPlus,
  Megaphone,
  UserCheck,
  X,
  XCircle,
  Mail,
  Edit,
  CheckCircle,
  LogIn,
  Gift,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";

// Expanded to include more types from your Prisma schema
const NOTIFICATION_META = {
  // Existing types
  NEW_BOOKING_REQUEST: { icon: CalendarPlus, color: "text-blue-500" },
  BOOKING_CANCELLED_BY_USER_ALERT: { icon: XCircle, color: "text-rose-500" },
  SYSTEM_ANNOUNCEMENT: { icon: Megaphone, color: "text-purple-500" },
  FEEDBACK_REQUEST: { icon: UserCheck, color: "text-emerald-500" },

  // Added types based on schema
  BOOKING_MODIFIED_BY_USER: { icon: Edit, color: "text-amber-500" },
  BOOKING_MODIFIED_BY_STAFF: { icon: Edit, color: "text-amber-500" },
  QUEUE_CHECK_IN: { icon: LogIn, color: "text-cyan-500" },
  BOOKING_RECEIVED: { icon: Mail, color: "text-slate-500" },
  BOOKING_CONFIRMED: { icon: CheckCircle, color: "text-green-500" },
  BOOKING_REJECTED: { icon: XCircle, color: "text-rose-500" },
  BOOKING_CANCELLED_BY_STAFF: { icon: XCircle, color: "text-rose-500" },
  BOOKING_CANCELLED_BY_USER: { icon: XCircle, color: "text-rose-500" },
  PROMOTION_ALERT: { icon: Gift, color: "text-pink-500" },

  // Default fallback
  DEFAULT: { icon: Bell, color: "text-slate-500" },
};

export default function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) {
  // The component now expects the `notifications` prop to be the real data
  // from the `useGetEmployeeNotificationsByTags` hook.
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full right-0 z-40 mt-2 w-80 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96"
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-3">
        <h3 className="font-semibold text-slate-800">การแจ้งเตือน</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            อ่านทั้งหมด
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((n) => {
            // The 'type' from Prisma is mapped to 'notificationType' by the hook or in the parent component
            const meta = NOTIFICATION_META[n.notificationType] || NOTIFICATION_META.DEFAULT;
            const Icon = meta.icon;
            return (
              <div
                key={n.id} // Works with string ID from MongoDB
                onClick={() => !n.isRead && onMarkAsRead(n.id)}
                className={`flex cursor-pointer items-start gap-3 border-b border-slate-100 p-3 transition-colors ${
                  n.isRead ? "bg-white" : "bg-blue-50/50 hover:bg-slate-50"
                }`}
              >
                {!n.isRead && (
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                )}
                <div className={`flex-shrink-0 ${n.isRead ? "ml-4" : ""}`}>
                  <Icon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                      locale: th,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <Mail className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-600">ไม่มีการแจ้งเตือน</p>
            <p className="text-xs text-slate-400">ทุกอย่างดูเรียบร้อยดี</p>
          </div>
        )}
      </div>
      <div className="rounded-b-2xl bg-slate-50 p-2 text-center">
        <Link
          href={"/queue-management/employee/notification"}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ดูการแจ้งเตือนทั้งหมด
        </Link>
      </div>
    </motion.div>
  );
}
