# Queue Service - ระบบจัดการคิว

โปรเจกต์นี้เป็นระบบสำหรับจัดการและจองคิวบริการต่างๆ สร้างขึ้นด้วย Next.js และใช้
Prisma เป็น ORM สำหรับจัดการฐานข้อมูล

## 🚀 โครงสร้างโปรเจกต์

โครงสร้างหลักของโปรเจกต์มีดังนี้:

- `/src/app/(pages)`: โฟลเดอร์สำหรับหน้าเว็บต่างๆ ของลูกค้า (เช่น การจอง,
  โปรไฟล์) และพนักงาน (เช่น การจัดการคิว)
  - `/api`: Endpoints สำหรับการทำงานฝั่ง Server-side เช่น การเชื่อมต่อฐานข้อมูล,
    Business Logic
  - `/components`: React Components ที่ใช้ซ้ำได้ในส่วนต่างๆ ของแอปพลิเคชัน
  - `/hooks`: Custom React Hooks สำหรับจัดการ State และ Logic ที่ซับซ้อน
  - `/lib`: Utility functions และการตั้งค่า Library ต่างๆ เช่น `axios`, `prisma`
- `/prisma`: โฟลเดอร์สำหรับ Schema ของฐานข้อมูล (`schema.prisma`)
- `/.env.local`: ไฟล์สำหรับเก็บ Environment Variables (ต้องสร้างเอง)

## ⚙️ การตั้งค่า Environment Variables

ก่อนรันโปรเจกต์, ให้สร้างไฟล์ `.env` ที่ Root Directory
และเพิ่มค่าตัวแปรต่อไปนี้:

1.  **`NEXT_PUBLIC_LIFF_ID`**: LIFF ID สำหรับการเชื่อมต่อกับ LINE Front-end
    Framework

    ```
    NEXT_PUBLIC_LIFF_ID="2007338329-2eLk1oe8"
    ```

2.  **`NEXT_PUBLIC_SERVER_OPTION`**:
    ตัวเลือกสำหรับกำหนดว่าจะให้แอปพลิเคชันเชื่อมต่อกับ API Server ใด
    - `dev`: สำหรับเชื่อมต่อกับ Development Server
    - `main`: สำหรับเชื่อมต่อกับ Production Server

    ```
    NEXT_PUBLIC_SERVER_OPTION="dev"
    ```

3.  **`NEXT_PUBLIC_API_URL`**: URL ของ Production API Server

    ```
    NEXT_PUBLIC_API_URL="https://test-queue-backend-seven.vercel.app/api/v1"
    ```

4.  **`NEXT_PUBLIC_DEV_API_URL`**: URL ของ Development API Server

    ```
    NEXT_PUBLIC_DEV_API_URL="http://localhost:3000/api"
    ```

5.  **`NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID`**: ID ของเพลย์ลิสต์ YouTube
    ที่ต้องการแสดง

    ```
    NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID="PLDNgijyvvLnxA2nK6xPd5tQRCmQTPNwUn"
    ```

6.  **`NEXT_PUBLIC_YOUTUBE_FIRST_VIDEO_ID`**: ID ของวิดีโอแรกในเพลย์ลิสต์
    ```
    NEXT_PUBLIC_YOUTUBE_FIRST_VIDEO_ID="VZLyTleMl0LjnpN9"
    ```

**ตัวอย่างไฟล์ `.env.local`:**

```
NEXT_PUBLIC_LIFF_ID="2007338329-2eLk1oe8"
NEXT_PUBLIC_SERVER_OPTION="dev"
NEXT_PUBLIC_API_URL="https://test-queue-backend-seven.vercel.app/api/v1"
NEXT_PUBLIC_DEV_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID="PLDNgijyvvLnxA2nK6xPd5tQRCmQTPNwUn"
NEXT_PUBLIC_YOUTUBE_FIRST_VIDEO_ID="VZLyTleMl0LjnpN9"
```

## 📦 การติดตั้งและรันโปรเจกต์

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run Prisma Migrate** เพื่อสร้างตารางในฐานข้อมูลตาม `schema.prisma`:

    ```bash
    npx prisma migrate dev
    ```

3.  **(Optional) Seed a database** หากคุณมีไฟล์ `seed.js`
    สำหรับการเพิ่มข้อมูลเริ่มต้น:

    ```bash
    npx prisma db seed
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

เปิด [http://localhost:3000](http://localhost:3000) บน Browser
ของคุณเพื่อดูผลลัพธ์
