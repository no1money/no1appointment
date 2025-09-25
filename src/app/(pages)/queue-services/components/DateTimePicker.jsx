"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { th } from "date-fns/locale";
import { format, isSameDay, parseISO, startOfDay, addDays } from "date-fns";
import { ArrowLeft, Wrench, Building, Smartphone, MapPin } from "lucide-react";
import DropDownComponent from "../../../components/DropDownComponent";
import axios from "axios"; // **สำคัญ:** อย่าลืมติดตั้ง axios: npm install axios

// --- STATIC DATA FOR LOCATIONS (ไม่เปลี่ยนแปลง) ---
const MALLS = [
  { label: "สยามพารากอน", value: "สยามพารากอน" },
  { label: "เซ็นทรัลเวิลด์", value: "เซ็นทรัลเวิลด์" },
  { label: "มาบุญครอง (MBK Center)", value: "มาบุญครอง" },
  { label: "เอ็มควอเทียร์", value: "เอ็มควอเทียร์" },
  { label: "เดอะมอลล์ บางกะปิ", value: "เดอะมอลล์_บางกะปิ" },
  { label: "แฟชั่นไอส์แลนด์", value: "แฟชั่นไอส์แลนด์" },
  { label: "ไอคอนสยาม", value: "ไอคอนสยาม" },
  { label: "เทอร์มินอล 21 อโศก", value: "เทอร์มินอล_21_อโศก" },
  { label: "เมกาบางนา", value: "เมกาบางนา" },
  { label: "สยามดิสคัฟเวอรี่", value: "สยามดิสคัฟเวอรี่" },
  { label: "สยามเซ็นเตอร์", value: "สยามเซ็นเตอร์" },
  { label: "เดอะมอลล์ งามวงศ์วาน", value: "เดอะมอลล์_งามวงศ์วาน" },
  { label: "เซ็นทรัลพลาซา ลาดพร้าว", value: "เซ็นทรัลพลาซา_ลาดพร้าว" },
  { label: "เซ็นทรัลพลาซา ปิ่นเกล้า", value: "เซ็นทรัลพลาซา_ปิ่นเกล้า" },
  { label: "เซ็นทรัลพระราม 9", value: "เซ็นทรัลพระราม_9" },
  { label: "เซ็นทรัลเวสต์เกต", value: "เซ็นทรัลเวสต์เกต" },
  { label: "ฟิวเจอร์พาร์ค รังสิต", value: "ฟิวเจอร์พาร์ค_รังสิต" },
  { label: "ซีคอนสแควร์", value: "ซีคอนสแควร์" },
  { label: "พาราไดซ์ พาร์ค", value : "พาราไดซ์_พาร์ค" },
  { label: "ยูเนี่ยน มอลล์", value: "ยูเนี่ยน_มอลล์" },
  { label: "เดอะสตรีท รัชดา", value: "เดอะสตรีท_รัชดา" },
  { label: "เกษรวิลเลจ", value: "เกษรวิลเลจ" },
  { label: "เอ็มโพเรียม", value: "เอ็มโพเรียม" },
  { label: "เกตเวย์ เอกมัย", value: "เกตเวย์_เอกมัย" },
  { label: "เดอะมอลล์ ท่าพระ", value: "เดอะมอลล์_ท่าพระ" },
  { label: "วัน แบงค็อก", value: "วัน_แบงค็อก" },
  { label: "สามย่านมิตรทาวน์", value: "สามย่านมิตรทาวน์" },
  { label: "เอ็มสเฟียร์", value: "เอ็มสเฟียร์" }
];

