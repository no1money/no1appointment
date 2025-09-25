"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function DateTimeOfferPicker({
  isOpen,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onConfirm,
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">วันที่</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">เวลา</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full rounded-lg px-4 py-2 font-semibold shadow-md transition-all duration-200 ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                กำลังส่งเวลาใหม่...
              </div>
            ) : (
              "ยืนยันเวลาใหม่"
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
