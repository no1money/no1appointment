import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../../../lib/axios";
import Swal from "sweetalert2";

// GET ใช้ดึงข้อมูลการนัดหมายของลูกค้าจาก line_user_id
export function useGetCustomerAppointmentDetails(line_user_id) {
  return useQuery({
    queryKey: ["my-appointments", line_user_id],
    queryFn: async () => {
      if (!line_user_id) return [];
      const { data } = await axios.get(`v1/appointments/my-appointment/${line_user_id}`);
      console.log("data", data);
      return data;
    },
    enabled: !!line_user_id, // Only run query if lineUserId is provided
  });
}

// POST ใช้สำหรับยกเลิกการนัดหมายโดยลูกค้า
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId) => {
      const { data } = await axios.post(`/v1/appointments/cancel/${appointmentId}`);
      return data;
    },
    onSuccess: (data, appointmentId) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["customer-appointment"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "ยกเลิกเรียบร้อย",
        timer: 1200,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("cancel error", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถยกเลิกได้",
      });
    },
  });
}

// PATCH ใช้สำหรับลูกค้ายืนยันเวลานัดหมายที่พนักงานเสนอ
export function useAcceptOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId) => {
      const { data } = await axios.patch(`/v1/appointments/offer/${appointmentId}/accept`);
      return data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["customer-appointment"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "ยืนยันสำเร็จ",
        timer: 1100,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("accept-offer error", error);
      Swal.fire({
        icon: "error",
        title: "ยืนยันไม่สำเร็จ",
        text: "โปรดลองใหม่อีกครั้ง",
      });
    },
  });
}

// PATCH ใช้สำหรับลูกค้าปฏิเสธเวลานัดหมายที่พนักงานเสนอ
export function useRejectOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, reason }) => {
      const response = await axios.patch(`/v1/appointments/offer/${appointmentId}/reject`, {
        reason: reason || "",
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["customer-appointment"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "ส่งคำตอบแล้ว",
        timer: 1100,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("reject-offer error", error);
      Swal.fire({
        icon: "error",
        title: "ปฏิเสธไม่สำเร็จ",
        text: "โปรดลองใหม่อีกครั้ง",
      });
    },
  });
}

// PATCH ใช้สำหรับส่ง URL ของสลิปการชำระเงินสำหรับค่ามัดจำ
export function useSubmitPaymentSlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, slipUrl }) => {
      // This function sends the slip URL to your backend
      const { data } = await axios.patch(`/v1/appointments/${appointmentId}/payment`, { slipUrl });
      return data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: "ส่งสลิปสำเร็จ!",
        text: "สลิปของคุณถูกส่งแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบโดยเร็วที่สุด",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });
      // This is crucial: it tells react-query to refetch the appointment details,
      // which will update the status on the page automatically.
      queryClient.invalidateQueries({ queryKey: ["customerAppointmentDetails"] });
    },
    onError: (error) => {
      console.error("Submit slip error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถส่งสลิปได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
      });
    },
  });
}
