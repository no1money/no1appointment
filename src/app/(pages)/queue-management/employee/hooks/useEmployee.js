import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// GET ใช้ดึง ข้อมูล Employee !!!ไม่ได้ใช้แล้ว!!!
export function useGetEmployeeAppointments(employeeId) {
  return useQuery({
    // ใช้ employeeId ใน queryKey เพื่อให้แน่ใจว่าถ้าเปลี่ยนคน ข้อมูลจะโหลดใหม่
    queryKey: ["employee-appointments", employeeId],
    queryFn: async () => {
      const { data } = await axios.get(`/v2/appointments/employee/${employeeId}`);
      if (!data) {
        throw new Error(data.message || "Failed to fetch employee appointments");
      }
      return data;
    },
    // จะรัน query ต่อเมื่อมีข้อมูล employee และมี roles
    enabled: !!employeeId,
  });
}

// GET เรียกดู appointment บนหน้าตาม filter tag และ status
export function useGetEmployeeAppointmentByTags(tags, status) {
  console.log(tags, status);

  return useQuery({
    queryKey: ["employeeAppointments", tags, status],
    queryFn: async () => {
      // พนักงานจาก DROPDOWN
      const payload = {};

      const params = {
        tags,
      };

      if (status && status !== "ALL") {
        params.status = status;
      }

      const { data } = await axios.get(
        "/v1/appointments/employee-appointments",
        {
          params: params,
        },
        payload,
      );

      if (!data) throw Error("Failed getting employee appointment");
      return data;
    },
  });
}

// GET เรัียกดู notification ตาม tags
export function useGetEmployeeNotificationsByTags(tags) {
  return useQuery({
    queryKey: ["employeeNotifications"],
    queryFn: async () => {
      const { data } = await axios.get("/v1/notifications", {
        params: {
          tags,
        },
      });
      console.log(data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
  });
}

// POST กด accept reject offer เวลา
export function useUpdateAppointmentAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, action, offerDate, auth }) => {
      const payload = {
        // แนบ auth ไปตรวจสอบว่าเป็นพนักงานคนไหนที่ oneMemberMiddleware
        auth,
        data: {
          action,
          offerDate,
        },
      };

      const { data } = await axios.patch(`/v1/appointments/${appointmentId}/action`, payload);

      if (!data) {
        throw new Error(data.message || "Failed to update appointment");
      }
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employeeAppointments"] });
    },
    onError: (error) => {
      console.error("Failed to update appointment:", error);
    },
  });
}
