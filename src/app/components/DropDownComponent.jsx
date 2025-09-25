"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function DropDownComponent({
  options,
  selectedOption,
  onSelect,
  placeholder = "กรุณาเลือก",
  label,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. สร้าง ref เพื่ออ้างอิงถึง element หลักของ Dropdown
  const dropdownRef = useRef(null);

  // 2. ใช้ useEffect เพื่อจัดการกับการคลิกนอก Component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // ถ้าเงื่อนไขเป็นจริง ให้ปิด Dropdown
      }
    };

    // 4. เพิ่ม Event Listener เข้าไปใน document เพื่อดักจับ event 'mousedown'
    // ที่เกิดขึ้นที่ใดก็ได้ในหน้าเว็บ
    document.addEventListener("mousedown", handleClickOutside);

    // 5. Cleanup function: ส่วนนี้สำคัญมาก จะทำงานเมื่อ component ถูก unmount
    // เพื่อลบ Event Listener ออกไป ป้องกัน memory leak
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Dependency array เป็นค่าว่าง [] เพื่อให้ useEffect นี้ทำงานแค่ครั้งเดียวตอน component mount

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -10 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    // 6. ผูก ref ที่สร้างไว้เข้ากับ element หลักของ component
    <div className="relative z-10 w-full" ref={dropdownRef}>
      {label && <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`relative flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-left text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none ${
          disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "text-slate-800"
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-[9999] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                variants={itemVariants}
                onClick={() => handleSelect(option)}
                className="cursor-pointer px-4 py-2 text-sm text-slate-700 hover:bg-blue-50"
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
