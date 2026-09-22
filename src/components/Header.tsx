import { useState } from 'react';
import { RefreshCw, Activity, ShieldCheck, User, Sparkles, Clock } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  secondsUntilNextSync: number;
  totalRecords: number;
}

export function Header({
  lastUpdated,
  isLoading,
  onRefresh,
  secondsUntilNextSync,
  totalRecords,
}: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format date in Thai locale
  const formattedDate = lastUpdated
    ? new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastUpdated)
    : 'กำลังเชื่อมต่อ...';

  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EDE9FE]/90 via-[#F3F0FA] to-[#FEF9C3]/40 border border-purple-200/70 p-6 md:p-8 shadow-sm backdrop-blur-md">
      {/* Subtle decorative glow element */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-200/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Brand Title, Description, and Creator */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-300 text-slate-900 shadow-sm border border-amber-200 font-bold">
              <Activity className="w-6 h-6 text-slate-800 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
                  <span>VITA PULSE</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-300/80 text-slate-900 border border-amber-300">
                    Pastel Tech Edition
                  </span>
                </h1>
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-600">
                ระบบวิเคราะห์และเฝ้าระวังสุขภาพอัจฉริยะ (Community Health Risk & Behavior Intelligence)
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed">
            แพลตฟอร์มติดตามแนวโน้มสุขภาพ คัดกรองความเสี่ยงโรคไม่ติดต่อเรื้อรัง (NCDs) และวิเคราะห์พฤติกรรมสุขภาพชุมชน ประมวลผลจากฐานข้อมูลคลาวด์แบบเรียลไทม์
          </p>

          {/* Badges: Creator & PDPA Safe */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Creator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-purple-200/80 shadow-xs text-xs font-medium text-purple-950">
              <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-800">
                <User className="w-3 h-3" />
              </div>
              <span>
                ผู้จัดทำ: <strong className="font-semibold text-purple-900">นายพีรณัฐ บุญรอด</strong>
              </span>
            </div>

            {/* PDPA Compliant Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDPA Compliant (รหัสบุคคลไร้ตัวตน)</span>
            </div>

            {/* Total Synchronized Records */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ข้อมูลคัดกรองในระบบ: <strong className="font-bold">{totalRecords}</strong> ราย</span>
            </div>
          </div>
        </div>

        {/* Right Side: Live Sync Status, Auto-refresh Countdown & Manual Refresh Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 bg-white/80 p-4 rounded-2xl border border-purple-100 shadow-xs backdrop-blur-sm">
          {/* Live Sync Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              เชื่อมต่อสดแบบเรียลไทม์ (Live Sync)
            </span>
          </div>

          {/* Last Updated Timestamp & Countdown */}
          <div className="text-left lg:text-right space-y-0.5">
            <div className="flex items-center lg:justify-end gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>อัปเดตล่าสุด:</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div className="text-[11px] text-purple-700/80 font-medium">
              ซิงก์รอบถัดไปอัตโนมัติใน <span className="font-bold text-amber-600">{secondsUntilNextSync}</span> วินาที
            </div>
          </div>

          {/* Manual Refresh Button */}
          <button
            id="btn-refresh-data"
            onClick={onRefresh}
            disabled={isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-300 hover:bg-amber-400 text-slate-900 shadow-xs hover:shadow transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
            title="ดึงข้อมูลล่าสุดจาก Google Sheet ทันที"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform ${isLoading ? 'animate-spin' : isHovered ? 'rotate-180 duration-500' : ''}`}
            />
            <span>{isLoading ? 'กำลังโหลดข้อมูล...' : 'รีเฟรชข้อมูลเดี๋ยวนี้'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