const MRT_DATA = {
  lines: {
    BL: {
      line_name_th: "สายสีน้ำเงิน",
      stations: [
        { station_code: "BL01", name_th: "ท่าพระ" },
        { station_code: "BL02", name_th: "จรัญฯ 13" },
        { station_code: "BL03", name_th: "ไฟฉาย" },
        { station_code: "BL04", name_th: "บางขุนนนท์" },
        { station_code: "BL05", name_th: "บางยี่ขัน" },
        { station_code: "BL06", name_th: "สิรินธร" },
        { station_code: "BL07", name_th: "บางพลัด" },
        { station_code: "BL08", name_th: "บางอ้อ" },
        { station_code: "BL09", name_th: "บางโพ" },
        { station_code: "BL10", name_th: "เตาปูน" },
        { station_code: "BL11", name_th: "บางซื่อ" },
        { station_code: "BL12", name_th: "กำแพงเพชร" },
        { station_code: "BL13", name_th: "สวนจตุจักร" },
        { station_code: "BL14", name_th: "พหลโยธิน" },
        { station_code: "BL15", name_th: "ลาดพร้าว" },
        { station_code: "BL16", name_th: "รัชดาภิเษก" },
        { station_code: "BL17", name_th: "สุทธิสาร" },
        { station_code: "BL18", name_th: "ห้วยขวาง" },
        { station_code: "BL19", name_th: "ศูนย์วัฒนธรรมแห่งประเทศไทย" },
        { station_code: "BL20", name_th: "พระราม 9" },
        { station_code: "BL21", name_th: "เพชรบุรี" },
        { station_code: "BL22", name_th: "สุขุมวิท" },
        { station_code: "BL23", name_th: "ศูนย์การประชุมแห่งชาติสิริกิติ์" },
        { station_code: "BL24", name_th: "คลองเตย" },
        { station_code: "BL25", name_th: "ลุมพินี" },
        { station_code: "BL26", name_th: "สีลม" },
        { station_code: "BL27", name_th: "สามย่าน" },
        { station_code: "BL28", name_th: "หัวลำโพง" },
        { station_code: "BL29", name_th: "วัดมังกร" },
        { station_code: "BL30", name_th: "สามยอด" },
        { station_code: "BL31", name_th: "สนามไชย" },
        { station_code: "BL32", name_th: "อิสรภาพ" },
        { station_code: "BL33", name_th: "บางไผ่" },
        { station_code: "BL34", name_th: "บางหว้า" },
        { station_code: "BL35", name_th: "เพชรเกษม 48" },
        { station_code: "BL36", name_th: "ภาษีเจริญ" },
        { station_code: "BL37", name_th: "บางแค" },
        { station_code: "BL38", name_th: "หลักสอง" },
      ],
    },
    PP: {
      line_name_th: "สายสีม่วง",
      stations: [
        { station_code: "PP01", name_th: "คลองบางไผ่" },
        { station_code: "PP02", name_th: "ตลาดบางใหญ่" },
        { station_code: "PP03", name_th: "สามแยกบางใหญ่" },
        { station_code: "PP04", name_th: "บางพลู" },
        { station_code: "PP05", name_th: "บางรักใหญ่" },
        { station_code: "PP06", name_th: "บางรักน้อยท่าอิฐ" },
        { station_code: "PP07", name_th: "ไทรม้า" },
        { station_code: "PP08", name_th: "สะพานพระนั่งเกล้า" },
        { station_code: "PP09", name_th: "แยกนนทบุรี 1" },
        { station_code: "PP10", name_th: "บางกระสอ" },
        { station_code: "PP11", name_th: "ศูนย์ราชการนนทบุรี" },
        { station_code: "PP12", name_th: "กระทรวงสาธารณสุข" },
        { station_code: "PP13", name_th: "แยกติวานนท์" },
        { station_code: "PP14", name_th: "วงศ์สว่าง" },
        { station_code: "PP15", name_th: "บางซ่อน" },
        { station_code: "PP16", name_th: "เตาปูน" },
      ],
    },
  },
};

// --- START: แก้ไขฟังก์ชันนี้ ---
const formatSlotLabel = (startTime, endTime) => {
  // แก้ไข timezone ให้ถูกต้องก่อน parse เพื่อให้แสดงผลเวลาไทยที่ถูกต้อง
  const correctedStartTime = startTime.replace('Z', '+07:00');
  const correctedEndTime = endTime.replace('Z', '+07:00');

  const startDate = parseISO(correctedStartTime);
  const endDate = parseISO(correctedEndTime);
  
  // getHours() จะแสดงผลชั่วโมงที่ถูกต้องตามเวลาไทย
  const startHour = String(startDate.getHours()).padStart(2, '0');
  const startMinute = String(startDate.getMinutes()).padStart(2, '0');
  const endHour = String(endDate.getHours()).padStart(2, '0');
  const endMinute = String(endDate.getMinutes()).padStart(2, '0');
  return `${startHour}:${startMinute}-${endHour}:${endMinute}`;
};
// --- END: สิ้นสุดการแก้ไข ---


