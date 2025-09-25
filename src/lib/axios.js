import axios from "axios";
import qs from "qs";

const serverOption = process.env.NEXT_PUBLIC_SERVER_OPTION;
const productionApiUrl = process.env.NEXT_PUBLIC_API_URL;

// ตรวจสอบตัวแปรทั้งหมดก่อน
if (!serverOption) {
  throw new Error("Environment variable NEXT_PUBLIC_SERVER_OPTION is not set");
}
if (!productionApiUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_API_URL is not set");
}


// เปลี่ยน api url ตาม env
const apiUrl = productionApiUrl;

console.log("CHECK API URL", apiUrl);

export default axios.create({
  // สร้าง axios ไปใช้ยึดเอา apiUrl เป็นราก
  // DEV: http://locahost:3000/api

  // เอาไปใช้ axios.get('/v1/appointments/...')
  baseURL: apiUrl,
  // ให้ params เป็น array ไปหลังบ้าน
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});
