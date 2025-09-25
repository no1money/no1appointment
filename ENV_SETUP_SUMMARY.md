# สรุปการตั้งค่า Environment Variables จาก Vercel

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. สร้างไฟล์ Environment Variables
- `.env.example` - ตัวอย่าง environment variables
- `.env.local` - environment variables สำหรับการพัฒนาในเครื่อง
- `VERCEL_ENV_SETUP.md` - คู่มือการตั้งค่าใน Vercel

### 2. ตั้งค่า Environment Variables ใน Vercel
ได้เพิ่ม environment variables ทั้งหมดใน Vercel แล้ว:

#### Development Environment:
- `NEXT_PUBLIC_SERVER_OPTION` = "dev"
- `NEXT_PUBLIC_DEV_API_URL` = "http://localhost:3000/api"
- `NEXT_PUBLIC_API_URL` = "https://your-production-api.com/api"

#### Production Environment:
- `NEXT_PUBLIC_SERVER_OPTION` = "production"
- `NEXT_PUBLIC_DEV_API_URL` = "http://localhost:3000/api"
- `NEXT_PUBLIC_API_URL` = "https://your-production-api.com/api"

### 3. ดึง Environment Variables จาก Vercel
ใช้คำสั่ง `vercel env pull .env.local` เพื่อดึง environment variables จาก Vercel มาใช้ในเครื่อง

## 🔧 วิธีการใช้งาน

### การพัฒนาในเครื่อง:
```bash
# ดึง environment variables จาก Vercel
vercel env pull .env.local

# รันโปรเจค
npm run dev
```

### การ Deploy ไปยัง Vercel:
Environment variables จะถูกใช้โดยอัตโนมัติเมื่อ deploy ไปยัง Vercel

## 📝 Environment Variables ที่ใช้ในโปรเจค

จากไฟล์ `src/lib/axios.js`:

1. **NEXT_PUBLIC_SERVER_OPTION**
   - กำหนดว่าจะใช้ environment แบบไหน
   - ค่า: "dev" หรือ "production"

2. **NEXT_PUBLIC_DEV_API_URL**
   - URL ของ API สำหรับ development
   - ค่า: "http://localhost:3000/api"

3. **NEXT_PUBLIC_API_URL**
   - URL ของ API สำหรับ production
   - ค่า: "https://your-production-api.com/api"

## �� ขั้นตอนต่อไป

1. **อัปเดตค่า API URLs:**
   - เปลี่ยน `https://your-production-api.com/api` เป็น URL จริงของ API

2. **ทดสอบการทำงาน:**
   ```bash
   npm run dev
   ```
   เปิด browser และดู console log ควรเห็น "CHECK API URL" พร้อมกับ URL ที่ถูกต้อง

3. **Deploy ไปยัง Vercel:**
   ```bash
   vercel --prod
   ```

## 🔍 การตรวจสอบ

### ตรวจสอบ Environment Variables ใน Vercel:
```bash
vercel env list
```

### ตรวจสอบ Environment Variables ในเครื่อง:
```bash
cat .env.local
```

### ตรวจสอบการทำงาน:
- เปิด browser developer tools
- ดู console log ควรเห็น "CHECK API URL"
- ตรวจสอบ Network tab ว่า API calls ไปยัง URL ที่ถูกต้อง

## 📚 ไฟล์ที่เกี่ยวข้อง

- `src/lib/axios.js` - ไฟล์หลักที่ใช้ environment variables
- `.env.local` - environment variables สำหรับการพัฒนา
- `.env.example` - ตัวอย่าง environment variables
- `VERCEL_ENV_SETUP.md` - คู่มือการตั้งค่าใน Vercel
- `ENV_SETUP_SUMMARY.md` - สรุปการตั้งค่า (ไฟล์นี้)

## ⚠️ หมายเหตุ

- ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` จะถูก expose ให้ client-side
- ควรระวังเรื่อง security เมื่อใส่ sensitive data
- สำหรับ production ให้ใช้ HTTPS URL เสมอ
- หลังจากเปลี่ยน environment variables ใน Vercel ให้ทำการ redeploy
