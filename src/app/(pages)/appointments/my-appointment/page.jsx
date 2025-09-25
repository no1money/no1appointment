"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Phone,
  Wrench,
  X,
  CalendarPlus,
  History,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  User,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Upload,
  CreditCard,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Ticket, // เพิ่ม Ticket icon ที่นี่
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import jsQR from "jsqr";
import {
  useCancelAppointment,
  useAcceptOffer,
  useRejectOffer,
  useGetCustomerAppointmentDetails,
  useSubmitPaymentSlip,
} from "./hooks/useAppointment";
import { useLiff } from "@/app/components/Provider/LiffProvider";
import BottomNavbar from "../../queue-services/components/BottomNavbar";

const statusThai = (status) => {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "CONFIRMED":
      return "ยืนยันแล้ว";
    case "COMPLETED":
      return "เสร็จสิ้น";
    case "CANCELLED":
      return "ยกเลิก";
    case "NO_SHOW":
      return "ไม่มา";
    case "OFFERED":
      return "เสนอเวลาใหม่";
    case "ACCEPTED_BY_EMPLOYEE":
      return "พนักงานรับเรื่องแล้ว";
    case "REJECTED_BY_EMPLOYEE":
      return "ปฏิเสธโดยพนักงาน";
    // New Payment Statuses
    case "WAITING_FOR_PAYMENT":
      return "รอชำระเงินมัดจำ";
    case "PAYMENT_RECEIVED":
      return "กำลังตรวจสอบการชำระเงิน";
    case "PAYMENT_CONFIRMED":
      return "ชำระเงินแล้ว";
    case "PAYMENT_INVALID":
      return "การชำระเงินไม่ถูกต้อง";
    default:
      return status || "-";
  }
};

const statusConfig = (status) => {
  switch (status) {
    case "CONFIRMED":
      return {
        gradient: "from-emerald-500 to-teal-600",
        icon: CheckCircle,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
      };
    case "COMPLETED":
      return {
        gradient: "from-slate-500 to-slate-600",
        icon: CheckCircle,
        bgColor: "bg-slate-50",
        textColor: "text-slate-700",
        borderColor: "border-slate-200",
      };
    case "CANCELLED":
      return {
        gradient: "from-rose-500 to-red-600",
        icon: XCircle,
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        borderColor: "border-rose-200",
      };
    case "OFFERED":
      return {
        gradient: "from-violet-500 to-purple-600",
        icon: Sparkles,
        bgColor: "bg-violet-50",
        textColor: "text-violet-700",
        borderColor: "border-violet-200",
      };
    case "ACCEPTED_BY_EMPLOYEE":
      return {
        gradient: "from-blue-500 to-indigo-600",
        icon: User,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      };
    case "REJECTED_BY_EMPLOYEE":
      return {
        gradient: "from-orange-500 to-red-500",
        icon: AlertCircle,
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
      };
    // New Payment Statuses Config
    case "WAITING_FOR_PAYMENT":
      return {
        gradient: "from-amber-500 to-orange-500",
        icon: CreditCard,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    case "PAYMENT_RECEIVED":
      return {
        gradient: "from-cyan-500 to-blue-500",
        icon: Loader2,
        bgColor: "bg-cyan-50",
        textColor: "text-cyan-700",
        borderColor: "border-cyan-200",
      };
    case "PAYMENT_CONFIRMED":
      return {
        gradient: "from-lime-500 to-green-500",
        icon: ShieldCheck,
        bgColor: "bg-lime-50",
        textColor: "text-lime-700",
        borderColor: "border-lime-200",
      };
    case "PAYMENT_INVALID":
      return {
        gradient: "from-red-500 to-rose-500",
        icon: ShieldAlert,
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      };
    default:
      return {
        gradient: "from-blue-500 to-cyan-500",
        icon: Clock,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
      };
  }
};
// ฟังก์ชันนี้ไม่ต้องแก้ไข
const formatTime = (hourNumberLike) => `${hourNumberLike}:00 น.`;

// แก้ไขฟังก์ชันนี้
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // <--- เพิ่มบรรทัดนี้
  });

