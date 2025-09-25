"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail } from "lucide-react";
import Image from "next/image";

// Animation variants for the backdrop and modal
const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-50vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
  exit: { y: "50vh", opacity: 0 },
};

export default function ProfileModal({ isOpen, onClose, profile, customer }) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Close modal on backdrop click
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={24} />
            </motion.button>

            {/* Profile Content */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-28 h-28 mb-4">
                <Image
                  src={profile.pictureUrl}
                  alt={profile.displayName}
                  layout="fill"
                  className="rounded-full object-cover border-4 border-blue-500"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800">{profile.displayName}</h2>
              <p className="text-sm text-gray-500 mb-6">LINE User Profile</p>

              {/* Information List */}
              <div className="w-full text-left space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{customer?.fullname || profile.displayName}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  <span className={customer?.phone ? "text-gray-800" : "text-gray-400 italic"}>
                    {customer?.phone || "เบอร์โทรศัพท์ (ไม่ได้ระบุ)"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <span className={customer?.email ? "text-gray-800" : "text-gray-400 italic"}>
                    {customer?.email || "อีเมล (ไม่ได้ระบุ)"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-6 text-center">
                {customer?.phone || customer?.email
                  ? "ข้อมูลจากฐานข้อมูล"
                  : "**หมายเหตุ:** เบอร์โทรและอีเมลไม่ได้ถูกส่งมาจาก LINE โดยตรง"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
