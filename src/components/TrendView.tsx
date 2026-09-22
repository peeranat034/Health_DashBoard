import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Calendar, Heart, Flame } from 'lucide-react';
import { HealthRecord } from '../types';

interface TrendViewProps {
  records: HealthRecord[];
}

export function TrendView({ records }: TrendViewProps) {
  // Aggregate by month: 2026-01, 2026-02, 2026-03
  const months = ['2026-01', '2026-02', '2026-03'];
  const monthLabels: { [key: string]: string } = {
    '2026-01': 'ม.ค. 2569 (Jan)',
    '2026-02': 'ก.พ. 2569 (Feb)',
    '2026-03': 'มี.ค. 2569 (Mar)',
  };

  const monthlyData = months.map((m) => {
    const list = records.filter((r) => r.month === m);
    const count = list.length || 1;
    const avgBloodSugar = Math.round(list.reduce((acc, r) => acc + r.bloodSugar, 0) / count) || 0;
    const avgSbp = Math.round(list.reduce((acc, r) => acc + r.sbp, 0) / count) || 0;
    const avgDbp = Math.round(list.reduce((acc, r) => acc + r.dbp, 0) / count) || 0;
    const avgPulse = Math.round(list.reduce((acc, r) => acc + r.pulse, 0) / count) || 0;
    const avgBmi = Number((list.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) || 0;
    const highRiskCount = list.filter((r) => r.riskLevel === 'สูง').length;
    const highRiskRate = Number(((highRiskCount / count) * 100).toFixed(1)) || 0;

    return {
      month: monthLabels[m] || m,
      rawMonth: m,
      count: list.length,
      'ระดับน้ำตาลเฉลี่ย (mg/dL)': avgBloodSugar,
      'ความดัน SBP เฉลี่ย (mmHg)': avgSbp,
      'ความดัน DBP เฉลี่ย (mmHg)': avgDbp,
      'ชีพจรเฉลี่ย (bpm)': avgPulse,
      'BMI เฉลี่ย': avgBmi,
      'ผู้เสี่ยงสูง (คน)': highRiskCount,
      'อัตราเสี่ยงสูง (%)': highRiskRate,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <TrendingUp className="w-4 h-4" />
          </span>
          <span>การวิเคราะห์แนวโน้มทางสุขภาพ (Health Longitudinal Trends)</span>
        </h2>
        <p className="text-xs text-slate-600">
          แสดงแนวโน้มและวิวัฒนาการของตัวชี้วัดสุขภาพสำคัญ: ระดับน้ำตาลในเลือด, ค่าความดันโลหิต (SBP/DBP), และอัตราความเสี่ยงสะสมรายเดือน
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend 1: Blood Sugar & Blood Pressure SBP trajectory */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>1. แนวโน้มระดับน้ำตาลและค่าความดันตัวบน (SBP)</span>
              </h3>
              <span className="text-[11px] text-slate-600">เปรียบเทียบเทรนด์เฉลี่ยรายเดือน (Jan - Mar 2026)</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900">
              2 Fields Trend
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="ระดับน้ำตาลเฉลี่ย (mg/dL)"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#FDE047', stroke: '#D97706', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="ความดัน SBP เฉลี่ย (mmHg)"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#DDD6FE', stroke: '#7C3AED', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-50 text-center">
            {monthlyData.map((d) => (
              <div key={d.month} className="p-2 rounded-xl bg-purple-50/50">
                <div className="text-[11px] text-slate-600 font-medium">{d.month}</div>
                <div className="text-xs font-bold text-amber-800">
                  น้ำตาล: {d['ระดับน้ำตาลเฉลี่ย (mg/dL)']} mg/dL
                </div>
                <div className="text-xs font-bold text-purple-900">
                  SBP: {d['ความดัน SBP เฉลี่ย (mmHg)']} mmHg
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend 2: High Risk Population Volume & Rate Trajectory */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>2. แนวโน้มจำนวนและสัดส่วนกลุ่มเสี่ยงสูง</span>
              </h3>
              <span className="text-[11px] text-slate-600">ติดตามวิวัฒนาการกลุ่มอาการเสี่ยงสูง (High Risk Trajectory)</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800">
              Risk Trajectory
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FDA4AF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FDA4AF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="ผู้เสี่ยงสูง (คน)"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHighRisk)"
                />
                <Line
                  type="monotone"
                  dataKey="อัตราเสี่ยงสูง (%)"
                  stroke="#475569"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>
                เฉลี่ยพบผู้มีความเสี่ยงสูง <strong>~4-5 คน/เดือน</strong> ({Math.round(records.filter((r) => r.riskLevel === 'สูง').length / 3)} คนต่อเดือน)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-purple-900 bg-white px-2 py-1 rounded-lg border border-purple-200">
              เฝ้าระวังอย่างต่อเนื่อง
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
