"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import Swal from "sweetalert2";
import { useLiff } from "@/app/components/Provider/LiffProvider";
import { useGetCustomer } from "@/app/(pages)/queue-services/hooks/useCustomer";
import {
  useCreateAppointment,
  useCreateNewUserAppointment,
  useGetAvailability,
} from "@/app/(pages)/queue-services/hooks/useAppointments";
import DateTimePicker from "./components/DateTimePicker";
import DPOConsent from "@/app/(pages)/queue-services/components/DPOConsent";
import UserDetailsForm from "@/app/(pages)/queue-services/components/UserDetailsForm";
import ServiceSelection from "@/app/(pages)/queue-services/components/ServiceSelection";
import BottomNavbar from "./components/BottomNavbar";

// --- START: ข้อมูลสำหรับหน้า Loading ---
const loadingVariants = [
  { petals: 12, radius: 60, from: "from-blue-400", to: "to-sky-500" },
  { petals: 8, radius: 55, from: "from-green-400", to: "to-emerald-500" },
];
const loadingMessages = [
  "กำลังตรวจสอบสถานะการให้บริการ...",
  "กำลังโหลดข้อมูลผู้ใช้งาน...",
  "ตรวจสอบนัดหมายล่าสุดของคุณ...",
  "จัดเตรียมตารางคิวสำหรับคุณ...",
  "เกือบพร้อมแล้วครับ...",
];
// --- END: ข้อมูลสำหรับหน้า Loading ---


// Component สำหรับแสดงเมื่อระบบปิดให้บริการ
const ServiceClosedComponent = () => {
  const handleContact = () => {
    window.location.href = "https://line.me/R/oaMessage/@okmobile/ติดต่อเจ้าหน้าที่";
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="text-center rounded-lg bg-white p-8 shadow-lg">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          ปิดให้บริการชั่วคราว
        </h2>
        <p className="mt-2 text-gray-600">
          ขออภัยในความไม่สะดวก ขณะนี้ระบบปิดให้บริการ
          กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามข้อมูลเพิ่มเติม
        </p>
        <button
          onClick={handleContact}
          className="mt-6 rounded-full bg-green-500 px-6 py-3 font-bold text-white shadow-md transition-transform duration-150 hover:scale-105"
        >
          ติดต่อเจ้าหน้าที่
        </button>
      </div>
    </div>
  );
};


const MY_BRANCHES = [
  { id: "ห้างเซ็นเตอร์วัน", name: "ห้างเซ็นเตอร์วัน" },
  { id: "กุดปลาดุก", name: "กุดปลาดุก" },
];


