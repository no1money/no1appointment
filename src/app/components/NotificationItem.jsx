import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Bell,
  FilePenLine,
  Mail,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const NOTIFICATION_META = {
  BOOKING_CONFIRMED: {
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
  },
  BOOKING_REJECTED: {
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  BOOKING_CANCELLED_BY_STAFF: {
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  BOOKING_CANCELLED_BY_USER: {
    icon: <Trash2 className="h-5 w-5 text-slate-500" />,
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-800",
  },
  BOOKING_MODIFIED_BY_STAFF: {
    icon: <Clock className="h-5 w-5 text-yellow-600" />,
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-800",
  },
  QUEUE_REMINDER_UPCOMING: {
    icon: <Bell className="h-5 w-5 text-blue-600" />,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
  },
  FEEDBACK_REQUEST: {
    icon: <FilePenLine className="h-5 w-5 text-purple-600" />,
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
  },
  DEFAULT: {
    icon: <Mail className="h-5 w-5 text-slate-500" />,
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-800",
  },
};

export default function NotificationItem({ notification }) {
  const meta = NOTIFICATION_META[notification.type] || NOTIFICATION_META.DEFAULT;
  const { appointment } = notification;

  const content = (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50 ${
        meta.color
      }`}
    >
      {!notification.isRead && (
        <div
          className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-blue-500"
          aria-label="Unread notification"
        ></div>
      )}

      <div className="flex-shrink-0">{meta.icon}</div>

      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${meta.textColor}`}>{notification.title}</h4>

        {/* ## NEW: Displaying details from the nested 'appointment' object ## */}
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          {appointment?.serviceType && (
            <div className="flex items-center gap-1.5">
              <Wrench className="h-3 w-3 flex-shrink-0" />
              <span>
                บริการ: <strong>{appointment.serviceType}</strong>
              </span>
            </div>
          )}
          {appointment?.adminInfo?.fullName && (
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 flex-shrink-0" />
              <span>
                โดย: <strong>{appointment.adminInfo.fullName}</strong>
              </span>
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: th,
          })}
        </p>
      </div>
    </motion.div>
  );

  if (notification.appointmentId) {
    return (
      <Link href={`/appointments/my-appointment/${notification.appointmentId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
