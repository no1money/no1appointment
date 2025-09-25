"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Repeat,
  HandCoins,
  ShieldCheck,
  Building,
  Wrench,
  Info,
  History,
} from "lucide-react";
import LatestAppointmentCard from "./LatestAppointmentCard";
import { useGetDisplayAppointment } from "../(pages)/queue-services/hooks/useAppointments";

const services = [
  { name: "ซ่อมมือถือ", icon: Wrench },
  { name: "ซื้อขายมือถือ", icon: Smartphone },
  { name: "จำนำมือถือ", icon: HandCoins },
  { name: "จำนำไอคลาวด์", icon: ShieldCheck },
  { name: "รีไฟแนนซ์", icon: Repeat },
  { name: "อื่นๆ", icon: Building },
];

const moreInfo = [
  { name: "เกี่ยวกับเรา", icon: Info },
  { name: "ประวัติการจอง", icon: History },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const cardHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 300 },
};

const cardTap = {
  scale: 0.95,
};

export default function ServiceSelection({ customer, onServiceSelect }) {
  const {
    data: appointmentData,
    isLoading: appointmentLoading,
    error: appointmentError,
  } = useGetDisplayAppointment(customer?.id || null);

  return (
    <motion.div className="flex flex-col gap-8">
      {/* === Latest Appointment Section === */}
      <LatestAppointmentCard appointment={appointmentData} loading={appointmentLoading} />

      {/* === Services Section === */}
      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 variants={itemVariants} className="mb-4 text-2xl font-bold">
          บริการ
        </motion.h2>

        {/* The main grid container with 3 columns and a gap */}
        <motion.div
          variants={containerVariants} // Staggers the children inside the grid
          className="grid grid-cols-3 gap-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.name}
              variants={itemVariants}
              whileHover={cardHover}
              whileTap={cardTap}
              // w-full makes the card fit the grid column perfectly
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-black/25 drop-shadow-md"
              onClick={() => onServiceSelect(service)}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <service.icon size={24} />
              </div>
              <span className="text-sm font-semibold">{service.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* === More Information Section === */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-bold">
          ข้อมูลเพิ่มเติม
        </motion.h2>
        <div className="scrollbar-hide overflow-x-auto">
          <motion.div
            variants={containerVariants}
            className="grid auto-cols-max grid-flow-col gap-6 p-2"
          >
            {moreInfo.map((info) => (
              <motion.div
                key={info.name}
                variants={itemVariants}
                whileHover={cardHover}
                whileTap={cardTap}
                className="flex h-32 w-48 cursor-pointer items-center rounded-2xl border border-gray-100 bg-white p-4 drop-shadow-md drop-shadow-black/10"
              >
                <div className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-indigo-700">
                  <info.icon size={28} />
                </div>
                <div>
                  <span className="text-lg font-bold">{info.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
