'use client';

import { motion } from 'framer-motion';
// ลบ Smartphone icon ที่ไม่ได้ใช้ออกไป เพื่อความสะอาดของโค้ด
import { Repeat, HandCoins, Wrench, Handshake, Wallet, MoreHorizontal } from 'lucide-react';

const services = [
  { name: 'ซ่อมมือถือ', icon: Wrench, bg: 'from-slate-900 via-blue-800 to-cyan-500' },
  { name: 'ซื้อขายมือถือ', icon: Handshake, bg: 'from-emerald-900 via-teal-700 to-lime-500' },
  { name: 'ขายฝากมือถือ', icon: HandCoins, bg: 'from-amber-900 via-orange-700 to-yellow-500' },
  { name: 'ไอโฟนแลกเงิน', icon: Wallet, bg: 'from-indigo-950 via-blue-800 to-sky-500' },
  { name: 'รีไฟแนนซ์', icon: Repeat, bg: 'from-green-900 via-emerald-700 to-green-400' },
  { name: 'อื่นๆ', icon: MoreHorizontal, bg: 'from-blue-950 via-indigo-700 to-purple-500' },
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
      type: 'spring',
      stiffness: 100,
    },
  },
};

// --- START: 1. รับ prop 'serviceStatus' และลบ prop ที่ไม่ได้ใช้ออก ---
// กำหนด default value ให้ serviceStatus เป็น object ว่าง {} เพื่อป้องกัน error
export default function ServiceSelection({ onServiceSelect, serviceStatus = {} }) {
// --- END: 1. รับ prop ---
  return (
    <motion.div className="flex flex-col">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        <motion.h2 variants={itemVariants} className="text-lg font-bold">
          บริการ
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-3 gap-4"
        >
          {services.map((service) => {
            // --- START: 2. ตรวจสอบสถานะของบริการแต่ละอัน ---
            // ถ้า serviceStatus มีชื่อบริการนี้อยู่ ให้ใช้ค่า true/false นั้น
            // แต่ถ้าไม่มี (เป็น undefined) ให้ถือว่าเปิด (true) เป็นค่าเริ่มต้น
            const isEnabled = serviceStatus[service.name] ?? true;
            // --- END: 2. ตรวจสอบสถานะ ---

            return (
              <motion.div
                key={service.name}
                variants={itemVariants}
                // --- START: 3. กำหนด animation และ event แบบมีเงื่อนไข ---
                whileHover={
                  isEnabled ? { y: -3, transition: { type: 'spring', stiffness: 300 } } : {}
                }
                whileTap={isEnabled ? { scale: 0.95 } : {}}
                // ถ้า isEnabled เป็น true เท่านั้น ถึงจะเรียก onServiceSelect
                onClick={() => isEnabled && onServiceSelect(service)}
                // --- END: 3. กำหนด animation และ event ---

                // --- START: 4. กำหนด CSS class แบบมีเงื่อนไข ---
                className={`relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 py-4 text-center shadow-sm backdrop-blur transition-all duration-300
                  ${
                    isEnabled
                      ? 'cursor-pointer' // ถ้าเปิด: ให้มี cursor เป็นรูปมือ
                      : 'cursor-not-allowed grayscale opacity-50' // ถ้าปิด: เปลี่ยน cursor, เป็นสีเทา, และโปร่งแสง
                  }`}
                // --- END: 4. กำหนด CSS class ---
              >
                <div
                  className={`flex items-center justify-center rounded-full bg-gradient-to-b p-4 ${service.bg} rounded-full text-white shadow-sm`}
                >
                  <service.icon size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-800">{service.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}