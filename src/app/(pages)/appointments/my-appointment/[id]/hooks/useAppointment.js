import { useQuery } from "@tanstack/react-query";
import axios from "../../../../../../lib/axios";

// GET ดึงค่า appointment details ตาม appointmentId ตอนกดดูรายละเอียดในหน้าประวัติ จะเปิดหน้า [id]
export function useGetAppointmentDetails(appointmentId) {
  return useQuery({
    queryKey: ["appointmentDetails", appointmentId],
    queryFn: async () => {
      const { data } = await axios.get(`/v1/appointments/${appointmentId}`);
      return data;
    },
    enabled: !!appointmentId,
    staleTime: 15 * 60 * 1000,
  });
}
