"use client";

import { useState, useEffect } from "react";
import DPOConsent from "./DPOConsent";
import {
  Asterisk,
  Circle,
  CircleCheckBig,
  UploadCloud,
  Copy, // เพิ่ม Copy icon
} from "lucide-react";

/**
 * @param {object} props
 * @param {'online' | 'onsite' | 'offsite'} props.appointmentType - ประเภทการนัดหมาย
 * @param {Array<{id: string, name: string}>} props.branches - รายชื่อสาขา
 */
export default function UserDetailsForm({
  formData,
  setFormData,
  onSubmit,
  liffProfile,
  isSubmitting = false,
  customer,
  isLoading,
  isCreating,
  acceptDPO,
  setAcceptDPO,
  showDPOContent,
  setShowDPOContent,
  pressed,
  setPressed,
  onGoBack,
  appointmentType, // ประเภทการนัด
  branches = [
    { id: "ห้างเซ็นเตอร์วัน", name: "ห้างเซ็นเตอร์วัน" },
    { id: "กุดปลาดุก", name: "กุดปลาดุก" },
  ],
}) {
  const [isCopied, setIsCopied] = useState(false);

  // 1. อัปเดตเงื่อนไขการตรวจสอบความถูกต้องของฟอร์มตาม appointmentType
  const isValid =
    formData.customerName?.length > 0 &&
    formData.customerPhone?.length > 0 &&
    (appointmentType !== "onsite" || !!formData.branchId) && // ถ้าเป็น onsite ต้องเลือกสาขา
    (appointmentType !== "offsite" || !!formData.depositSlip); // ถ้าเป็น offsite ต้องแนบสลิป

  // Check for existing customer data in localStorage or from query
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerName: customer.fullname || "",
        customerPhone: customer.phone || "",
      }));
    }
  }, [customer, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Store the File object
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid && acceptDPO) {
      onSubmit && onSubmit();
    }
  };

  // When parent submission state changes to false, clear local pressed state
  useEffect(() => {
    if (!isSubmitting) setPressed(false);
  }, [isSubmitting]);

  // Function to copy account number
  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy.replace(/-/g, ""));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2500); // Reset message after 2.5 seconds
  };

  const bankAccountNumber = "209-3-12208-1";

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onGoBack}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">กรุณากรอกข้อมูลการจอง</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex grow flex-col gap-8">
        {/* FORM FIELDS */}
        <div className="flex flex-2 flex-col gap-4">
          {/* FULLNAME */}
          <div className="flex flex-col gap-2">
            <label className="flex w-full items-center justify-between text-sm font-medium text-slate-700">
              ชื่อ-นามสกุล <Asterisk size={12} className="text-red-500" />
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="กรอกชื่อ-นามสกุล"
              required
            />
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-2">
            <label className="flex w-full items-center justify-between text-sm font-medium text-slate-700">
              เบอร์โทรศัพท์ <Asterisk size={12} className="text-red-500" />
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="กรอกเบอร์โทรศัพท์"
              pattern="[0-9]{10}"
              required
            />
          </div>

          {/* BRANCH DROPDOWN - แสดงเมื่อ appointmentType เป็น 'onsite' เท่านั้น */}
          {appointmentType === "onsite" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="branchId"
                className="flex w-full items-center justify-between text-sm font-medium text-slate-700"
              >
                เลือกสาขา <Asterisk size={12} className="text-red-500" />
              </label>
              <select
                id="branchId"
                name="branchId"
                value={formData.branchId || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="" disabled>
                  กรุณาเลือกสาขา
                </option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* === DEPOSIT SLIP UPLOAD (IMPROVED) - แสดงเมื่อ appointmentType เป็น 'offsite' เท่านั้น === */}
          {appointmentType === "offsite" && (
            <div className="flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              {/* === START: HIGHLIGHTED 200 BAHT === */}
              <p className="text-center text-sm font-semibold text-slate-700">
                สำหรับบริการนอกสถานที่
                <br />
                กรุณาชำระค่ามัดจำ{" "}
                <span className="align-middle text-xl font-bold text-blue-600">
                  200 บาท
                </span>{" "}
                เพื่อยืนยันการนัดหมาย
              </p>
              {/* === END: HIGHLIGHTED 200 BAHT === */}

              {/* Bank Account Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    <img
                      alt="KBank"
                      width="48"
                      height="48"
                      className="rounded-full border border-gray-200 bg-white p-1"
                      src="https://lh3.googleusercontent.com/d/110s7ojR7IiTmR0uD7J6x9UIqMFxMp7YO"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        ธนาคารกสิกรไทย
                      </h3>
                      <p className="mt-1 text-base text-gray-800">
                        <span className="font-semibold">ชื่อบัญชี:</span>{" "}
                        นัมเบอร์วันมันนี่
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-row items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 p-2">
                    <span className="text-xl font-bold text-blue-600">
                      {bankAccountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankAccountNumber)}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-bold text-white transition-all ${
                        isCopied
                          ? "bg-green-500"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Copy size={12} />
                      {isCopied ? "คัดลอกแล้ว!" : "คัดลอก"}
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="depositSlip"
                  className="mt-2 flex w-full items-center justify-between text-sm font-medium text-slate-700"
                >
                  แนบสลิปค่ามัดจำ{" "}
                  <Asterisk size={12} className="text-red-500" />
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="depositSlip"
                    name="depositSlip"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    accept="image/*"
                    required
                  />
                  <div
                    className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 ${
                      formData.depositSlip
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-slate-300 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <UploadCloud size={20} />
                    <span className="truncate text-sm font-medium">
                      {formData.depositSlip
                        ? formData.depositSlip.name
                        : "คลิกเพื่ออัปโหลดสลิป"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-orange-600">
                * หมายเหตุ: จะได้รับเงินมัดจำคืนเต็มจำนวน
                <br />
                หลังเข้ารับบริการเรียบร้อยแล้ว
              </p>
            </div>
          )}

          {/* TEXT AREA FOR NOTE */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              ข้อมูลเพิ่มเติม (ถ้ามี)
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              value={formData.note || ""}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="กรุณาระบุรายละเอียดเพิ่มเติมเกี่ยวกับบริการที่ต้องการ (เช่น สภาพเครื่อง, อาการ, ความต้องการพิเศษ)"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DPO CHECKBOX & SUBMIT BUTTON */}
        <div className="mt-auto flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={acceptDPO}
              aria-label="ยอมรับเงื่อนไขการคุ้มครองข้อมูลส่วนบุคคล"
              onClick={() => {
                if (acceptDPO) {
                  setAcceptDPO(false);
                } else {
                  setShowDPOContent(true);
                }
              }}
              className={`inline-flex h-6 w-6 items-center justify-center ${
                acceptDPO ? "text-green-500" : "text-slate-400"
              }`}
            >
              {acceptDPO ? <CircleCheckBig /> : <Circle />}
            </button>

            <div className="text-sm text-slate-700">
              ฉันยอมรับ{" "}
              <button
                type="button"
                onClick={() => setShowDPOContent(true)}
                className="text-blue-500 underline hover:text-blue-600"
              >
                เงื่อนไขการคุ้มครองข้อมูลส่วนบุคคล
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={
              !isValid ||
              !acceptDPO ||
              isLoading ||
              isCreating ||
              isSubmitting ||
              pressed
            }
            aria-busy={isCreating || isSubmitting || pressed}
            className={`flex w-full transform items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition active:scale-95 ${
              isValid &&
              acceptDPO &&
              !isLoading &&
              !isCreating &&
              !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {isCreating || isSubmitting || pressed ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                <span>
                  {isCreating || isSubmitting
                    ? "กำลังดำเนินการ..."
                    : "กำลังส่ง..."}
                </span>
              </>
            ) : (
              "ดำเนินการต่อ"
            )}
          </button>
        </div>
      </form>

      {showDPOContent && (
        <DPOConsent
          onAccept={() => {
            setAcceptDPO(true);
            setShowDPOContent(false);
          }}
        />
      )}
    </div>
  );
}