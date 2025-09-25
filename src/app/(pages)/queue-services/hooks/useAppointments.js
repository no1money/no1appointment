import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// HOOK สำหรับ APPOINTMENT ใช้บนหน้า queue-services

// GET ดึง appointment
export function useGetAppointments(params = {}) {
  const { startAt, endAt, query, lineUserId } = params;

  return useQuery({
    queryKey: ["appointments", startAt, endAt, query, lineUserId],
    queryFn: async () => {
      const { data } = await axios.get("/v1/appointments", {
        params: {
          startAt,
          endAt,
          query,
          lineUserId,
        },
      });

      if (!data) {
        const errText = await response.text();
        console.error("useGetAppointments fetch failed:", response.status, errText);
        throw new Error("Failed to fetch appointments");
      }
      return data;
    },
  });
}

// GET ดึงคิวว่างตามวันที่ที่เลือก
export function useGetAvailability(date) {
  return useQuery({
    queryKey: ["availability", date?.toISOString().split("T")[0]],
    queryFn: async () => {
      const { data } = await axios.get(`/v1/appointments/availability?date=${date.toISOString()}`);
      return data;
    },
    enabled: !!date, // รัน query ต่อเมื่อมี `date` เท่านั้น
  });
}

// GET คิวปัจจุบันของเรา แสดงบนหน้าตอนเลือก Service (คิวล่าสุด)
export function useGetDisplayAppointment(id) {
  return useQuery({
    queryKey: ["display-appointment", id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/v1/appointments/display/${id}`);
        if (!data) {
          throw new Error({ status: response.status, statusText: response.statusText });
        }
        return data;
      } catch (error) {
        if (error.status === 404) {
          return null;
        } else {
          throw error;
        }
      }
    },
    enabled: !!id,
  });
}

// GET ดึง notificationลูกค้า
export function useGetCustomerNotification(line_user_id) {
  return useQuery({
    queryKey: ["notification", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get(`/v1/notifications/customer/${line_user_id}`);
      return data;
    },
    staleTime: 60 * 1000,
    enabled: !!line_user_id,
    refetchInterval: 30 * 1000 * 3,
  });
}

// POST สร้าง Appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointment, customerId }) => {
      const { data } = await axios.post(`v1/appointments/${customerId}`, appointment);
      return data;
    },
    onError: (error) => {
      console.error("Failed to create appointment:", error);
      throw new Error(error.response?.data?.error || "Failed to create appointment");
    },
    onSuccess: () => {
      // สั่งรีข้อมูลตามข้อมูลที่เคย query ไว้ KEY ต้องตรงกับ queryKey
      // รีข้อมูลตาม key
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}

// POST สร้้าง Cusutomer + Appointment (user ที่ไม่เคยสมัครสมาชิก)
export function useCreateNewUserAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ customer, appointment }) => {
      const { data } = await axios.post(`/v1/appointments/new-customer`, { customer, appointment });
      if (!data) throw new Error("Failed to create appointment");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
}
