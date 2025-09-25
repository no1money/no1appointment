"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, TrainFront, X, ArrowLeft } from "lucide-react";

// --- Data for Dropdowns ---
const mallOptions = [
  "เซ็นทรัล ชิดลม",
  "เซ็นทรัล ลาดพร้าว",
  "เซ็นทรัล รามอินทรา",
  "เซ็นทรัลเวิลด์",
  "สีลมคอมเพล็กซ์",
  "เซ็นทรัล บางนา",
  "เซ็นทรัล ปิ่นเกล้า",
  "เซ็นทรัล พระราม 3",
  "เซ็นทรัล พระราม 2",
  "เซ็นทรัล เอ็มบาสซี",
  "เซ็นทรัล อีสต์วิลล์",
  "แฟชั่นไอส์แลนด์",
  "เซ็นทรัล พระราม 9",
  "โรบินสันลาดกระบัง",
  "เดอะมอล รามคำแหง",
  "เดอะมอล ท่าพระ (ธนบุรี)",
  "เดอะมอล บางกะปิ",
  "เดอะมอล บางแค",
  "เอ็มโพเรียม (สุขุมวิท 24)",
  "พารากอน",
  "เอ็มควอเทียร์",
  "เอ็มสเฟียร์",
  "โลตัส ซีคอนสแควร์ (ประเวศ)",
  "โลตัส พระราม 1 (บรรทัดทอง)",
  "โลตัส พระราม 2",
  "โลตัส พระราม 3",
  "โลตัส พระราม 4",
  "โลตัส ฟอร์จูนทาวน์ (พระราม 9)",
  "โลตัส บางแค",
  "โลตัส บางกะปิ",
  "โลตัส บางปะกอก",
  "โลตัส ประชาชื่น (เตาปูน)",
  "โลตัส มีนบุรี",
  "โลตัส ลาดพร้าว (พหลโยธิน)",
  "โลตัส หลักสี่ (บางเขน)",
  "โลตัส ปิ่นเกล้า (ถนนบรมราชชนนี)",
  "โลตัส สุขาภิบาล 1",
  "โลตัส สุขาภิบาล 3",
  "โลตัส เอกมัย-รามอินทรา",
  "โลตัส วังหิน",
  "โลตัส จรัญสนิทวงศ์ (บางพลัด)",
  "โลตัส แจ้งวัฒนะ",
  "โลตัส สุขุมวิท 50 (BTS อ่อนนุช)",
  "โลตัส พัฒนาการ",
  "โลตัส หนองจอก",
  "โลตัส อ่อนนุช 80",
  "โลตัส ลาดกระบัง",
  "โลตัส เลียบคลองสอง (ซาฟารีเวิลด์)",
  "โลตัส เจริญนคร (ไอซีเอส / โลตัส พรีเว่)",
  "โลตัส ถนนศรีอยุธยา (แม็คโคร x โลตัสมอลล์)",
  "โลตัส จรัญสนิทวงศ์ 2 (แม็คโคร x โลตัสมอลล์)",
  "โลตัส สาทร (แม็คโคร x โลตัสมอลล์)",
  "บิ๊กซี แจ้งวัฒนะ",
  "บิ๊กซี ดอนเมือง (สะพานใหม่)",
  "บิ๊กซี ดาวคะนอง",
  "บิ๊กซี บางนา",
  "บิ๊กซี บางบอน",
  "บิ๊กซี บางปะกอก",
  "บิ๊กซี พระราม 2",
  "บิ๊กซี พระราม 2 สาขา 2",
  "บิ๊กซี พระราม 4",
  "บิ๊กซี เพชรเกษม (เพชรเกษม พาวเวอร์เซ็นเตอร์)",
  "บิ๊กซี เพชรเกษม 2",
  "บิ๊กซี แฟชั่นไอส์แลนด์ (ค้นนายาว)",
  "บิ๊กซี รัชดาภิเษก (เอ็มอาร์ที ศูนย์วัฒนธรรมฯ) (เพลส)",
  "บิ๊กซี ร่มเกล้า",
  "บิ๊กซี รามอินทรา",
  "บิ๊กซี ราชดำริ",
  "บิ๊กซี ลาดพร้าว (อิมพีเรียลเวิลด์ ลาดพร้าว)",
  "บิ๊กซี ลาดพร้าว 2",
  "บิ๊กซี วงศ์สว่าง (มาร์เก็ตเพลส วงศ์สว่าง)",
  "บิ๊กซี สะพานควาย",
  "บิ๊กซี สุขาภิบาล 3",
  "บิ๊กซี สุวินทวงศ์",
  "บิ๊กซี หนองจอก",
  "บิ๊กซี หัวหมาก (หัวหมาก เซ็นเตอร์)",
  "บิ๊กซี อิสรภาพ",
  "บิ๊กซี เอกมัย (เอกมัย พาวเวอร์เซ็นเตอร์)",
  "บิ๊กซี อ่อนนุช",
  "บิ๊กซี กัลปพฤกษ์",
  "บิ๊กซี สุขาภิบาล 5 (ฟู้ดเพลส)",
  "บิ๊กซี บางซื่อ (ฟู้ดเพลส) (เกทเวย์ แอท บางซื่อ)",
  "บิ๊กซี สามย่าน (ฟู้ดเพลส) (สามย่านมิตรทาวน์)",
  "บิ๊กซี เคหะร่มเกล้า (ฟู้ดเพลส)",
  "บิ๊กซี สายไหม (ฟู้ดเพลส)",
  "บิ๊กซี สวนหลวง ร.9 (ฟู้ดเพลส)",
  "บิ๊กซี ประชาอุทิศ (ทุ่งครุ) (ฟู้ดเพลส)",
  "บิ๊กซี หทัยราษฎร์ (ฟู้ดเพลส)",
  "บิ๊กซี เอเชียทีค เดอะริเวอร์ฟรอนต์ (ฟู้ดเพลส)",
  "บิ๊กซี ดิโอลด์สยาม (พาหุรัด) (ฟู้ดเพลส)",
  "บิ๊กซี เดอะแจ๊ส รามอินทรา (ฟู้ดเพลส)",
  "บิ๊กซี วัน แบงค็อก (บางกอก มาร์เช่)",
  "บิ๊กซี เดอะ เชสเตอร์ โชคชัย 4 (ฟู้ดเซอร์วิส)",
];

