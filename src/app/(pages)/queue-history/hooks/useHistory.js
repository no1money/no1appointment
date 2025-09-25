import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// GET ดึง appointment มาทั้งหมดไปแสดงในหน้า queue-hostory
export function useGetHistoryAppointments(line_user_id) {
  return useQuery({
    queryKey: ["history-appointments", line_user_id],
    queryFn: async () => {
      const { data } = await axios.get(`v1/appointments/my-appointments/${line_user_id}`);
      return data;
    },
    enabled: !!line_user_id,
  });
}
