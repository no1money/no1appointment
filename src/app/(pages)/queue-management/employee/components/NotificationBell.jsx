import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useRef } from "react";

export default function NotificationBell({ unreadCount, isOpen, setIsOpen, children }) {
  const panelRef = useRef(null);

  // Effect to handle clicks outside the notification panel to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {/* AnimatePresence handles the mounting and unmounting animations */}
      <AnimatePresence>{isOpen && children}</AnimatePresence>
    </div>
  );
}
