"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi } from "lucide-react";

// Custom Hook สำหรับสร้างนาฬิกาที่อัปเดตทุกวินาที
const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return time;
};

// --- Sub-components (ไม่ต้องแก้ไข) ---

const DisplayHeader = () => {
  const currentTime = useCurrentTime();
  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex justify-between items-center p-6 md:p-8 lg:p-12 bg-slate-900 text-white rounded-t-2xl shadow-lg">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-2xl md:text-4xl font-bold">OK</span>
        </div>
        <h1 className="text-3xl md:text-[clamp(32px,4vw,64px)] font-bold tracking-wider">OK NUMBER ONE</h1>
      </div>
      <div className="text-right">
        <div className="text-3xl md:text-[clamp(28px,3.5vw,56px)] font-semibold font-mono tracking-wider">
          {formattedTime}
        </div>
        <div className="text-sm md:text-base opacity-80 mt-1">{formattedDate}</div>
      </div>
    </div>
  );
};

const youtubeUrl = `https://www.youtube.com/embed/videoseries?list=${process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID}&autoplay=1&mute=1&loop=1&controls=0&playlist=${process.env.NEXT_PUBLIC_YOUTUBE_FIRST_VIDEO_ID}`;

const VideoPanel = () => (
  <div className="w-full h-full shadow-2xl shadow-blue-500/40">
    {/* คอลัมน์ซ้าย (960px) /} */}
    {/* ส่วนวิดีโอ (540px) */}
    <iframe
      className="w-full h-full rounded-4xl"
      src={youtubeUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
);

const QueueItem = ({ number, counter, isCurrent }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -25 },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`grid grid-cols-2 gap-4 items-center p-4 rounded-xl transition-all duration-300
        ${
          isCurrent
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/40"
            : "bg-slate-800 text-slate-300"
        }`}
    >
      <span className="font-mono text-[clamp(32px,6vw,160px)] md:text-[clamp(48px,8vw,220px)] font-bold tracking-wider text-center">
        {number}
      </span>
      <span className="font-mono text-[clamp(32px,6vw,160px)] md:text-[clamp(48px,8vw,220px)] font-bold tracking-wider text-center">
        {counter}
      </span>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function QueueDisplayPage() {
  // ========================================================================
  // --- ส่วนของ Mock Data และการจำลอง Real-time ---
  // ========================================================================

  // 1. ข้อมูลเริ่มต้น (Mock Data)
  const initialAppointments = [
    { id: "68b10487732c19ebcee2a1a1", employeeInfo: { staffId: "COUNTER-01" } },
    { id: "68b10487732c19ebcee2a2b2", employeeInfo: { staffId: "COUNTER-03" } },
    { id: "68b10487732c19ebcee2a3c3", employeeInfo: { staffId: "COUNTER-02" } },
    { id: "68b10487732c19ebcee2a4d4", employeeInfo: { staffId: "COUNTER-05" } },
  ];

  // 2. State สำหรับเก็บข้อมูลคิว, สถานะ Loading, และ Error
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect สำหรับจำลองการดึงข้อมูลและการอัปเดตแบบ Real-time
  useEffect(() => {
    // จำลองการโหลดข้อมูลครั้งแรก
    const initialLoadTimeout = setTimeout(() => {
      setAppointments(initialAppointments);
      setIsLoading(false);
    }, 1500); // โหลด 1.5 วินาที

    // จำลองการอัปเดตคิวทุก 5 วินาที (เหมือน refetchInterval)
    const updateInterval = setInterval(() => {
      setAppointments((prevAppointments) => {
        // ถ้ามีคิวเหลืออยู่ ให้เอาคิวแรกออก
        const remaining = prevAppointments.length > 0 ? prevAppointments.slice(1) : [];

        // สร้างคิวใหม่แบบสุ่ม
        const newId = "68b10487732c19ebcee2a" + Math.random().toString(16).slice(2, 6);
        const newCounter = `COUNTER-0${Math.floor(Math.random() * 5) + 1}`;
        const newAppointment = { id: newId, employeeInfo: { staffId: newCounter } };

        // เพิ่มคิวใหม่เข้าไปต่อท้าย
        return [...remaining, newAppointment];
      });
    }, 5000); // อัปเดตทุก 5 วินาที

    // Cleanup function: หยุดการทำงานทั้งหมดเมื่อ Component ถูก unmount
    return () => {
      clearTimeout(initialLoadTimeout);
      clearInterval(updateInterval);
    };
  }, []); // รัน Effect นี้แค่ครั้งเดียวตอนเริ่ม

  const formatQueueNumber = (id) => {
    if (!id) return "---";
    const lastThreeHex = id.slice(-3);
    const num = parseInt(lastThreeHex, 16) % 1000;
    return String(num).padStart(3, "0");
  };

  const getCounterNumber = (staffId) => {
    if (!staffId) return "-";
    const match = staffId.match(/\d+$/);
    return match ? match[0] : "-";
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans p-4 overflow-hidden w-full">
      <div className="w-full max-w-none mx-auto bg-slate-800/50 sm:rounded-2xl shadow-2xl border border-slate-700 px-4 md:px-8">
        <DisplayHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10 h-[calc(100vh-128px)]">
          <div className="lg:col-span-2 h-full">
            <VideoPanel />
          </div>

          <div className="flex flex-col gap-6 h-full">
            <div className="grid grid-cols-2 gap-4 p-6 md:p-8 bg-slate-900/70 rounded-lg">
              <h2 className="text-2xl md:text-4xl font-semibold tracking-widest text-center text-blue-300">
                หมายเลขคิว
              </h2>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-widest text-center text-blue-300">
                ช่องบริการ
              </h2>
            </div>

            <div className="flex-grow flex flex-col gap-4 overflow-hidden p-2 md:p-4">
              <AnimatePresence>
                {appointments.map((apt, index) => (
                  <QueueItem
                    key={apt.id}
                    number={formatQueueNumber(apt.id)}
                    counter={getCounterNumber(apt.employeeInfo?.staffId)}
                    isCurrent={index === 0}
                  />
                ))}
              </AnimatePresence>
              {isLoading && <p className="text-center opacity-50 mt-4">Loading Queues...</p>}
              {error && <p className="text-center text-red-400 mt-4">Connection Error. Retrying...</p>}
            </div>

            <div className="flex-shrink-0 text-center text-slate-400 text-sm p-2">
              <Wifi size={14} className="inline-block mr-2 animate-pulse" />
              หน้าจอนี้จะอัปเดตข้อมูลอัตโนมัติ
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
