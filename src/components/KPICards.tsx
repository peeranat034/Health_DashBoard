import { Users, Activity, Gauge, TrendingUp, HeartPulse, Scale } from 'lucide-react';
import { KPIStats } from '../types';

interface KPICardsProps {
  stats: KPIStats;
  maleCount: number;
  femaleCount: number;
}

export function KPICards({ stats, maleCount, femaleCount }: KPICardsProps) {
  const malePercent = stats.totalCount > 0 ? Math.round((maleCount / stats.totalCount) * 100) : 0;
  const femalePercent = stats.totalCount > 0 ? Math.round((femaleCount / stats.totalCount) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>สรุปตัวชี้วัดสถิติสุขภาพสำคัญ (Health KPI Summary)</span>
        </h2>
        <span className="text-xs text-purple-700/80 font-medium">
          ประมวลผล 4 มิติทางสถิติ: รวม, เฉลี่ย, ต่ำสุด-สูงสุด, ร้อยละ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* KPI 1: Total Count (จำนวนรวม) */}
        <div
          id="kpi-total-screened"
          className="relative overflow-hidden rounded-2xl bg-white/85 p-5 border border-purple-100/90 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/60 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              จำนวนรวม (Total Count)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {stats.totalCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-600">คน</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">ยอดผู้เข้ารับการตรวจคัดกรองทั้งหมด</p>
          <div className="mt-3 pt-3 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>
              ชาย: <strong className="text-purple-900">{maleCount}</strong> ({malePercent}%)
            </span>
            <span>
              หญิง: <strong className="text-purple-900">{femaleCount}</strong> ({femalePercent}%)
            </span>
          </div>
        </div>

        {/* KPI 2: Average Values (ค่าเฉลี่ย) */}
        <div
          id="kpi-average-metrics"
          className="relative overflow-hidden rounded-2xl bg-white/85 p-5 border border-amber-200/60 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/40 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              ค่าเฉลี่ย (Average)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-slate-600">BMI เฉลี่ย</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">{stats.avgBmi}</span>
                <span className="text-[10px] text-slate-600">kg/m²</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-600">น้ำตาลเฉลี่ย</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">{stats.avgBloodSugar}</span>
                <span className="text-[10px] text-slate-600">mg/dL</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>อายุเฉลี่ย: <strong className="text-slate-800">{stats.avgAge} ปี</strong></span>
            <span>คะแนนเสี่ยงเฉลี่ย: <strong className="text-slate-800">{stats.avgRiskScore}/7</strong></span>
          </div>
        </div>

        {/* KPI 3: Min / Max Values (ค่าต่ำสุด/สูงสุด) */}
        <div
          id="kpi-min-max-range"
          className="relative overflow-hidden rounded-2xl bg-white/85 p-5 border border-purple-100/90 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
              ต่ำสุด - สูงสุด (Min / Max)
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">น้ำตาลในเลือด:</span>
              <span className="font-bold text-slate-800">
                <span className="text-emerald-700">{stats.minBloodSugar}</span> -{' '}
                <span className="text-rose-700">{stats.maxBloodSugar}</span> mg/dL
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">ความดัน SBP:</span>
              <span className="font-bold text-slate-800">
                <span className="text-emerald-700">{stats.minSbp}</span> -{' '}
                <span className="text-rose-700">{stats.maxSbp}</span> mmHg
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>BMI ช่วง: {stats.minBmi} - {stats.maxBmi}</span>
            <span>อายุช่วง: {stats.minAge} - {stats.maxAge} ปี</span>
          </div>
        </div>

        {/* KPI 4: Ratio / Percentage (สัดส่วน / ร้อยละ) */}
        <div
          id="kpi-ratio-high-risk"
          className="relative overflow-hidden rounded-2xl bg-white/85 p-5 border border-rose-200/70 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/40 rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              สัดส่วน & ร้อยละ (Ratio / %)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-700 tracking-tight">
                {stats.highRiskPercentage}%
              </span>
              <span className="text-xs font-medium text-slate-600">เสี่ยงสูง</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold">
              {stats.highRiskCount} / {stats.totalCount} คน
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">สัดส่วนผู้ที่มีระดับความเสี่ยงสูง</p>
          <div className="mt-3 pt-3 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600">
            <span>น้ำหนักเกิน (BMI≥25): <strong className="text-amber-800">{stats.overweightPercentage}%</strong></span>
            <span>เสี่ยงเบาหวาน: <strong className="text-purple-900">{stats.diabetesRiskPercentage}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
