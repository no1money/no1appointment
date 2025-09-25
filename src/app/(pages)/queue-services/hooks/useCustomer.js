import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

// GET ดึงข้อมูลูกค้า
export function useGetCustomer(lineUserId) {
  return useQuery({
    queryKey: ["customer", lineUserId],
    enabled: !!lineUserId, // don't fetch without an id
    retry: (failureCount, error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        // Don't retry for client-side errors
        if (status && status < 500) return false;
      }
      return failureCount < 2; // retry up to 2 times for 5xx/network
    },
    queryFn: async () => {
      if (!lineUserId) return null;
      try {
        const { data } = await axios.get(`/v1/customers/${encodeURIComponent(lineUserId)}`);
        if (data.message === "Customer not found or not registered") {
          return null;
        }
        return data;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}