export default function HomePage() {
  const [settings, setSettings] = useState({
    isLoading: true,
    data: null,
    error: null,
  });

  const { liffProfile } = useLiff();
  const { data: customerData, isLoading: customerLoading } = useGetCustomer(
    liffProfile?.sub
  );
  const router = useRouter();

  // State สำหรับหน้า Loading
  const [messageIndex, setMessageIndex] = useState(0);
  const [variantIndex] = useState(0);


  useEffect(() => {
    const fetchSettings = async () => {
      // หน่วงเวลาเล็กน้อยเพื่อให้เห็น animation
      await new Promise(resolve => setTimeout(resolve, 500)); 
      try {
        const response = await fetch("https://cp-queue-backend.vercel.app/api/settings/เซ็นเตอร์วัน");
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลสถานะบริการได้");
        }
        const data = await response.json();
        setSettings({
          isLoading: false,
          data: data,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSettings({
          isLoading: false,
          data: null,
          error: error.message,
        });
      }
    };
    fetchSettings();
  }, []);


  useEffect(() => {
    // Logic การ Redirect จะทำงานอยู่เบื้องหลังเมื่อข้อมูลพร้อม
    if (!customerLoading && customerData && customerData.appointments?.length > 0) {
      router.push("/appointments/my-appointment");
    }
  }, [customerData, customerLoading, router]);

  // สร้าง flag รวมสถานะ loading ทั้งหมด
  const isOverallLoading = settings.isLoading || customerLoading;

  // useEffect สำหรับเปลี่ยนข้อความ Loading
  useEffect(() => {
    // เราจะให้ interval ทำงานตราบใดที่ยังต้องแสดงหน้า loading อยู่
    const shouldAnimate = isOverallLoading || (customerData && customerData.appointments?.length > 0);
    if (shouldAnimate) {
      const interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isOverallLoading, customerData]);

  
  const daysList = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);


  const [selectedDate, setSelectedDate] = useState(daysList[0]);
  const {
    data: availability,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useGetAvailability(selectedDate);


  const { mutate: createAppointment, isPending: isCreating } =
    useCreateAppointment();
  const { mutate: createNewUserAppointment, isPending: isCreatingNewUser } =
    useCreateNewUserAppointment();


  const [showDPO, setShowDPO] = useState(false);
  const [appState, setAppState] = useState("selecting_service");
  const [acceptDPO, setAcceptDPO] = useState(false);
  const [showDPOContent, setShowDPOContent] = useState(false);
  const [pressed, setPressed] = useState(false);


  const [formData, setFormData] = useState({
    appointmentType: "onsite",
    serviceType: "",
    customerName: "",
    customerPhone: "",
    appointmentAt: "",
    branchId: "",
    lineUserId: "",
    lineDisplayName: "",
    lineProfilePicUrl: "",
    email: "",
    note: "",
    locationCategory: null,
    locationDetail: null,
    depositSlip: null,
  });


  useEffect(() => {
    if (liffProfile) {
      setFormData((prev) => ({
        ...prev,
        lineUserId: liffProfile.sub,
        lineDisplayName: liffProfile.name,
        lineProfilePicUrl: liffProfile.picture,
        email: liffProfile.email,
      }));
    }
  }, [liffProfile]);


  console.log("LIFFPROFILE : ", liffProfile);
  console.log("FORMDATA : ", formData);


  const handleServiceSelect = (service) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: service.name,
    }));
    setAppState("selecting_date_time");
  };


  const handleAcceptDPO = () => {
    setShowDPO(false);
    localStorage.setItem("dpo_accepted", "true");
  };


  const handleGoBackToDateTime = () => {
    setAppState("selecting_date_time");
  };


  const handleCreateAppointment = async () => {
    console.log("Form Data in the handleCreateClicked", formData);
    if (!formData.appointmentAt || !formData.lineUserId) {
      console.error("Missing required data:", {
        appointmentAt: formData.appointmentAt,
        lineUserId: formData.lineUserId,
      });
      Swal.fire(
        "ข้อมูลไม่ครบ",
        "กรุณาเลือกวันและเวลา หรือรอข้อมูลผู้ใช้สักครู่",
        "warning"
      );
      return;
    }
  
    setPressed(true);
    
    let slipUrl = null;
  
    if (formData.appointmentType === "offsite") {
      if (!formData.depositSlip) {
        Swal.fire("ข้อมูลไม่ครบ", "กรุณาแนบสลิปค่ามัดจำ", "warning");
        setPressed(false);
        return;
      }
  
      Swal.fire({
        title: "กำลังตรวจสอบสลิป...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      try {
        const verifyFormData = new FormData();
        verifyFormData.append("file", formData.depositSlip);
  
        const verifyResponse = await fetch("https://slip2-go.vercel.app/api/verify-slip", {
          method: "POST",
          body: verifyFormData,
        });
  
        const verifyResult = await verifyResponse.json();
        console.log("[SLIP DEBUG] Parsed JSON Result:", verifyResult);
  
        if (!verifyResponse.ok || !verifyResult.data?.amount || parseFloat(verifyResult.data.amount) !== 200) {
          Swal.fire({
            title: "ตรวจสอบสลิปไม่สำเร็จ",
            text: `ยอดเงินในสลิปไม่ถูกต้อง (ยอดที่พบ: ${verifyResult.data?.amount || 'N/A'} บาท) กรุณาแนบสลิป 200 บาท`,
            icon: "error",
          });
          setPressed(false);
          return;
        }
  
        Swal.update({
          title: "กำลังอัปโหลดสลิป...",
          showConfirmButton: false,
          showCancelButton: false,
          showDenyButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
              Swal.showLoading();
          }
      });
  
        const uploadFormData = new FormData();
        uploadFormData.append("myFile", formData.depositSlip);
        uploadFormData.append("userId", formData.lineUserId || "guest-user");
  
        const uploadResponse = await fetch("https://google-drive-uploader-seven-nu.vercel.app/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        const uploadResult = await uploadResponse.json();
        console.log("[UPLOAD DEBUG] Response OK?:", uploadResponse.ok);
        console.log("[UPLOAD DEBUG] Parsed Upload JSON Result:", uploadResult);
  
        if (!uploadResponse.ok) {
           throw new Error(uploadResult.details || 'ไม่สามารถอัปโหลดสลิปได้');
        }
        
        slipUrl = uploadResult.data.url;
        Swal.close();
  
      } catch (error) {
        console.error("Slip processing error:", error);
        Swal.fire("เกิดข้อผิดพลาด", error.message || "การประมวลผลสลิปล้มเหลว", "error");
        setPressed(false);
        return;
      }
    }
  
    const getRequiredTags = (serviceType) => {
      switch (serviceType) {
        case "รีไฟแนนซ์":
          return ["REFINANCE"];
        case "ซ่อมมือถือ":
          return ["ENGINEER"];
        default:
          return ["GENERAL"];
      }
    };
  
    const customer = {
      line_display_name: formData.lineDisplayName,
      fullname: formData.customerName,
      phone: formData.customerPhone,
      line_user_id: formData.lineUserId,
      email: formData.email,
      picture_url: formData.lineProfilePicUrl,
    };
  
    let finalNote = formData.note || `บริการ: ${formData.serviceType}`;
    if (
      formData.appointmentType === "offsite" &&
      formData.locationCategory &&
      formData.locationDetail
    ) {
      finalNote += `\nสถานที่นัดหมาย: ${formData.locationCategory.label} - ${formData.locationDetail.label}`;
    }
    
    const appointment = {
      appointmentType: formData.appointmentType,
      serviceType: formData.serviceType,
      appointmentAt: formData.appointmentAt,
      date: formData.appointmentAt,
      type: formData.appointmentType.toUpperCase(),
      note: finalNote,
      requiredTags: getRequiredTags(formData.serviceType),
      branchId: formData.branchId,
      slipUrl: slipUrl,
    };
    console.log("[FINAL PROOF] Sending this appointment object to backend:", appointment);
    const mutationConfig = {
      onSuccess: () => {
        Swal.fire({
          title: "จองคิวสำเร็จ!",
          text: "การนัดหมายของคุณได้รับการบันทึกแล้ว",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/appointments/my-appointment");
      },
      onError: (error) => {
        console.error("Failed to create appointment:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text:
            error.message ||
            "ไม่สามารถสร้างนัดหมายได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
        });
      },
      onSettled: () => {
        setPressed(false);
      }
    };
  
    if (!customerData) {
      createNewUserAppointment({ customer, appointment }, mutationConfig);
    } else {
      createAppointment(
        { appointment, customerId: customerData.id },
        mutationConfig
      );
    }
  };


  useEffect(() => {
    const goHome = () => setAppState("selecting_service");
    window.addEventListener("go-home", goHome);
    return () => {
      window.removeEventListener("go-home", goHome);
    };
  }, []);


  useEffect(() => {
    if (!isCreating && !isCreatingNewUser) setPressed(false);
  }, [isCreating, isCreatingNewUser]);
  

  // --- START: LOGIC การแสดงผลที่แก้ไขแล้ว ---

  // 1. แสดงหน้า Loading ถ้า (กำลังโหลดข้อมูล) หรือ (โหลดเสร็จแล้วแต่กำลังรอ redirect)
  if (isOverallLoading || (customerData && customerData.appointments?.length > 0)) {
    const v = loadingVariants[variantIndex] ?? loadingVariants[0];
    const petals = Array.from({ length: v.petals });
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 py-24 font-sans text-gray-800">
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="relative mx-auto h-44 w-44">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 to-white/40 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm" />
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "6s" }}>
              <div className="relative h-full w-full">
                {petals.map((_, i) => (
                  <span
                    key={i}
                    className={`absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${v.from} ${v.to} shadow-lg`}
                    style={{ transform: `rotate(${(360 / v.petals) * i}deg) translateY(-${v.radius}px)` }}
                  />
                ))}
                <span className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg ring-4 ring-white/50" />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-lg font-bold text-slate-800">กำลังโหลดข้อมูล</div>
            <div className="mt-2 text-sm text-slate-500">{loadingMessages[messageIndex]}</div>
          </div>
        </div>
      </main>
    );
  }

  // 2. ถ้าไม่เข้าเงื่อนไขข้างบน และระบบปิด, ให้แสดงหน้าปิดบริการ
  if (settings.error || !settings.data?.globalStatus) {
    return <ServiceClosedComponent />;
  }
  
  // 3. ถ้าทุกอย่างผ่าน (ไม่ loading, ไม่มีนัดหมาย, ระบบเปิด) แสดงหน้าจองคิวปกติ
  return (
    <div className="py-24">
      {showDPO && <DPOConsent onAccept={handleAcceptDPO} />}
      <section className="relative flex min-h-screen flex-col font-sans text-gray-800">
        <div className="flex h-full flex-col gap-4 p-4">
          <AnimatePresence mode="wait">
            {appState === "selecting_service" && (
              <motion.div
                key="service_selection_view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-8"
              >
                <ServiceSelection
                  customer={customerData}
                  onServiceSelect={handleServiceSelect}
                  serviceStatus={settings.data?.serviceStatus}
                />
              </motion.div>
            )}

            {appState === "selecting_date_time" && (
              <motion.div
                key="date_time_picker"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DateTimePicker
                  formData={formData} setFormData={setFormData} setAppState={setAppState}
                  selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                  daysList={daysList} availability={availability}
                  availabilityLoading={availabilityLoading} availabilityError={availabilityError}
                  platformStatus={settings.data?.platformStatus}
                  // --- START: เพิ่ม prop closedDays ตรงนี้ ---
                  closedDays={settings.data?.availability?.closedDays}
                  // --- END: เพิ่ม prop ---
                />
              </motion.div>
            )}

            {appState === "user_details" && (
              <motion.div
                key="user_details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <UserDetailsForm
                  formData={formData} setFormData={setFormData} onSubmit={handleCreateAppointment}
                  customer={customerData} isLoading={customerLoading} liffProfile={liffProfile}
                  isSubmitting={isCreating || isCreatingNewUser} isCreating={isCreating || isCreatingNewUser}
                  acceptDPO={acceptDPO} setAcceptDPO={setAcceptDPO}
                  showDPOContent={showDPOContent} setShowDPOContent={setShowDPOContent}
                  pressed={pressed} setPressed={setPressed}
                  branches={MY_BRANCHES} appointmentType={formData.appointmentType}
                  onGoBack={handleGoBackToDateTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <BottomNavbar liffProfile={liffProfile} />
        </div>
      </section>
    </div>
  );
}