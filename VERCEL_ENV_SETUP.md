# การตั้งค่า Environment Variables ใน Vercel

## Environment Variables ที่จำเป็น

จากไฟล์ `src/lib/axios.js` โปรเจคนี้ต้องการ environment variables ดังนี้:

1. `NEXT_PUBLIC_SERVER_OPTION` - กำหนดว่าจะใช้ environment แบบไหน ("dev" หรือ "production")
2. `NEXT_PUBLIC_DEV_API_URL` - URL ของ API สำหรับ development
3. `NEXT_PUBLIC_API_URL` - URL ของ API สำหรับ production

## วิธีการตั้งค่าใน Vercel

### 1. เข้าไปที่ Vercel Dashboard
- ไปที่ [vercel.com](https://vercel.com)
- เลือกโปรเจค NO1Appointment

### 2. ตั้งค่า Environment Variables
- ไปที่ Settings > Environment Variables
- เพิ่มตัวแปรแต่ละตัวดังนี้:

#### สำหรับ Production:
```
NEXT_PUBLIC_SERVER_OPTION = production
NEXT_PUBLIC_DEV_API_URL = http://localhost:3000/api
NEXT_PUBLIC_API_URL = https://your-production-api.com/api
```

#### สำหรับ Preview (Development):
```
NEXT_PUBLIC_SERVER_OPTION = dev
NEXT_PUBLIC_DEV_API_URL = http://localhost:3000/api
NEXT_PUBLIC_API_URL = https://your-production-api.com/api
```

### 3. การตั้งค่า Environment
- เลือก Environment ที่ต้องการ (Production, Preview, Development)
- ใส่ค่าให้ครบทุกตัวแปร
- กด Save

### 4. Redeploy
- หลังจากตั้งค่าแล้ว ให้ทำการ redeploy โปรเจค
- ไปที่ Deployments tab
- กดปุ่ม "..." ตรง deployment ล่าสุด
- เลือก "Redeploy"

## การทดสอบ

หลังจากตั้งค่าแล้ว สามารถทดสอบได้โดย:
1. ดู console log ใน browser developer tools
2. ควรเห็นข้อความ "CHECK API URL" พร้อมกับ URL ที่ถูกต้อง

## หมายเหตุ
- ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` จะถูก expose ให้ client-side
- ควรระวังเรื่อง security เมื่อใส่ sensitive data
- สำหรับ production ให้ใช้ HTTPS URL เสมอ

## การตั้งค่าผ่าน Vercel CLI

### 1. ติดตั้ง Vercel CLI (ถ้ายังไม่ได้ติดตั้ง)
```bash
npm i -g vercel
```

### 2. Login เข้า Vercel
```bash
vercel login
```

### 3. Link โปรเจค (ถ้ายังไม่ได้ link)
```bash
vercel link
```

### 4. เพิ่ม Environment Variables
```bash
# เพิ่มสำหรับ Production
vercel env add NEXT_PUBLIC_SERVER_OPTION production production
vercel env add NEXT_PUBLIC_DEV_API_URL production production
vercel env add NEXT_PUBLIC_API_URL production production

# เพิ่มสำหรับ Preview
vercel env add NEXT_PUBLIC_SERVER_OPTION preview preview
vercel env add NEXT_PUBLIC_DEV_API_URL preview preview
vercel env add NEXT_PUBLIC_API_URL preview preview

# เพิ่มสำหรับ Development
vercel env add NEXT_PUBLIC_SERVER_OPTION development development
vercel env add NEXT_PUBLIC_DEV_API_URL development development
vercel env add NEXT_PUBLIC_API_URL development development
```

### 5. ดู Environment Variables ที่ตั้งค่าไว้
```bash
vercel env list
```

### 6. ดึง Environment Variables จาก Vercel มาใช้ในเครื่อง
```bash
vercel env pull .env.local
```

## การทดสอบการตั้งค่า

หลังจากตั้งค่าแล้ว สามารถทดสอบได้โดย:

1. **ตรวจสอบในเครื่อง:**
   ```bash
   npm run dev
   ```
   เปิด browser และดู console log ควรเห็น "CHECK API URL" พร้อมกับ URL ที่ถูกต้อง

2. **ตรวจสอบใน Vercel:**
   - ไปที่ Vercel Dashboard
   - ดูที่ Deployments
   - ตรวจสอบ Function Logs หรือ Runtime Logs

## ตัวอย่างการตั้งค่า

### สำหรับ Development
```
NEXT_PUBLIC_SERVER_OPTION=dev
NEXT_PUBLIC_DEV_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

### สำหรับ Production
```
NEXT_PUBLIC_SERVER_OPTION=production
NEXT_PUBLIC_DEV_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

## Troubleshooting

### ปัญหาที่พบบ่อย:
1. **Environment variables ไม่ทำงาน:** ตรวจสอบว่าตัวแปรขึ้นต้นด้วย `NEXT_PUBLIC_`
2. **URL ไม่ถูกต้อง:** ตรวจสอบว่า URL มี protocol (http:// หรือ https://)
3. **Redeploy ไม่ทำงาน:** ลองลบ deployment เก่าและ deploy ใหม่

### การ Debug:
- ใช้ `console.log` ในโค้ดเพื่อดูค่าตัวแปร
- ตรวจสอบ Network tab ใน browser developer tools
- ดู logs ใน Vercel Dashboard