// แก้ไขฟังก์ชันนี้
function getOfferedInfo(appt) {
  if (!appt || !appt.offerDate) return { hasOffer: false };
  return {
    hasOffer: true,
    dateText: formatDate(appt.offerDate),
    timeText:
      new Date(appt.offerDate).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // <--- เพิ่มบรรทัดนี้ด้วย
      }) + " น.",
  };
}
export default function MyAppointmentPage() {
  const { liffProfile, actions, liff } = useLiff();
  const {
    data: myAppointment,
    isLoading,
    error,
    refetch,
  } = useGetCustomerAppointmentDetails(liffProfile?.sub);

  const [sharing, setSharing] = useState(false);
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptOffer();
  const { mutate: rejectOffer, isPending: isRejecting } = useRejectOffer();
  const { mutate: submitSlip, isPending: isSubmittingSlip } = useSubmitPaymentSlip();

  const [paymentSlipFile, setPaymentSlipFile] = useState(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);

  // Backwards-compatible alias for code that still references `paymentSlip`
  const paymentSlip = paymentSlipFile
    ? { file: paymentSlipFile, preview: paymentSlipPreview, hasQR: null }
    : null;

  const loadingVariants = [
    { petals: 6, radius: 38, from: "from-pink-500", to: "to-rose-400" },
    { petals: 8, radius: 42, from: "from-indigo-500", to: "to-sky-400" },
    { petals: 10, radius: 46, from: "from-emerald-500", to: "to-lime-400" },
    { petals: 12, radius: 50, from: "from-violet-500", to: "to-fuchsia-400" },
  ];

  const loadingMessages = [
    "กำลังดึงข้อมูลการจองของคุณ…",
    "กำลังจัดคิวให้เหมาะสมที่สุด…",
    "กำลังประมวลผลข้อมูลล่าสุด…",
  ];
  const [variantIndex, setVariantIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => {
      setVariantIndex((v) => (v + 1) % loadingVariants.length);
      setMessageIndex((m) => (m + 1) % loadingMessages.length);
    }, 1400);
    return () => clearInterval(id);
  }, [isLoading]);

  const parseService = (note) => {
    if (!note) return "-";
    const marker = "Service:";
    return note.includes(marker) ? note.split(marker)[1].trim() : note;
  };

  const getOffsiteLocationText = (note) => {
    // 1. ถ้าไม่มี note เลย ให้แสดงค่าเริ่มต้น
    if (!note) {
      return "นัดหมายนอกสถานที่";
    }

    // 2. กำหนด keyword ที่จะใช้ตัดคำ
    const keyword = "สถานที่นัดหมาย: ";
    const parts = note.split(keyword);

    // 3. ถ้าตัดคำได้ (มี keyword อยู่ใน note)
    if (parts.length > 1) {
      // ให้คืนค่าส่วนที่อยู่หลัง keyword และตัดช่องว่างออก
      const location = parts[1].trim();
      return location || "นัดหมายนอกสถานที่"; // ป้องกันกรณีหลัง keyword เป็นค่าว่าง
    }

    // 4. ถ้าไม่มี keyword ใน note ให้แสดง note ทั้งหมด
    return note;
  };
  const handleSlipSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return Swal.fire("ไฟล์ไม่ถูกต้อง", "กรุณาเลือกไฟล์รูปภาพเท่านั้น", "error");
    if (file.size > 5 * 1024 * 1024)
      return Swal.fire("ไฟล์ใหญ่เกินไป", "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB", "error");

    setPaymentSlipFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPaymentSlipPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitSlip = async () => {
    if (!paymentSlipFile || !myAppointment) return;

    console.log("Uploading file:", paymentSlipFile.name);
    // Replace this with your actual upload function call
    // const uploadResponse = await yourFileUploadService(paymentSlipFile);
    // const slipUrl = uploadResponse.url;
    const slipUrl = `https://your-storage-service.com/slips/${myAppointment.id}_${Date.now()}.jpg`; // Simulated URL

    submitSlip({ appointmentId: myAppointment.id, slipUrl });
  };

  const handleShareQueue = async () => {
    if (!actions || !myAppointment) return;

    setSharing(true);

    try {
      // --- ขั้นตอนที่ 1: เตรียมข้อมูลทั้งหมดให้เป็นค่า String ที่พร้อมใช้ ---
      const serviceName = String(myAppointment.serviceType || "ไม่มีข้อมูลบริการ");
      const appointmentDate = String(myAppointment.date ? formatDate(myAppointment.date) : "-");
      const appointmentTime = String(myAppointment.section ? formatTime(myAppointment.section) : "-");
      const appointmentStatus = String(myAppointment.status ? statusThai(myAppointment.status) : "-");
      const branchName = String(myAppointment.branchId || "สาขาหลัก");

      const altText = `รายละเอียดการจอง: ${serviceName} วันที่ ${appointmentDate}`;

      // --- ขั้นตอนที่ 2: สร้าง Flex Message ที่ไม่มีการตกแต่งแบบไดนามิกใดๆ ทั้งสิ้น ---
      const flexMessage = {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "รายละเอียดการจองคิว",
              weight: "bold",
              color: "#FFFFFF",
              size: "lg",
            },
          ],
          backgroundColor: "#4B0082",
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "บริการ:",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: serviceName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  weight: "bold",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "สาขา:",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: branchName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  weight: "bold",
                  flex: 5,
                },
              ],
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "lg",
              contents: [
                {
                  type: "text",
                  text: "วันที่:",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: appointmentDate,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "เวลา:",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: appointmentTime,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "สถานะ:",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: appointmentStatus,
                  color: "#666666",
                  size: "sm",
                  weight: "bold",
                  flex: 5,
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#905cff",
              height: "sm",
              action: {
                type: "uri",
                label: "ดูรายละเอียด/จัดการคิว",
                uri: `${window.location.origin}/appointments/my-appointment`,
              },
            },
          ],
        },
      };

      const messagesToSend = [
        {
          type: "flex",
          altText: altText,
          contents: flexMessage,
        },
      ];

      if (actions.shareTargetPicker) {
        await actions.shareTargetPicker(messagesToSend);
      } else {
        console.error("shareTargetPicker function not found in liff actions");
        alert("ไม่สามารถแชร์ได้ ฟังก์ชันไม่พร้อมใช้งาน");
      }
    } catch (e) {
      console.error("shareTargetPicker error", e);
      alert("เกิดข้อผิดพลาดในการแชร์");
    } finally {
      setSharing(false);
    }
  };

  const handleShareLocation = () => {
    // ตรวจสอบว่ามี liff object และข้อมูลการจองหรือไม่
    // สันนิษฐานว่า liff object ถูกส่งมาจาก useLiff() hook ของคุณ
    if (!liff || !myAppointment) {
      console.error("LIFF SDK or appointment data is not available.");
      alert("ไม่สามารถเปิดตำแหน่งได้ในขณะนี้");
      return;
    }

    setSharing(true); // ใช้ state เดิมเพื่อ disable ปุ่มชั่วคราว

    try {
      let locationUrl;
      const branchId = myAppointment.branchId;

      // ตรรกะการเลือกลิงก์ยังคงเหมือนเดิม
      if (branchId === "ห้างเซ็นเตอร์วัน") {
        locationUrl = "https://maps.app.goo.gl/TF8GBHKRJ7erxH3KA";
      } else if (branchId === "กุดปลาดุก") {
        locationUrl = "https://maps.app.goo.gl/sPWfgvW4GM2eEqYa7";
      } else {
        // กรณีที่ไม่เข้าเงื่อนไขใดๆ ให้ใช้ลิงก์ของเซ็นเตอร์วันเป็นค่าเริ่มต้น
        locationUrl = "https://maps.app.goo.gl/TF8GBHKRJ7erxH3KA";
      }

      // --- จุดที่เปลี่ยนแปลง ---
      // เรียกใช้ liff.openWindow เพื่อเปิดลิงก์ในเบราว์เซอร์ภายนอก
      liff.openWindow({
        url: locationUrl,
        external: true, // ค่านี้สำคัญมาก! เพื่อให้เปิดใน Chrome/Safari แทนที่จะเปิดใน LINE
      });
    } catch (e) {
      console.error("openWindow error", e);
      alert("เกิดข้อผิดพลาดในการเปิดแผนที่");
    } finally {
      // หน่วงเวลาเล็กน้อยก่อน re-enable ปุ่ม เพื่อให้ผู้ใช้รู้สึกว่ามีการตอบสนอง
      setTimeout(() => setSharing(false), 300);
    }
  };

  const handleCancel = async () => {
    if (!myAppointment) return;
    const result = await Swal.fire({
      title: "ยืนยันการยกเลิกการจอง?",
      html: `คุณต้องการยกเลิกการจอง<br/><strong>${parseService(
        myAppointment.note,
      )}</strong><br/>วันที่ ${formatDate(myAppointment.date)} เวลา ${formatTime(
        myAppointment.section,
      )}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      cancelAppointment(myAppointment.id, {
        onSuccess: () => {
          // After successful cancellation, refetch the appointment data.
          // This will update the UI to show the "no appointment" screen.
          refetch();
        },
      });
    }
  };

  const handleAcceptOffer = async () => {
    if (!myAppointment) return;
    const offered = getOfferedInfo(myAppointment);
    const confirm = await Swal.fire({
      title: "ยืนยันรับเวลาใหม่?",
      html: offered.hasOffer
        ? `วันที่: <b>${offered.dateText}</b><br/>เวลา: <b>${offered.timeText}</b>`
        : "ยืนยันรับเวลาใหม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "รับเวลาใหม่",
      cancelButtonText: "ยกเลิก",
    });
    if (confirm.isConfirmed) {
      acceptOffer(myAppointment.id);
    }
  };

  const handleRejectOffer = async () => {
    if (!myAppointment) return;
    const { value: reason } = await Swal.fire({
      title: "ปฏิเสธเวลาใหม่?",
      input: "text",
      inputPlaceholder: "ระบุเหตุผล (ถ้ามี)",
      showCancelButton: true,
      confirmButtonText: "ปฏิเสธ",
      cancelButtonText: "ยกเลิก",
    });
    if (reason !== undefined) {
      rejectOffer({
        appointmentId: myAppointment.id,
        reason: reason || "",
      });
    }
  };

  if (isLoading) {
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
                    style={{
                      transform: `rotate(${(360 / v.petals) * i}deg) translateY(-${v.radius}px)`,
                    }}
                  />
                ))}
                <span className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg ring-4 ring-white/50" />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-lg font-bold text-slate-800">กำลังจัดเตรียมข้อมูลคิว</div>
            <div className="mt-2 text-sm text-slate-500">{loadingMessages[messageIndex]}</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-6 py-24">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg">
            <AlertCircle size={32} />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-900">เกิดข้อผิดพลาด</h1>
          <p className="mb-6 text-slate-600">{error.message}</p>
          <button
            onClick={refetch}
            className="rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-rose-700"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </main>
    );
  }

  if (!myAppointment || myAppointment.status === "CANCELLED") {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 py-24 font-sans text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md text-center"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
            <CalendarPlus size={36} />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-slate-900">ยังไม่มีการจอง</h1>
          <p className="mb-8 text-slate-600">คุณยังไม่มีคิวที่กำลังจะถึง เริ่มจองคิวใหม่ได้เลย</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/queue-services"
              className="inline-flex transform items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
              <CalendarPlus size={20} /> จองคิวใหม่
            </Link>
            <Link
              href="/queue-history"
              className="inline-flex transform items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <History size={20} /> ดูประวัติการจอง
            </Link>
          </div>
        </motion.div>
        <BottomNavbar />
      </main>
    );
  }

  const serviceText = parseService(myAppointment.note);
  const translatedStatus = statusThai(myAppointment.status);
  const statusInfo = statusConfig(myAppointment.status);
  const StatusIcon = statusInfo.icon;
  const offered = getOfferedInfo(myAppointment);
  const hasOffer = myAppointment.status === "OFFERED";
  const isOffsiteAppointment = myAppointment.type === "OFFSITE";
  const showPaymentSection =
    isOffsiteAppointment &&
    ["WAITING_FOR_PAYMENT", "PAYMENT_RECEIVED", "PAYMENT_CONFIRMED", "PAYMENT_INVALID"].includes(
      myAppointment.status,
    );

  // --- START: เพิ่มเงื่อนไขการแสดงหมายเลขคิว ---
  const showQueueNumber = myAppointment.status === "CONFIRMED" && myAppointment.q_no;
  // --- END: เพิ่มเงื่อนไขการแสดงหมายเลขคิว ---

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-32">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            href="/queue-services"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md"
          >
            <ChevronLeft size={18} /> กลับ
          </Link>
          <div className="rounded-lg bg-white/60 px-3 py-1.5 text-xs text-slate-500 backdrop-blur-sm">
            อัปเดตล่าสุด: {new Date(myAppointment.updatedAt).toLocaleString("th-TH")}
          </div>
        </motion.header>

        <motion.div className="space-y-6">
          {/* --- START: เงื่อนไขการแสดงผล --- */}
          {showQueueNumber ? (
            <QueueNumberDisplay queueNumber={myAppointment.q_no} />
          ) : (
            <div
              className={`relative overflow-hidden rounded-2xl ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 p-[20px] shadow-lg`}
            >
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/20"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${statusInfo.gradient} text-white shadow-lg`}
                  >
                    <StatusIcon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600">สถานะปัจจุบัน</div>
                    <div className={`text-md font-bold ${statusInfo.textColor} whitespace-nowrap`}>
                      {translatedStatus}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-600">สถานที่</div>
                  <div className={`font-semibold ${statusInfo.textColor}`}>
                    {myAppointment.type === "ONSITE"
                      ? `${myAppointment.branchId}`
                      : myAppointment.type === "ONLINE"
                      ? "ออนไลน์"
                      : myAppointment.type === "OFFSITE"
                      ? getOffsiteLocationText(myAppointment.note)
                      : myAppointment.type}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* --- END: เงื่อนไขการแสดงผล --- */}

          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium opacity-90">บริการที่จอง</div>
                    <div className="text-lg font-bold">{myAppointment.serviceType}</div>
                  </div>
                </div>
              </div>
              {myAppointment.note && myAppointment.note !== `Service: ${serviceText}` && (
                <div className="p-4">
                  <div className="mb-2 text-sm font-medium text-slate-600">รายละเอียดเพิ่มเติม</div>
                  <div className="text-slate-700">{myAppointment.note}</div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                <div className="h-full bg-gradient-to-br from-cyan-500 to-blue-600 p-4 text-white">
                  <div className="flex h-full items-center gap-3">
                    <Calendar size={24} />
                    <div>
                      <div className="text-sm font-medium">วันที่นัดหมาย</div>
                      <div className="text-lg font-bold">{formatDate(myAppointment.date)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-max overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                <div className="h-full bg-gradient-to-br from-rose-500 to-orange-500 p-4 text-white">
                  <div className="flex h-full items-center gap-3">
                    <Clock size={24} />
                    <div>
                      <div className="text-sm font-medium">เวลานัดหมาย</div>
                      <div className="text-lg font-bold">{formatTime(myAppointment.section)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={handleShareQueue}
                disabled={sharing}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <Share2 size={18} className="text-blue-600" />
                  <span className="font-medium text-slate-700">แชร์คิว</span>
                </div>
              </button>
              <button
                onClick={handleShareLocation}
                disabled={sharing}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={18} className="text-green-600" />
                  <span className="font-medium text-slate-700">ที่อยู่ร้าน</span>
                </div>
              </button>
              <a
                href={`tel:0627766774`}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone size={18} className="text-orange-600" />
                  <span className="font-medium text-slate-700">ติดต่อ</span>
                </div>
              </a>
            </div>

            {myAppointment.status === "PENDING" && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex w-full transform items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 p-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50"
              >
                {isCancelling ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    กำลังยกเลิก...
                  </div>
                ) : (
                  <>
                    <X size={20} />
                    ยกเลิกการจอง
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showPaymentSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="mt-6 overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900">ค่ามัดจำบริการนอกสถานที่</div>
                    <div className="text-sm text-amber-700">
                      จำนวน 200 บาท (จะได้รับคืนหลังเสร็จสิ้นบริการ)
                    </div>
                  </div>
                </div>

                {(myAppointment.status === "WAITING_FOR_PAYMENT" ||
                  myAppointment.status === "PAYMENT_INVALID") && (
                  <div>
                    {myAppointment.status === "PAYMENT_INVALID" && (
                      <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm font-semibold text-red-800">
                        การชำระเงินครั้งก่อนไม่ถูกต้อง กรุณาแนบสลิปอีกครั้ง
                      </div>
                    )}
                    <PaymentUploadUI
                      onSlipSelect={handleSlipSelect}
                      onSubmit={handleSubmitSlip}
                      slipPreview={paymentSlipPreview}
                      isSubmitting={isSubmittingSlip}
                      onClearSlip={() => {
                        setPaymentSlipFile(null);
                        setPaymentSlipPreview(null);
                      }}
                    />
                  </div>
                )}

                {myAppointment.status === "PAYMENT_RECEIVED" && (
                  <div className="rounded-lg bg-cyan-100 p-4 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-700" />
                    <p className="mt-2 font-semibold text-cyan-800">เราได้รับสลิปของคุณแล้ว</p>
                    <p className="text-sm text-cyan-700">กำลังรอเจ้าหน้าที่ตรวจสอบและยืนยัน</p>
                  </div>
                )}

                {myAppointment.status === "PAYMENT_CONFIRMED" && (
                  <div className="rounded-lg bg-green-100 p-4 text-center">
                    <ShieldCheck className="mx-auto h-8 w-8 text-green-700" />
                    <p className="mt-2 font-semibold text-green-800">ชำระเงินมัดจำเรียบร้อย</p>
                    <p className="text-sm text-green-700">พนักงานจะยืนยันนัดหมายในขั้นตอนสุดท้าย</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasOffer && offered.hasOffer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-violet-900">เวลาใหม่ที่เสนอให้</div>
                    <div className="text-sm text-violet-700">กรุณาตัดสินใจภายในเวลาที่กำหนด</div>
                  </div>
                </div>

                <div className="mb-6 flex gap-4">
                  <div className="flex-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-violet-100">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-violet-600" />
                      <div>
                        <div className="text-xs font-medium text-violet-600">วันที่เสนอ</div>
                        <div className="font-bold text-slate-800">{offered.dateText}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-violet-100">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-violet-600" />
                      <div>
                        <div className="text-xs font-medium text-violet-600">เวลาเสนอ</div>
                        <div className="font-bold text-slate-800">{offered.timeText}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-violet-100 p-3">
                  <div className="text-xs text-violet-800">
                    💡 <strong>หมายเหตุ:</strong> โปรดตอบรับหรือปฏิเสธเพื่อยืนยันนัดหมาย
                    ระบบจะสำรองคิวไว้ช่วงสั้น ๆ เท่านั้น
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRejectOffer}
                    disabled={isRejecting || isAccepting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 py-3 font-semibold text-rose-600 shadow-sm transition-all duration-200 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-400 border-t-transparent"></div>
                        กำลังส่ง...
                      </div>
                    ) : (
                      <>
                        <XCircle size={18} /> ปฏิเสธ
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAcceptOffer}
                    disabled={isAccepting || isRejecting}
                    className="inline-flex flex-1 transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50"
                  >
                    {isAccepting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        กำลังยืนยัน...
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> รับเวลาใหม่
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <BottomNavbar />
    </main>
  );
}

// --- START: คอมโพเนนต์ใหม่สำหรับแสดงหมายเลขคิว ---
function QueueNumberDisplay({ queueNumber }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-white shadow-2xl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
        <Ticket size={32} />
      </div>
      <div className="text-center">
        <div className="text-lg font-medium opacity-90">หมายเลขคิวของคุณ</div>
        <div className="text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {queueNumber}
        </div>
        <div className="mt-2 text-sm font-light text-blue-100">
          กรุณาแสดงหน้านี้แก่พนักงานเมื่อถึงคิว
        </div>
      </div>
    </motion.div>
  );
}
// --- END: คอมโพเนนต์ใหม่สำหรับแสดงหมายเลขคิว ---

function PaymentUploadUI({ onSlipSelect, onSubmit, slipPreview, isSubmitting, onClearSlip }) {
  return (
    <div>
      {!slipPreview ? (
        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-white p-6 text-center transition-colors hover:bg-amber-50">
          <Upload size={24} className="text-amber-600" />
          <span className="mt-2 font-medium text-amber-800">อัปโหลดสลิป</span>
          <span className="mt-1 text-xs text-amber-600">ไฟล์รูปภาพ (ไม่เกิน 5MB)</span>
          <input
            type="file"
            accept="image/*"
            onChange={onSlipSelect}
            className="hidden"
            disabled={isSubmitting}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
            <img src={slipPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1 font-medium text-slate-800">สลิปที่เลือก</div>
            <button
              onClick={onClearSlip}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              "ยืนยันการชำระเงิน"
            )}
          </button>
        </div>
      )}
    </div>
  );
}