const btsStations = [
  "คูคต",
  "แยก คปอ.",
  "พิพิธภัณฑ์กองทัพอากาศ",
  "โรงพยาบาลภูมิพลอดุลยเดช",
  "สะพานใหม่",
  "สายหยุด",
  "พหลโยธิน 59",
  "วัดพระศรีมหาธาตุ",
  "กรมทหารราบที่ 11",
  "บางบัว",
  "กรมป่าไม้",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "เสนานิคม",
  "รัชโยธิน",
  "พหลโยธิน 24",
  "ห้าแยกลาดพร้าว",
  "หมอชิต",
  "สะพานควาย",
  "อารีย์",
  "สนามเป้า",
  "อนุสาวรีย์ชัยสมรภูมิ",
  "พญาไท",
  "ราชเทวี",
  "สยาม",
  "ชิดลม",
  "เพลินจิต",
  "นานา",
  "อโศก",
  "พร้อมพงษ์",
  "ทองหล่อ",
  "เอกมัย",
  "พระโขนง",
  "อ่อนนุช",
  "บางจาก",
  "ปุณณวิถี",
  "อุดมสุข",
  "บางนา",
  "แบริ่ง",
  "สำโรง",
  "ปู่เจ้า",
  "ช้างเอราวัณ",
  "โรงเรียนนายเรือ",
  "ปากน้ำ",
  "ศรีนครินทร์",
  "แพรกษา",
  "สายลวด",
  "เคหะฯ",
  "สนามกีฬาแห่งชาติ",
  "ราชดำริ",
  "ศาลาแดง",
  "ช่องนนทรี",
  "สุรศักดิ์",
  "สะพานตากสิน",
  "กรุงธนบุรี",
  "วงเวียนใหญ่",
  "โพธิ์นิมิตร",
  "ตลาดพลู",
  "วุฒากาศ",
  "บางหว้า",
];

// Animation variants
const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 250, damping: 25 } },
  exit: { scale: 0.9, opacity: 0 },
};

export default function OffSitePicker({ isOffSiteShowing, setIsOffSiteShowing, setFormData }) {
  const [activeSelection, setActiveSelection] = useState(null); // 'malls' | 'bts' | null

  // Reset internal state when the modal is closed from the parent
  useEffect(() => {
    if (!isOffSiteShowing) {
      // Use a timeout to allow the exit animation to complete before resetting
      setTimeout(() => {
        setActiveSelection(null);
      }, 200);
    }
  }, [isOffSiteShowing]);

  const handleFinalSelect = (e) => {
    const locationName = e.target.value;
    if (locationName) {
      setFormData((prev) => ({ ...prev, locationDetails: locationName }));
      setIsOffSiteShowing(false);
    }
  };

  const renderContent = () => {
    if (activeSelection === "malls") {
      return (
        <>
          <h3 className="text-xl font-bold text-center mb-4">เลือกห้างสรรพสินค้า</h3>
          <select
            onChange={handleFinalSelect}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            defaultValue=""
          >
            <option value="" disabled>
              -- กรุณาเลือก --
            </option>
            {mallOptions.map((mall) => (
              <option key={mall} value={mall}>
                {mall}
              </option>
            ))}
          </select>
        </>
      );
    }

    if (activeSelection === "bts") {
      return (
        <>
          <h3 className="text-xl font-bold text-center mb-4">เลือกสถานีรถไฟฟ้า</h3>
          <select
            onChange={handleFinalSelect}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            defaultValue=""
          >
            <option value="" disabled>
              -- กรุณาเลือก --
            </option>
            {btsStations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </>
      );
    }

    // Default view
    return (
      <>
        <h3 className="text-xl font-bold text-center mb-6">เลือกประเภทสถานที่</h3>
        <div className="flex justify-around items-center gap-4">
          <motion.div
            key="malls"
            className="flex flex-col items-center gap-2 p-4 text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-lg cursor-pointer w-full text-center"
            onClick={() => setActiveSelection("malls")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Store size={28} />
            <span className="font-semibold">ห้างสรรพสินค้า</span>
          </motion.div>
          <motion.div
            key="bts"
            className="flex flex-col items-center gap-2 p-4 text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-lg cursor-pointer w-full text-center"
            onClick={() => setActiveSelection("bts")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrainFront size={28} />
            <span className="font-semibold">สถานีรถไฟฟ้า</span>
          </motion.div>
        </div>
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOffSiteShowing && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setIsOffSiteShowing(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOffSiteShowing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"
            >
              <X size={24} />
            </motion.button>

            {/* Back button appears only when a selection has been made */}
            {activeSelection && (
              <motion.button
                onClick={() => setActiveSelection(null)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold"
                whileHover={{ x: -2 }}
              >
                <ArrowLeft size={18} />
                กลับ
              </motion.button>
            )}

            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
