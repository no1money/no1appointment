"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function DPOConsent({ onAccept }) {
  const [showScrollButton, setShowScrollButton] = useState(true); // Show by default initially

  useEffect(() => {
    const termsBox = document.querySelector(".terms-box");
    if (!termsBox) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = termsBox;
      // A buffer of 10px helps with precision issues across browsers
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      setShowScrollButton(!isAtBottom);
    };

    // Initial check
    handleScroll();

    termsBox.addEventListener("scroll", handleScroll);
    return () => {
      termsBox.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToBottom = () => {
    const element = document.querySelector(".terms-box");
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="relative flex h-full max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header with Logo */}
        <div className="flex flex-col items-center p-6">
          <Image
            src="https://lh3.googleusercontent.com/d/18SfBnCKgKsI3KL-Wnwxnk5g484JeJ5Jm"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
            className="mb-4"
          />
          <h1 className="text-center text-xl font-bold text-gray-900">
            อนุญาตให้เก็บ ประมวลผล <br />
            และใช้ข้อมูลส่วนบุคคลอ่อนไหว
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="terms-box flex-grow overflow-y-auto px-6 pb-4">
          <section className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p>
              เพื่อให้บริษัท โอเคนัมเบอร์วัน จำกัดและบริษัทในเครือ ได้นำเสนอสิทธิประโยชน์และดูแล ท่าน
              โดยไม่เป็นการละเมิดสิทธิความเป็นส่วนตัวของข้าพเจ้า ข้าพเจ้าขอแสดงเจตนาและยินยอมให้บริษัทเก็บ
              ประมวลผลและใช้ข้อมูลส่วนบุคคลอ่อนไหว ได้แก่ ข้อมูลชีวมิติ (Biometric Data)
              และภาพถ่ายบัตรประจำตัวประชาชนซึ่งมีข้อมูลส่วนบุคคลอ่อนไหวของท่านได้แก่ ศาสนา และ/หรือกรุ๊ปเลือด (ถ้ามี)
              อยู่ด้วย
              รวมถึงเปิดเผยข้อมูลส่วนบุคคลอ่อนไหวดังกล่าวให้แก่บุคคลภายนอกซึ่งมีหน้าที่ประมวลผลข้อมูลให้แก่บริษัท
              เพื่อวัตถุประสงค์ในการยืนยันและพิสูจน์อัตลักษณ์ตัวบุคคลและใช้บริการผลิตภัณฑ์ และ/หรือ บริการบนแอพพลิเคชัน
              NO1Money+ ของท่าน รวมถึงการป้องกันอาชญากรรม การฉ้อโกงและการต้องสงสัยเกี่ยวกับการสนับสนุนทางการเงินแก่การ
              ก่อการร้ายหรือการฟอกเงิน
            </p>
            <p>
              ทั้งนี้ บริษัทจะดำเนินการเก็บ ประมวลผล และใช้ข้อมูลส่วน บุคคลอ่อนไหวของท่าน
              ให้สอดคล้องกับกฎหมายและเป็นไปตามมาตรฐานการรักษาความปลอดภัยที่เหมาะสมภายใต้นโยบายการคุ้มครองข้อมูลส่วนบุคคล
              โดยท่านสามารถศึกษาข้อมูลเพิ่มเติมเกี่ยวกับการเก็บ ประมวลผล และใช้ข้อมูลส่วนบุคคลได้ที่{" "}
              <a href="privacy-policy.html" className="text-pink-500 hover:underline">
                นโยบายความเป็นส่วนตัว (Privacy Policy)
              </a>
            </p>
            <div>
              <p className="font-semibold">หมายเหตุ :</p>
              <ol className="list-inside list-decimal space-y-2 pl-2">
                <li>
                  ในกรณีที่ท่านเป็นผู้เยาว์ (อายุต่ำกว่า 20 ปี) ท่านรับรองว่าท่านได้รับความยินยอมจากผู้ปกครอง
                  มีอำนาจกระทำการแทนท่านตามกฎหมายในการให้ความยินยอมแก่บริษัทในครั้งนี้เป็นที่เรียบร้อยแล้ว
                </li>
                <li>
                  ในกรณีที่ท่านไม่ให้ความยินยอม ท่านจะไม่สามารถใช้บริการแอปพลิเคชัน NO1Money+ ได้อีก ทั้งนี้
                  ท่านสามารถขอถอนความยินยอมได้โดยติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer :
                  DPO) อีเมล์ : dpo@no1.email หรือ ช่องทางอื่นที่บริษัทกำหนดในภายหน้า
                  โดยบริษัทจะดำเนินการเปลี่ยนแปลงความยินยอมให้แก่ท่าน ภายในวันที่ 15 (สิบห้า) ของเดือน ถัดไป หรือภายใน
                  30 (สามสิบ) วันนับแต่วันที่ท่านได้แจ้งเปลี่ยนแปลงความยินยอม
                </li>
              </ol>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">เงื่อนไขและข้อตกลงในการรับซื้อสินค้าและทำสัญญา</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <ol className="list-inside list-decimal space-y-2">
                <li>
                  NO1Money+ ขอสงวนสิทธิ์ที่จะไม่จ่ายเงินและไม่รับสินค้าหรือทำสัญญาในกรณีที่ผู้ขาย,ผู้เช่าชื้อ
                  ระบุข้อมูลสินค้าบนหน้าเว็บไม่ตรง กับสินค้าในวันและเวลาที่ผู้เชียวชาญเข้าไปเช็คเพื่อรับสินค้า ณ
                  สถานที่นั้นๆ
                </li>
                <li>
                  ระยะเวลาในการตรวจสอบแต่ละเครื่องประมาณ 15 - 30
                  นาทีอาจจะต้องมีการเกะตัวเครื่องเพื่อทำการตรวจสอบภายในโดยช่างผู้เชียวชาญอย่างละเอียด
                </li>
                <li>NO1Money+ จะไม่ขอรับผิดชอบเกี่ยวกับข้อมูลที่ยังคงค้างอยู่ในตัวเครื่องของสินค้าทุกประการ</li>
                <li>
                  NO1Money+ ขอสงวนสิทธิ์ที่จะไม่รับสินค้าและไม่จ่ายเงินในกรณีที่ตัวตนที่แท้จริงของผู้ขายไม่ตรงตาม
                  บัตรประชาชนในวันที่ผู้เชียวชาญเข้าไปรับเครื่อง
                </li>
                <li>
                  NO1Money+ ขอสงวนสิทธิไม่คืนสินค้าหลังจากลูกค้ารับเงินและนัมเบอร์วันมันนี่ได้รับสินค้าเป็นที่เรียบร้อย
                </li>
                <li>
                  NO1Money+ จะถือว่าการซื้อขายเป็นโมฆะในกรณีที่ผู้ขายไม่ได้มาตามนัดและปฏิเสธคืนมัดจำการเดินทางทุกกรณี
                </li>
                <li>ผู้ขายได้อ่านเงื่อนไขและข้อตกลงทั้งหมดเป็นที่เรียบร้อยแล้วสรุปรายการรับซื้อ</li>
              </ol>
              <div className="pl-4">
                <p className="font-semibold">ลูกค้าจะต้องเตรียม</p>
                <ol className="list-inside list-decimal">
                  <li>บัตรประชาชนตัวจริง (ต้องมีอายุมากกว่า 18 ปีขึ้นไป)</li>
                  <li>สำรองข้อมูลไว้เรียบร้อย</li>
                  <li>ชาร์จแบตเตอรี่ให้เต็ม เพื่อความสะดวกรวดเร็วต่อเจ้าหน้าที่ในการตรวจสอบสินค้า</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">เงื่อนไขและข้อตกลงซื้อ-ขายมือถือ</h2>
            <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700">
              <li>NO1Money+ จะไม่ขอรับผิดชอบเกี่ยวกับข้อมูลที่ยังคงค้างอยู่ในตัวเครื่องของสินค้าทุกกรณี</li>
              <li>
                NO1Money+
                ขอสงวนสิทธิ์ที่จะไม่รับสินค้าและไม่จ่ายเงินในกรณีที่ตัวตนที่แท้จริงของผู้ขายไม่ตรงตามบัตรประชาชนในวันที่ผู้เชี่ยวชาญเข้าไปรับเครื่อง
              </li>
              <li>
                NO1Money+ ขอสงวนสิทธิ์ไม่คืนสินค้าหลังจากลูกค้ารับเงินและทาง NO1Money+ ได้รับสินค้าเป็นที่เรียบร้อยแล้ว
              </li>
              <li>
                NO1Money+ จะส่งคืนสินค้าและรับเงินคืนเต็มจำนวนตามสัญญาซื้อขาย
                หากตรวจพบเครื่องติดสัญญารายเดือนหรือติดผ่อน
              </li>
              <li>
                NO1Money+ จะรับซื้อเครื่องจะต้องเป็นกรรมสิทธิ์ของผู้ขายโดยสมบูรณ์ ทางบริษัทไม่รับเครื่องติดสัญญารายเดือน
                เครื่องติดผ่อน ทุกกรณี
              </li>
              <li>NO1Money+ จะรับซื้อเครื่องกรณีที่ติดล็อคซิมการ์ด หัก 50%จากราคาที่ประเมินได้จริงทุกกรณี</li>
            </ol>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">รายละเอียดสภาพตัวเครื่อง</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">เครื่องรอยนิดหน่อย</span> หมายถึง ตัวเครื่องมีรอยเคสบางๆในบางจุด
                (ไม่มีสภาพ บุบ ถลอก สีหลุด เข้าเนื้อ)
              </p>
              <p>
                <span className="font-semibold">เครื่องมีรอยมาก</span> หมายถึง ตัวเครื่องมีสภาพ บุบ ถลอก สีหลุด
                เข้าเนื้อ (เพียง 1-2 จุดเล็กเท่านั้น)
              </p>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-gray-900">รายละเอียดสภาพหน้าจอ</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">หน้าจอมีรอยบางๆ</span> หมายถึง หน้าจอมีรอยบางๆ ไม่กี่จุด ไม่มีสะดุด /
                ถลอก / บิ่น / แตก
              </p>
              <p>
                <span className="font-semibold">หน้าจอมีรอยสะดุด</span> หมายถึง หน้าจอมีรอยบาง (ทั่วจอ) / สะดุด
                (เพียงเล็กน้อย) ในกรณีที่มีหน้าจอสะดุดชัดทั่วจอ / ถลอก / บิ่น ทางบริษัทจะต้องประเมิณเป็นหน้าจอแตก
                (เนื่องจากจะต้องลอกจอ)
              </p>
              <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                <p className="font-semibold">*หมายเหตุ:</p>
                <ul className="list-inside list-disc pl-2">
                  <li>
                    ในกรณีที่ทางบริษัทให้ราคาตามที่ลูกค้าตกลง ไปถึงสถานที่จริงลูกค้าปฏิเสธการขายจะมีค่าใช้จ่าย 300 บาท
                  </li>
                  <li>
                    ทำรายการผิดรุ่น หรือกรอกรายละเอียดไม่ตรงกับสินค้าจริง ลูกค้าปฏิเสธการขายจะมีค่าใช้จ่าย 300 บาท
                  </li>
                  <li>ในกรณีที่เครื่องลูกค้าเป็น Refurbished บริษัทจะหัก 50% ของราคารับซื้อในระบบ</li>
                  <li>ในกรณีที่เครื่องลูกค้าเป็นเครื่องเคลม บริษัทจะหัก 10% ของราคารับซื้อในระบบ</li>
                  <li>
                    ในกรณีที่รุ่น Samsung Fold / Flip เจ้าหน้าที่จะต้องตรวจสอบการกางของเครื่องในหน้างานอีกที
                    ถ้ามีการกางไม่สุดบางเครื่องทางบริษัทจะไม่สามารถรับซื้อได้ หรือ ถ้ามีการซื้อขายจะหักจากราคาประมาณ
                    30-40%
                  </li>
                  <li>
                    ในกรณีการตรวจสอบของพนักงาน ปัญหาเรื่องเกี่ยวกับกล้อง ทางเจ้าหน้าที่จะตรวจสอบ กล้องช้ำ / จุด Dead
                    ในกล้อง ถ้าเครื่องมีปัญหาเหล่านี้เยอะ ทางบริษัทจะประเมินหน้าเว็บกล้องมีปัญหา
                    แต่ถ้าเครื่องมีปัญหาเล็กน้อย ทางบริษัทจะหักประมาณ 20-30%
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Version */}
          <p className="mt-8 text-center text-xs text-gray-500">version 1.0.2 (10 ม.ค. 2568)</p>
        </div>

        {/* Footer with Button */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 text-center">
          <button
            onClick={onAccept}
            className="w-full max-w-xs rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            ยอมรับ
          </button>
        </div>

        {/* Scroll Down Button */}
        {showScrollButton && (
          <button
            onClick={handleScrollToBottom}
            className="absolute bottom-24 right-5 z-10 h-12 w-12 animate-bounce rounded-full border-none bg-transparent p-0"
            aria-label="เลื่อนลงล่างสุด"
          >
            <Image
              src="https://lh3.googleusercontent.com/d/1cbrhoF_QSrry2PDZVe1sy3-3CMVAfuNB"
              alt="เลื่อนลงล่างสุด"
              width={48}
              height={48}
              className="rounded-full shadow-lg"
            />
          </button>
        )}
      </div>
    </motion.div>
  );
}