export default function DateTimePicker({
  formData,
  setFormData,
  setAppState,
}) {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [locationType, setLocationType] = useState(formData.appointmentType || "onsite");
  
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState(null);
  const [btsLinesData, setBtsLinesData] = useState([]);
  const [btsLoading, setBtsLoading] = useState(false);
  const [btsError, setBtsError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await axios.get('https://cp-queue-backend.vercel.app/api/settings/เซ็นเตอร์วัน');
        setSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setSettingsError("ไม่สามารถโหลดการตั้งค่าร้านได้");
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const daysList = useMemo(() => {
    if (!settings) return [];

    const closedDaysSet = new Set(
      settings.availability.closedDays.map(d => format(parseISO(d), 'yyyy-MM-dd'))
    );

    return Array.from({ length: 7 }, (_, i) => addDays(today, i))
      .filter(day => !closedDaysSet.has(format(day, 'yyyy-MM-dd')));
  }, [settings, today]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.serviceType || !locationType || !selectedDate) {
        return;
      }

      setSlotsLoading(true);
      setSlotsError(null);
      setTimeSlots([]);

      try {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        const dateForApi = new Date(Date.UTC(year, month, day));
        
        const params = {
          serviceType: formData.serviceType,
          type: locationType.toUpperCase(),
          date: dateForApi.toISOString(),
        };
        
        const response = await axios.get('https://cp-queue-backend.vercel.app/api/availability', { params });
        setTimeSlots(response.data);

      } catch (error) {
        console.error("Failed to fetch availability:", error);
        setSlotsError(error.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลคิวว่าง");
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, formData.serviceType, locationType]);

  const availableLocationOptions = useMemo(() => {
    const platformStatus = settings?.platformStatus ?? { onsite: true, offsite: true, online: true };

    const allOptions = [
      { key: "offsite", label: "นอกสถานที่" },
      { key: "onsite", label: "ที่ร้าน" },
      { key: "online", label: "ออนไลน์" },
    ];
    return allOptions.filter(opt => {
      const isPlatformEnabled = platformStatus[opt.key] ?? true;
      if (!isPlatformEnabled) return false;
      switch (opt.key) {
        case "onsite": return true;
        case "offsite": return formData.serviceType !== "ซ่อมมือถือ";
        case "online": return ["รีไฟแนนซ์", "ไอโฟนแลกเงิน"].includes(formData.serviceType);
        default: return false;
      }
    });
  }, [formData.serviceType, settings]);

  useEffect(() => {
    const isCurrentLocationTypeValid = availableLocationOptions.some(
      (opt) => opt.key === locationType
    );
    if (!isCurrentLocationTypeValid && availableLocationOptions.length > 0) {
      setLocationType(availableLocationOptions[0].key);
    }
  }, [availableLocationOptions, locationType]);

  useEffect(() => {
    // This is a local API call, likely fine as a relative path.
    const fetchBtsData = async () => {
      if (formData.serviceType === "ซ่อมมือถือ") return;
      setBtsLoading(true);
      setBtsError(null);
      try {
        const response = await fetch('/api/bts-stations');
        if (!response.ok) {
          throw new Error(`เกิดข้อผิดพลาดในการเรียก API: ${response.statusText}`);
        }
        const apiData = await response.json();
        if (apiData && apiData.IsSuccess && Array.isArray(apiData.data)) {
          setBtsLinesData(apiData.data);
        } else {
          throw new Error(apiData.ErrMessage || "รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }
      } catch (error)
      {
        console.error("Failed to fetch BTS data:", error);
        setBtsError(error);
      } finally {
        setBtsLoading(false);
      }
    };
    fetchBtsData();
  }, [formData.serviceType]);

  const dynamicLocationCategories = useMemo(() => {
    const btsLineCategories = btsLinesData.map(line => ({
      label: `BTS ${line.LineName_TH}`,
      value: `bts_line_${line.LineId}`
    }));
    const mrtLineCategories = Object.keys(MRT_DATA.lines).map(lineCode => ({
      label: `MRT ${MRT_DATA.lines[lineCode].line_name_th}`,
      value: `mrt_line_${lineCode}`
    }));
    return [
      { label: "ห้างสรรพสินค้า", value: "mall" },
      ...btsLineCategories,
      ...mrtLineCategories
    ];
  }, [btsLinesData]);

  const detailOptions = useMemo(() => {
    if (!formData.locationCategory) return [];
    const { value } = formData.locationCategory;
    if (value === 'mall') {
      return MALLS;
    }
    if (value.startsWith('bts_line_')) {
      const lineId = parseInt(value.replace('bts_line_', ''), 10);
      const selectedLine = btsLinesData.find(line => line.LineId === lineId);
      if (selectedLine && selectedLine.StationList) {
        return selectedLine.StationList.map(station => ({
          label: `สถานี ${station.StationNameTH.trim()} (${station.StationKey})`,
          value: station.StationKey,
        }));
      }
    }
    if (value.startsWith('mrt_line_')) {
      const lineCode = value.replace('mrt_line_', '');
      const lineData = MRT_DATA.lines[lineCode];
      if (lineData && lineData.stations) {
        return lineData.stations.map(station => ({
          label: `สถานี ${station.name_th} (${station.station_code})`,
          value: station.station_code,
        }));
      }
    }
    return [];
  }, [formData.locationCategory, btsLinesData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, appointmentType: locationType }));
  }, [locationType, setFormData]);

  const handleLocationCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      locationCategory: category,
      locationDetail: null,
    }));
  };

  const handleLocationDetailSelect = (detail) => {
    setFormData((prev) => ({
      ...prev,
      locationDetail: detail,
    }));
  };

  const handleBook = (slot) => {
    const appointmentAtISO = slot.type === 'OFFSITE_DAILY'
      ? new Date(`${slot.date}T00:00:00.000Z`).toISOString()
      : slot.startTime;
    setFormData((prev) => ({
      ...prev,
      appointmentAt: appointmentAtISO,
    }));
    setAppState("user_details");
  };

  // --- START: แก้ไขฟังก์ชันนี้ ---
  const renderTimeSlots = () => {
    if (slotsLoading) {
      return (
        <div className="p-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          กำลังตรวจสอบคิวว่าง...
        </div>
      );
    }
    if (slotsError) {
      return <div className="p-10 text-center text-red-600">เกิดข้อผิดพลาด: {slotsError}</div>;
    }

    let displaySlots = timeSlots;

    if (isSameDay(selectedDate, new Date())) {
      const nowTimestamp = Date.now(); 

      displaySlots = timeSlots.filter(slot => {
        if (slot.type === 'OFFSITE_DAILY') {
            return true;
        }

        // แก้ไข timezone ของเวลาที่ได้จาก API ให้ถูกต้อง (เป็นเวลาไทย)
        // โดยการแทนที่ 'Z' (UTC) ด้วย '+07:00' (Thailand Timezone)
        const correctThaiIsoString = slot.startTime.replace('Z', '+07:00');
        
        // แปลง string ที่แก้ไขแล้วเป็น timestamp ที่ถูกต้อง
        const slotStartTimestamp = parseISO(correctThaiIsoString).getTime();
        
        // เปรียบเทียบ timestamp ที่ถูกต้องกับเวลาปัจจุบัน
        return slotStartTimestamp > nowTimestamp;
      });
    }

    if (!displaySlots || displaySlots.length === 0) {
      const isToday = isSameDay(selectedDate, new Date());
      const message = isToday ? "ไม่มีช่วงเวลาว่างสำหรับวันนี้แล้ว" : "ไม่มีคิวว่างในวันที่เลือก";
      return <p className="py-4 text-center text-sm text-slate-500">{message}</p>;
    }
    
    if (locationType === "offsite") {
      const offsiteSlot = displaySlots.find(s => s.type === 'OFFSITE_DAILY');
      if (!offsiteSlot) return <p className="py-4 text-center text-sm text-slate-500">ไม่มีคิวว่างนอกสถานที่สำหรับวันนี้</p>;
      
      return <TimeRowFullDay slot={offsiteSlot} onBook={() => handleBook(offsiteSlot)} />;
    }

    return (
      <div className="space-y-2">
        {displaySlots.map((slot) => (
          <TimeSlotRow
            key={slot.startTime}
            slot={slot}
            onBook={() => handleBook(slot)}
          />
        ))}
      </div>
    );
  };
  // --- END: สิ้นสุดการแก้ไข ---
  
  if (settingsLoading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        กำลังโหลดการตั้งค่า...
      </div>
    );
  }

  if (settingsError) {
    return <div className="p-10 text-center text-red-600">{settingsError}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="mx-auto flex w-full flex-col gap-4 sm:max-w-[480px]"
    >
      <div className="flex flex-col items-start gap-3">
        <button
          type="button"
          onClick={() => setAppState("selecting_service")}
          className="flex items-center gap-2 rounded-full border border-transparent bg-white/60 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 text-indigo-600" /> กลับ
        </button>
        <div>
          <h1 className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-lg font-extrabold text-transparent sm:text-xl">
            ระบบจองคิวออนไลน์
          </h1>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-white/60 to-white/30 p-4 shadow-sm shadow-black/15">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">บริการ</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                {formData.serviceType || "ไม่ระบุ"}
              </div>
              <div className="text-sm text-slate-500">({locationType})</div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div>เวลาทำการ: 11:00 - 19:00</div>
            <div className="mt-1 flex items-center justify-end gap-1">
              <MapPin className="h-4 w-4 text-indigo-500" />{" "}
              <span className="pt-0.5">Center one</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
            <div className="mb-2 text-sm font-semibold text-slate-700">สถานที่</div>
            <div className="flex flex-wrap gap-2">
              {availableLocationOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLocationType(opt.key)}
                  aria-pressed={locationType === opt.key}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    locationType === opt.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "border border-stone-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.key === "offsite" && <Wrench className={`h-4 w-4 ${locationType === opt.key ? "text-white" : "text-purple-600"}`} />}
                  {opt.key === "onsite" && <Building className={`h-4 w-4 ${locationType === opt.key ? "text-white" : "text-blue-600"}`} />}
                  {opt.key === "online" && <Smartphone className={`h-4 w-4 ${locationType === opt.key ? "text-white" : "text-green-600"}`} />}
                  {opt.label}
                </button>
              ))}
            </div>
        </div>
        
        {formData.serviceType !== "ซ่อมมือถือ" && locationType === "offsite" && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 rounded-2xl bg-white/60 p-4 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-slate-700">เลือกสถานที่นัดหมาย</h3>
            <div className="relative z-20">
              <DropDownComponent
                label="หมวดหมู่สถานที่"
                options={dynamicLocationCategories}
                selectedOption={formData.locationCategory}
                onSelect={handleLocationCategorySelect}
                placeholder={btsLoading ? "กำลังโหลดประเภทสถานที่..." : "เลือกประเภทสถานที่"}
                disabled={btsLoading}
              />
            </div>
            {btsError && (
              <div className="text-xs text-red-600">
                เกิดข้อผิดพลาดในการโหลดข้อมูล BTS: {btsError.message}
              </div>
            )}
            {formData.locationCategory && !btsError && (
              <div className="relative z-10">
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                  <DropDownComponent
                    label="ระบุสถานที่"
                    options={detailOptions}
                    selectedOption={formData.locationDetail}
                    onSelect={handleLocationDetailSelect}
                    placeholder="เลือกสถานที่"
                    disabled={!formData.locationCategory || detailOptions.length === 0}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

      </div>
       <div className="rounded-2xl">
        <div className="text-sm font-semibold text-slate-700">เลือกวัน (ภายใน 7 วันถัดไป)</div>
        <div className="flex gap-2 overflow-x-scroll p-2" role="list" aria-label="เลือกวัน">
          {daysList.map((d) => {
            const active = isSameDay(d, selectedDate);
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`flex h-16 w-16 flex-shrink-0 snap-center flex-col items-center justify-center gap-1.5 rounded-2xl border border-stone-200 text-center text-sm font-medium transition sm:w-20 ${
                  active
                    ? "bg-gradient-to-b from-blue-500 to-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="text-lg font-semibold leading-none">{format(d, "d", { locale: th })}</div>
                <div className="mt-1 text-xs opacity-70">{format(d, "eee", { locale: th })}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">ช่วงเวลานัดจอง</div>
        {renderTimeSlots()}
      </div>
    </motion.div>
  );
}

function TimeSlotRow({ slot, onBook }) {
  const { startTime, endTime, availableQuota } = slot;
  const isFull = availableQuota <= 0;
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-stone-200 bg-white/80 p-3 shadow-sm">
      <div className="text-sm font-medium text-slate-900">{formatSlotLabel(startTime, endTime)}</div>
      <div className="text-right">
        <div className={`font-mono text-xs ${isFull ? "text-red-600" : "text-slate-600"}`}>{isFull ? "เต็ม" : `ว่าง ${availableQuota}`}</div>
      </div>
      <button
        onClick={onBook}
        disabled={isFull}
        className={`w-20 rounded-lg px-2 py-1.5 text-sm font-semibold transition ${
          isFull ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:opacity-95"
        }`}
      >
        {isFull ? "เต็ม" : "จองคิว"}
      </button>
    </div>
  );
}

function TimeRowFullDay({ slot, onBook }) {
  const { availableQuota } = slot;
  const isFull = availableQuota <= 0;
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl border border-stone-200 bg-white/80 p-3 shadow-sm">
      <div className="text-sm font-medium text-slate-900">ทั้งวัน (นอกสถานที่)</div>
      <div className={`font-mono text-xs ${isFull ? "text-red-600" : "text-slate-600"}`}>{isFull ? "เต็ม" : `ว่าง ${availableQuota} คิว`}</div>
      <button
        onClick={onBook}
        disabled={isFull}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
          isFull ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm hover:opacity-95"
        }`}
      >
        {isFull ? "เต็ม" : "จองคิว"}
      </button>
    </div>
  );
}