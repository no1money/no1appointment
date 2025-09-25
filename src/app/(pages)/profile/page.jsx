"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle,
  CalendarOff,
  BadgeCheck,
  Bell,
  Shield,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  UserCheck,
  UserX,
} from "lucide-react";
import { useLiff } from "@/app/components/Provider/LiffProvider";
import { useGetCustomer } from "@/app/(pages)/queue-services/hooks/useCustomer";
import BottomNavbar from "../queue-services/components/BottomNavbar";

export default function ProfilePage() {
  // ดึง liffProfile มาจาก provider
  const { liffProfile } = useLiff();
  const { data: customerData, isLoading: customerLoading } = useGetCustomer(
    liffProfile?.sub || null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // check ค่า true false จาก customerData
  const hasProfile = Boolean(customerData);
  // ตรวจสอบว่าเป็นสมาชิกแล้วไหม
  const displayData = hasProfile
    ? {
        displayName: customerData.fullname || customerData.line_display_name || "ไม่ระบุชื่อ",
        phone: customerData.phone || "ไม่ระบุ",
        email: customerData.email || "ไม่ระบุ",
        pictureUrl: customerData.picture_url || liffProfile?.picture,
        lineDisplayName: customerData.line_display_name || liffProfile?.displayName,
        joinDate: customerData.createdAt ? new Date(customerData.createdAt) : null,
        totalAppointments: customerData.appointments?.length || 0,
      }
    : {
        displayName: liffProfile?.name || "ผู้ใช้ LINE",
        phone: "ยังไม่ได้ลงทะเบียน",
        email: liffProfile?.email || "ยังไม่ได้ลงทะเบียน",
        pictureUrl: liffProfile?.picture,
        lineDisplayName: liffProfile?.name,
        joinDate: null,
        totalAppointments: 0,
      };

  // Calculate stats for profile users
  const stats = useMemo(() => {
    if (!hasProfile || !customerData?.appointments) {
      return { COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0, CONFIRMED: 0 };
    }

    const base = { COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0, CONFIRMED: 0 };
    for (const appointment of customerData.appointments) {
      if (base[appointment.status] !== undefined) {
        base[appointment.status] += 1;
      }
    }
    return base;
  }, [hasProfile, customerData]);

  if (customerLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-slate-600">กำลังโหลดข้อมูลโปรไฟล์...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header with gradient */}
      <header className="bg-gradient-to-b from-blue-950 via-indigo-700 to-purple-600 p-4 pt-40 text-white shadow">
        <div className="mx-auto max-w-xl">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-white/20">
                {displayData.pictureUrl ? (
                  <img
                    src={displayData.pictureUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-8 w-8 text-white/70" />
                  </div>
                )}
              </div>
              {hasProfile && (
                <div className="absolute -right-1 -bottom-1 rounded-full bg-emerald-500 p-1">
                  <UserCheck className="h-3 w-3 text-white" />
                </div>
              )}
              {!hasProfile && (
                <div className="absolute -right-1 -bottom-1 rounded-full bg-amber-500 p-1">
                  <UserX className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{displayData.displayName}</h1>
              <p className="text-sm text-white/80">
                {hasProfile ? "สมาชิกที่ลงทะเบียนแล้ว" : "ยังไม่ได้ลงทะเบียน"}
              </p>
              {displayData.joinDate && (
                <p className="mt-1 text-xs text-white/60">
                  สมาชิกตั้งแต่ {displayData.joinDate.toLocaleDateString("th-TH")}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>

          {/* Stats Row */}
          {hasProfile && (
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <StatKPI
                label="เสร็จสิ้น"
                icon={CheckCircle2}
                value={stats.COMPLETED}
                color="text-emerald-300"
              />
              <StatKPI
                label="ยกเลิก"
                icon={XCircle}
                value={stats.CANCELLED}
                color="text-rose-300"
              />
              <StatKPI
                label="ไม่มา"
                icon={CalendarOff}
                value={stats.NO_SHOW}
                color="text-amber-300"
              />
              <StatKPI
                label="ยืนยัน"
                icon={BadgeCheck}
                value={stats.CONFIRMED}
                color="text-sky-300"
              />
            </div>
          )}

          {/* Registration prompt for non-profile users */}
          {!hasProfile && (
            <div className="mt-4 rounded-lg bg-white/10 p-3 ring-1 ring-white/20">
              <div className="flex items-center gap-2 text-sm">
                <UserX className="h-4 w-4 text-amber-300" />
                <span className="text-white/90">
                  ลงทะเบียนเพื่อใช้งานเต็มรูปแบบและเก็บประวัติการจอง
                </span>
              </div>
              <Link
                href="/queue-services"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-white/90"
              >
                ลงทะเบียนเลย
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Profile Details */}
      <section className="mx-auto max-w-xl space-y-4 px-4 py-6">
        {/* Contact Information */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-black/15">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <User className="h-4 w-4 text-blue-600" />
              ข้อมูลส่วนตัว
            </h2>
          </div>
          <div className="space-y-3 p-4">
            <InfoRow
              icon={User}
              label="ชื่อ"
              value={displayData.displayName}
              isPlaceholder={!hasProfile}
            />
            {displayData.lineDisplayName && (
              <InfoRow
                icon={MessageSquare}
                label="LINE Name"
                value={displayData.lineDisplayName}
                isPlaceholder={false}
              />
            )}
            <InfoRow
              icon={Phone}
              label="เบอร์โทรศัพท์"
              value={displayData.phone}
              isPlaceholder={!hasProfile}
            />
            <InfoRow
              icon={Mail}
              label="อีเมล"
              value={displayData.email}
              isPlaceholder={!hasProfile}
            />
            
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-3">
          <ActionCard
            icon={Calendar}
            title="ประวัติการจอง"
            subtitle={hasProfile ? `${displayData.totalAppointments} ครั้ง` : "ไม่มีข้อมูล"}
            href="/queue-history"
            gradient="from-blue-900 via-blue-700 to-sky-500"
          />
{/*           <ActionCard
            icon={Bell}
            title="การแจ้งเตือน"
            subtitle="ตั้งค่าการแจ้งเตือน"
            href="/settings/notifications"
            gradient="from-emerald-900 via-emerald-700 to-lime-500"
          /> */}
        </div>

        {/* Settings */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-black/15">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Settings className="h-4 w-4 text-slate-600" />
              การตั้งค่า
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            <SettingRow
              icon={Shield}
              title="ความเป็นส่วนตัว"
              subtitle="จัดการข้อมูลส่วนตัวและการแชร์"
              href="/settings/privacy"
            />
            <SettingRow
              icon={HelpCircle}
              title="ความช่วยเหลือ"
              subtitle="คำถามที่พบบ่อยและการติดต่อ"
              href="/help"
            />
            <SettingRow
              icon={LogOut}
              title="ออกจากระบบ"
              subtitle="ออกจากบัญชี LINE"
              href="#"
              onClick={() => {
                // Handle logout logic here
                console.log("Logout clicked");
              }}
              isDestructive
            />
          </div>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
            <p className="font-mono">Profile Status: {hasProfile ? "Registered" : "LIFF Only"}</p>
            <p className="font-mono">LINE User ID: {liffProfile?.sub || "Not available"}</p>
            {customerData && <p className="font-mono">Customer ID: {customerData.id}</p>}
          </div>
        )}
      </section>
      <BottomNavbar />
    </main>
  );
}

function StatKPI({ label, value, color, icon: Icon }) {
  return (
    <div className="rounded-lg bg-white/10 py-2">
      <div className={`flex items-center justify-center gap-1 text-xs ${color}`}>
        {Icon && <Icon size={14} />}
        <span>{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, isPlaceholder }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div
          className={`text-sm font-medium ${isPlaceholder ? "text-slate-400 italic" : "text-slate-900"}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, subtitle, href, gradient }) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-black/15 transition hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b ${gradient} text-white`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}

function SettingRow({ icon: Icon, title, subtitle, href, onClick, isDestructive }) {
  const Component = href === "#" ? "button" : Link;
  const props = href === "#" ? { onClick, type: "button" } : { href };

  return (
    <Component
      {...props}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
        isDestructive ? "hover:bg-red-50" : ""
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          isDestructive ? "bg-red-100" : "bg-slate-100"
        }`}
      >
        <Icon className={`h-4 w-4 ${isDestructive ? "text-red-600" : "text-slate-600"}`} />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${isDestructive ? "text-red-600" : "text-slate-900"}`}>
          {title}
        </div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <ExternalLink className="h-4 w-4 text-slate-400" />
    </Component>
  );
}
