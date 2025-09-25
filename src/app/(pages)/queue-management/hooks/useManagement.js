import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

// ดึงข้อมูลไปแสดงบน Dashboard route v2
export const useGetDashboardAppointment = () => {
  return useQuery({
    queryKey: ["dashboardAppointments"],
    queryFn: async () => {
      const { data } = await axios.get("/v2/appointments/dashboard");
      return data;
    },
    // ภายในระยะเวลานี้ไม่ต้อง fetch ข้อมูลเลย
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
