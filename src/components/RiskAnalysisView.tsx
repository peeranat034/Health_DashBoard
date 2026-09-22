import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { AlertTriangle, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { HealthRecord } from '../types';

interface RiskAnalysisViewProps {
  records: HealthRecord[];
}

export function RiskAnalysisView({ records }: RiskAnalysisViewProps) {
  const total = records.length || 1;

  // 1. Overall Risk Level breakdown
  const riskLow = records.filter((r) => r.riskLevel === 'ต่ำ').length;
  const riskMed = records.filter((r) => r.riskLevel === 'ปานกลาง').length;
  const riskHigh = records.filter((r) => r.riskLevel === 'สูง').length;

  const riskData = [
    { name: 'ความเสี่ยงต่ำ', value: riskLow, color: '#6EE7B7', bg: 'bg-emerald-50', text: 'text-emerald-800' },
    { name: 'ความเสี่ยงปานกลาง', value: riskMed, color: '#FCD34D', bg: 'bg-amber-50', text: 'text-amber-900' },
    { name: 'ความเสี่ยงสูง', value: riskHigh, color: '#FDA4AF', bg: 'bg-rose-50', text: 'text-rose-900' },
  ];

  // 2. Diabetes & Hypertension Screening risk
  const diabetesRisk = records.filter((r) => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง').length;
  const diabetesNormal = records.filter((r) => r.diabetesScreening === 'ไม่มี').length;

  const htRisk = records.filter((r) => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง').length;
  const htNormal = records.filter((r) => r.hypertensionScreening === 'ไม่มี').length;

  const screeningData = [
    {
      category: 'คัดกรองเบาหวาน',
      'มีแนวโน้ม/เสี่ยง': diabetesRisk,
      'ปกติ/ไม่มี': diabetesNormal,
    },
    {
      category: 'คัดกรองความดันสูง',
      'มีแนวโน้ม/เสี่ยง': htRisk,
      'ปกติ/ไม่มี': htNormal,
    },
  ];

  // 3. Risk Score Distribution (0-7 points)
  const scoreMap: { [score: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  records.forEach((r) => {
    const s = Math.round(r.riskScore);
    if (scoreMap[s] !== undefined) scoreMap[s]++;
  });

  const scoreData = Object.keys(scoreMap).map((k) => ({
    score: `${k} คะแนน`,
    count: scoreMap[Number(k)],
  }));

  // 4. BMI Category Risk Breakdown
  const bmiUnder = records.filter((r) => r.bmi < 18.5).length;
  const bmiNormal = records.filter((r) => r.bmi >= 18.5 && r.bmi < 23).length;
  const bmiOver = records.filter((r) => r.bmi >= 23 && r.bmi < 25).length;
  const bmiObese1 = records.filter((r) => r.bmi >= 25 && r.bmi < 30).length;
  const bmiObese2 = records.filter((r) => r.bmi >= 30).length;

  const bmiData = [
    { category: 'น้ำหนักน้อย (<18.5)', count: bmiUnder, color: '#93C5FD' },
    { category: 'สมส่วน (18.5-22.9)', count: bmiNormal, color: '#6EE7B7' },
    { category: 'น้ำหนักเกิน (23-24.9)', count: bmiOver, color: '#FDE047' },
    { category: 'อ้วนระดับ 1 (25-29.9)', count: bmiObese1, color: '#FDBA74' },
    { category: 'อ้วนอันตราย (≥30)', count: bmiObese2, color: '#FDA4AF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span>การวิเคราะห์ความเสี่ยงด้านสุขภาพ (Health Risk Stratification)</span>
          </h2>
          <p className="text-xs text-slate-600">
            วิเคราะห์ 4 ฟิลด์หลัก: ระดับความเสี่ยงรวม, คัดกรองเบาหวาน, คัดกรองความดันโลหิตสูง, และการกระจายของคะแนนความเสี่ยง
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Donut Chart - Overall Risk Level */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">1. ระดับความเสี่ยงสุขภาพรวม (Risk Level)</h3>
              <span className="text-[11px] text-slate-600">สัดส่วนผู้รับการคัดกรองตามระดับความรุนแรง</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Field 1
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} คน (${Math.round(((value as number) / total) * 100)}%)`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-50">
            {riskData.map((item) => (
              <div key={item.name} className={`p-2.5 rounded-xl ${item.bg} text-center`}>
                <div className="text-[11px] font-medium text-slate-600">{item.name}</div>
                <div className={`text-lg font-black ${item.text}`}>{item.value} คน</div>
                <div className="text-[10px] text-slate-600">
                  {Math.round((item.value / total) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Diabetes & Hypertension Risk */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">2. คัดกรองเบาหวาน & ความดันโลหิตสูง</h3>
              <span className="text-[11px] text-slate-600">เปรียบเทียบสัดส่วนกลุ่มเสี่ยงและกลุ่มปกติ</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900">
              Fields 2 & 3
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screeningData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, '']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="มีแนวโน้ม/เสี่ยง" fill="#FDA4AF" radius={[0, 6, 6, 0]} name="มีแนวโน้ม/เสี่ยง" />
                <Bar dataKey="ปกติ/ไม่มี" fill="#6EE7B7" radius={[0, 6, 6, 0]} name="ปกติ (ไม่มีความเสี่ยง)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100/80 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>เสี่ยงเบาหวาน: <strong>{diabetesRisk} คน</strong> ({Math.round((diabetesRisk / total) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>เสี่ยงความดัน: <strong>{htRisk} คน</strong> ({Math.round((htRisk / total) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Risk Score Distribution (0-7 points) */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">3. การกระจายของคะแนนความเสี่ยง (Risk Score 0-7)</h3>
              <span className="text-[11px] text-slate-600">วิเคราะห์จำนวนผู้มีคะแนนความเสี่ยงตามมาตรวัด</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Field 4
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="score" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Bar dataKey="count" fill="#C4B5FD" radius={[6, 6, 0, 0]} name="จำนวนคน" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-purple-50 flex items-center justify-between">
            <span>เกณฑ์: 0-1 คะแนน (ต่ำ), 2-3 คะแนน (ปานกลาง), ≥4 คะแนน (สูง)</span>
            <span className="font-semibold text-purple-900">
              กลุ่มคะแนน ≥4: {records.filter((r) => r.riskScore >= 4).length} คน
            </span>
          </div>
        </div>

        {/* Chart 4: BMI Clinical Risk Classification */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">4. ภาวะน้ำหนักและดัชนีมวลกาย (BMI Risk Category)</h3>
              <span className="text-[11px] text-slate-600">การจำแนกตามเกณฑ์มาตรฐานเอเชียแปซิฟิก (WHO Asia-Pacific)</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
              BMI Field
            </span>
          </div>

          <div className="space-y-3 my-auto py-2">
            {bmiData.map((item) => {
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{item.category}</span>
                    <span className="font-bold text-slate-800">
                      {item.count} คน ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              กลุ่มน้ำหนักเกินและอ้วน (BMI ≥ 23) รวมทั้งสิ้น{' '}
              <strong>{bmiOver + bmiObese1 + bmiObese2} คน ({Math.round(((bmiOver + bmiObese1 + bmiObese2) / total) * 100)}%)</strong> ซึ่งเป็นปัจจัยเสี่ยงหลักของโรคเบาหวานและความดันโลหิตสูง
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
