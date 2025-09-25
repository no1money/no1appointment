"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";

// context ที่จะเอาไปใช้ทั้งไฟล์
const LiffContext = createContext({
  liffProfile: null,
  isLoggedIn: false,
  lineAccessToken: "",
  liff: null,
  actions: {
    closeWindow: () => {},
    openWindow: (_url, _external) => {},
    text: () => {},
  },
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;
const server = process.env.NEXT_PUBLIC_SERVER_OPTION;

// Liff Provider ครอบใช้่ทั้งตอน development และ production
export function LiffProvider({ children }) {
  const [liffProfile, setLiffProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lineAccessToken, setLineAccessToken] = useState("");
  const [liffReady, setLiffReady] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเป็น Browser liff ไหม
    const isInClient = liff.isInClient();
    const longProfile = {
      sub: "U006fb519ba07650932c6981af95d0620",
      name: "Long👁️‍🗨️",
      picture:
        "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
      email: "nakkasenputtacharoen@gmail.com",
    };

    const testProfile = {
      sub: "U669f6092308023f227aa435c803b2e74",
      name: "Zzz59🧚🏻♀️🌈",
      picture: "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };

    const lineAccessTokenDev = process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";

    // ฟังก์ชัน init รวม line function ที่ใช้
    const init = async () => {
      // DEV MODE
      if (server === "dev") {
        setIsLoggedIn(true);
        setLiffProfile(longProfile);
        setLiffReady(true);
        return;
      }

      // PRODUCTIONS MODE
      try {
        await liff.init({ liffId: liffenvId });


        if (!liff.isLoggedIn()) {
          liff.login();
          setIsLoggedIn(true);
        }
        setLiffReady(true);
        // ใช้โปรไฟล์จาก getDecodedIDToken แทน getProfile (ได้ email)
        const profile = liff.getDecodedIDToken();
        setLiffProfile(profile);
        const accessToken = liff.getAccessToken();
        setLineAccessToken(accessToken || "");
      } catch (error) {
        console.error("[LIFF init error]", error);
      }
    };

    // สั่งรัน init ตั้งแต่เริ้่ม
    init();
  }, []);

  const actions = {
    closeWindow: () => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] closeWindow noop in dev");
          return;
        }
        if (inClient()) {
          liff.closeWindow();
        } else {
          window.close();
        }
      } catch (e) {
        console.error("[LIFF closeWindow error]", e);
      }
    },
    openWindow: (url, external = false) => {
      try {
        if (server === "dev") {
          window.open(url, "_blank");
          return;
        }
        liff.openWindow({ url, external });
      } catch (e) {
        console.error("[LIFF openWindow error]", e);
      }
    },
    text: async (message) => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] text noop in dev:", message);
          return { status: "dev-noop" };
        }
        if (!inClient()) {
          console.warn("[LIFF] text() works only inside LINE client chat.");
          return { status: "unsupported" };
        }
        if (!message || typeof message !== "string") {
          return {
            status: "error",
            error: "message must be a non-empty string",
          };
        }
        await liff.sendMessages([{ type: "text", text: message }]);
        return { status: "sent" };
      } catch (e) {
        console.error("[LIFF text error]", e);
        return { status: "error", error: e?.message };
      }
    },
    
    shareTargetPicker: async (messages) => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] shareTargetPicker noop in dev:", messages);
          return { status: "dev-noop" };
        }
        if (!liff.isLoggedIn()) {
          liff.login();
          return { status: "login-required" };
        }
        if (!Array.isArray(messages) || messages.length === 0) {
          console.error("shareTargetPicker requires a non-empty array of messages.");
          return { status: "error", error: "Invalid message format" };
        }

        // เรียกใช้ฟังก์ชัน shareTargetPicker ของ LIFF SDK
        await liff.shareTargetPicker(messages);
        return { status: "shared" };

      } catch (e) {
        // LIFF จะ throw error เมื่อผู้ใช้กดยกเลิก ซึ่งไม่ใช่บั๊ก
        if (e.code === 'USER_CANCEL') {
            console.log("User cancelled the share target picker.");
            return { status: 'cancelled' };
        }
        console.error("[LIFF shareTargetPicker error]", e);
        return { status: "error", error: e?.message };
      }
    },
  };

  return (
    <LiffContext.Provider
      value={{
        liffProfile,
        isLoggedIn,
        lineAccessToken,
        liff: liffReady ? liff : null,
        actions,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
}

// export useLiff ไปใช้ได้ทั้งไฟล์
// const { liffProfile } = useLiff()
export const useLiff = () => useContext(LiffContext);
