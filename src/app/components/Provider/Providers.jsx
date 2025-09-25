"use client";
// tanstack ตัว sync ข้อมูลกับ backend (สั่ง fetch ตัวไหนตอนไหนบ้าง)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LiffProvider } from "./LiffProvider";

// รวม Provider ที่ใช้
export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5 seconds
            cacheTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: "always",
          },
        },
      }),
  );

  return (
    // ครอบทั้ง QueryClient สำหรับ Tanstack และ LiffProvider
    <QueryClientProvider client={queryClient}>
      <LiffProvider>{children}</LiffProvider>
    </QueryClientProvider>
  );
}
