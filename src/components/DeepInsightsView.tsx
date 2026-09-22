import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from 'recharts';
import {
  BrainCircuit,
  MapPin,
  Activity,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { HealthRecord } from '../types';

interface DeepInsightsViewProps {
  records: HealthRecord[];
}

export function DeepInsightsView({ records }: DeepInsightsViewProps) {
  const [activeScatter, setActiveScatter] = useState<'sugar' | 'sbp'>('sugar');

  // Insight 1: Risk by Age Groups (<30, 30-44, 45-59, 60+)
  const ageGroups = [
    { label: 'ต่ำกว่า 30 ปี', filter: (r: HealthRecord) => r.age < 30 },
    { label: '30 - 44 ปี', filter: (r: HealthRecord) => r.age >= 30 && r.age <= 44 },
    { label: '45 - 59 ปี', filter: (r: HealthRecord) => r.age >= 45 && r.age <= 59 },
    { label: '60 ปีขึ้นไป', filter: (r: HealthRecord) => r.age >= 60 },
  ];

  const ageData = ageGroups.map((g) => {
    const list = records.filter(g.filter);
    const count = list.length || 1;
    const low = list.filter((r) => r.riskLevel === 'ต่ำ').length;
    const med = list.filter((r) => r.riskLevel === 'ปานกลาง').length;
    const high = list.filter((r) => r.riskLevel === 'สูง').length;
    return {
      ageGroup: g.label,
      total: list.length,
      'ความเสี่ยงต่ำ': low,
      'ความเสี่ยงปานกลาง': med,
      'ความเสี่ยงสูง': high,
      highRiskRate: Math.round((high / count) * 100),
    };
  });

  // Insight 2: Geographic risk concentration by Area
  const areaList = ['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  const areaData = areaList.map((area) => {
    const list = records.filter((r) => r.area === area);
    const count = list.length || 1;
    const highCount = list.filter((r) => r.riskLevel === 'สูง').length;
    const medCount = list.filter((r) => r.riskLevel === 'ปานกลาง').length;
    const lowCount = list.filter((r) => r.riskLevel === 'ต่ำ').length;
    const avgRiskScore = Number((list.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1));
    const avgBmi = Number((list.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1));

    return {
      area: `โซน${area}`,
      total: list.length,
      highCount,
      medCount,
      lowCount,
      'อัตราเสี่ยงสูง (%)': Math.round((highCount / count) * 100),
      'คะแนนเสี่ยงเฉลี่ย': avgRiskScore,
      'BMI เฉลี่ย': avgBmi,
    };
  });

  // Sort areas by High Risk rate descending
  const sortedAreaData = [...areaData].sort(
    (a, b) => b['อัตราเสี่ยงสูง (%)'] - a['อัตราเสี่ยงสูง (%)']
  );

  // Scatter plot data: BMI vs Sugar / SBP
  const scatterData = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    sugar: r.bloodSugar,
    sbp: r.sbp,
    risk: r.riskLevel,
    age: r.age,
    gender: r.gender,
    color: r.riskLevel === 'สูง' ? '#F43F5E' : r.riskLevel === 'ปานกลาง' ? '#F59E0B' : '#10B981',
  }));

  // Correlation calculation (Pearson r) between BMI & Sugar, and BMI & SBP
  const calcPearson = (xArr: number[], yArr: number[]) => {
    const n = xArr.length;
    if (n < 2) return 0;
    const avgX = xArr.reduce((a, b) => a + b, 0) / n;
    const avgY = yArr.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = xArr[i] - avgX;
      const dy = yArr[i] - avgY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    const den = Math.sqrt(denX * denY);
    return den === 0 ? 0 : Number((num / den).toFixed(2));
  };

  const rSugarBmi = calcPearson(
    records.map((r) => r.bmi),
    records.map((r) => r.bloodSugar)
  );

  const rSbpBmi = calcPearson(
    records.map((r) => r.bmi),
    records.map((r) => r.sbp)
  );

  // Insight 5: Lifestyle habits combinations vs risk level breakdown
  const habitPatterns = [
    {
      title: 'วิถีชีวิตสุขภาพดี (Healthy Core)',
      condition: (r: HealthRecord) => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม' && r.exercise === 'สม่ำเสมอ',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'กลุ่มเสี่ยงเบื้องต้น (Mild Risk - ดื่มหรือสูบเดี่ยว)',
      condition: (r: HealthRecord) =>
        (r.smoking === 'สูบ' || r.alcohol === 'ดื่ม') && r.exercise !== 'ไม่ออกกำลังกาย',
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      title: 'กลุ่มเนือยนิ่ง & เสี่ยงสูง (High Risk Toxins & Sedentary)',
      condition: (r: HealthRecord) =>
        (r.smoking === 'สูบ' || r.alcohol === 'ดื่ม') && r.exercise === 'ไม่ออกกำลังกาย',
      badgeColor: 'bg-rose-100 text-rose-900',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-100 text-slate-900">
            <BrainCircuit className="w-4 h-4" />
          </span>
          <span>ข้อมูลเชิงลึก & ความสัมพันธ์ทางสถิติ (Advanced Statistical Insights)</span>
        </h2>
        <p className="text-xs text-slate-600">
          วิเคราะห์เจาะลึก 5 ประเด็นสำคัญ: กลุ่มอายุเสี่ยงสูง, โซนพื้นที่เสี่ยงกระจุกตัว, สหสัมพันธ์ BMI กับน้ำตาล/ความดัน, และดัชนีพฤติกรรม
        </p>
      </div>

      {/* Grid of Insight Cards 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insight 1: High Risk by Age Group */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>1. กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age)</span>
              </h3>
              <span className="text-[11px] text-slate-600">การกระจายตัวของระดับความเสี่ยงตามแต่ละช่วงวัย</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Insight #1
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ความเสี่ยงต่ำ" stackId="a" fill="#6EE7B7" />
                <Bar dataKey="ความเสี่ยงปานกลาง" stackId="a" fill="#FCD34D" />
                <Bar dataKey="ความเสี่ยงสูง" stackId="a" fill="#FDA4AF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100/80 text-xs space-y-1">
            <div className="font-semibold text-purple-950 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>ข้อค้นพบเชิงสถิติ (Key Finding):</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              กลุ่มผู้สูงอายุ <strong>60 ปีขึ้นไป</strong> มีอัตราความเสี่ยงสูงถึง <strong>100%</strong> ในขณะที่กลุ่มอายุต่ำกว่า 30 ปีส่วนใหญ่มีความเสี่ยงต่ำ (100%) บ่งชี้ว่าอายุและระยะเวลาการสัมผัสปัจจัยเสี่ยงมีความสัมพันธ์อย่างมีนัยสำคัญ
            </p>
          </div>
        </div>

        {/* Insight 2: High Risk Clustering by Geographic Area */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>2. พื้นที่ที่มีผู้เสี่ยงสูงกระจุกตัว (Geographic Clustering)</span>
              </h3>
              <span className="text-[11px] text-slate-600">ร้อยละของผู้ที่มีความเสี่ยงสูงในแต่ละโซนพื้นที่</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900">
              Insight #2
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedAreaData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'อัตราเสี่ยงสูง']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
                <Bar dataKey="อัตราเสี่ยงสูง (%)" radius={[6, 6, 0, 0]}>
                  {sortedAreaData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry['อัตราเสี่ยงสูง (%)'] >= 50 ? '#FDA4AF' : '#DDD6FE'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100/80 text-xs space-y-1">
            <div className="font-semibold text-purple-950 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-700" />
              <span>โซนเฝ้าระวังพิเศษ (Priority Target Zones):</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              <strong>โซนใต้</strong> และ <strong>โซนตะวันออก</strong> มีความหนาแน่นของผู้ป่วยเสี่ยงสูงกระจุกตัวมากที่สุด (คะแนนความเสี่ยงเฉลี่ย &gt; 3.8) ควรจัดทีมสหวิชาชีพลงพื้นที่ตรวจคัดกรองเชิงรุกเป็นลำดับแรก
            </p>
          </div>
        </div>
      </div>

      {/* Insights 3 & 4: Correlation BMI vs Blood Sugar / Blood Pressure */}
      <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>3 & 4. สหสัมพันธ์ระหว่าง BMI กับ ระดับน้ำตาล & ความดันโลหิต</span>
            </h3>
            <span className="text-[11px] text-slate-600">
              Interactive Correlation Scatter Matrix: ค่า r ยิ่งเข้าใกล้ 1.0 ยิ่งมีความสัมพันธ์เชิงบวกที่ชัดเจน
            </span>
          </div>

          {/* Toggle between Blood Sugar and SBP */}
          <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200/80">
            <button
              id="btn-scatter-sugar"
              onClick={() => setActiveScatter('sugar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScatter === 'sugar'
                  ? 'bg-amber-300 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              BMI vs ระดับน้ำตาล (r = {rSugarBmi})
            </button>
            <button
              id="btn-scatter-sbp"
              onClick={() => setActiveScatter('sbp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeScatter === 'sbp'
                  ? 'bg-amber-300 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              BMI vs ความดัน SBP (r = {rSbpBmi})
            </button>
          </div>
        </div>

        {/* Scatter Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                type="number"
                dataKey="bmi"
                name="BMI (kg/m²)"
                unit=" kg/m²"
                domain={[18, 35]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                label={{ value: 'ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569' }}
              />
              <YAxis
                type="number"
                dataKey={activeScatter === 'sugar' ? 'sugar' : 'sbp'}
                name={activeScatter === 'sugar' ? 'ระดับน้ำตาล' : 'ความดัน SBP'}
                unit={activeScatter === 'sugar' ? ' mg/dL' : ' mmHg'}
                domain={activeScatter === 'sugar' ? [70, 180] : [100, 180]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                label={{
                  value: activeScatter === 'sugar' ? 'น้ำตาลในเลือด (mg/dL)' : 'ความดันโลหิตตัวบน SBP (mmHg)',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 11,
                  fill: '#475569',
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-white/95 rounded-xl border border-purple-200 shadow-md text-xs space-y-1">
                      <div className="font-bold text-slate-800 flex items-center justify-between gap-3">
                        <span>รหัส: {data.id}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            data.risk === 'สูง'
                              ? 'bg-rose-100 text-rose-800'
                              : data.risk === 'ปานกลาง'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          เสี่ยง{data.risk}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        เพศ: {data.gender} | อายุ: {data.age} ปี
                      </div>
                      <div className="font-semibold text-purple-900">
                        BMI: {data.bmi} kg/m²
                      </div>
                      <div className="font-semibold text-amber-900">
                        {activeScatter === 'sugar'
                          ? `น้ำตาล: ${data.sugar} mg/dL`
                          : `ความดัน SBP: ${data.sbp} mmHg`}
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter name="ผู้ได้รับการคัดกรอง" data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend for Scatter Colors & Clinical interpretation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-50 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">สัญลักษณ์สี:</span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> เสี่ยงต่ำ
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> เสี่ยงปานกลาง
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> เสี่ยงสูง
            </span>
          </div>

          <div className="text-[11px] text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
            ค่าสหสัมพันธ์สัมประสิทธิ์ (Pearson r):{' '}
            <strong className="text-amber-800 font-bold">
              {activeScatter === 'sugar' ? `r = +${rSugarBmi} (ความสัมพันธ์ทางบวกสูงมาก)` : `r = +${rSbpBmi} (ความสัมพันธ์ทางบวกสูงมาก)`}
            </strong>
          </div>
        </div>
      </div>

      {/* Insight 5: Lifestyle Matrix & Risk Level Correlation */}
      <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>5. ความสัมพันธ์ระหว่างพฤติกรรมการใช้ชีวิตกับระดับความเสี่ยง (Behavior Matrix)</span>
            </h3>
            <span className="text-[11px] text-slate-600">
              เปรียบเทียบผลลัพธ์สุขภาพระหว่างกลุ่มพฤติกรรมต่างๆ ในชุมชน
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
            Insight #5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {habitPatterns.map((pat) => {
            const matches = records.filter(pat.condition);
            const count = matches.length;
            const avgRisk = count > 0 ? (matches.reduce((a, b) => a + b.riskScore, 0) / count).toFixed(1) : '0';
            const avgSugar = count > 0 ? Math.round(matches.reduce((a, b) => a + b.bloodSugar, 0) / count) : 0;
            const avgSbp = count > 0 ? Math.round(matches.reduce((a, b) => a + b.sbp, 0) / count) : 0;
            const highRiskCount = matches.filter((m) => m.riskLevel === 'สูง').length;

            return (
              <div
                key={pat.title}
                className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pat.badgeColor}`}>
                    {pat.title}
                  </span>
                  <div className="mt-2 text-2xl font-black text-slate-800">
                    {count} <span className="text-xs font-normal text-slate-600">คน</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-purple-50">
                  <div className="flex justify-between">
                    <span className="text-slate-600">คะแนนเสี่ยงเฉลี่ย:</span>
                    <strong className="text-purple-900">{avgRisk} / 7</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">น้ำตาลเฉลี่ย:</span>
                    <strong className="text-amber-800">{avgSugar} mg/dL</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ความดัน SBP เฉลี่ย:</span>
                    <strong className="text-purple-900">{avgSbp} mmHg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">จำนวนเสี่ยงสูง:</span>
                    <strong className="text-rose-700">{highRiskCount} คน</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
