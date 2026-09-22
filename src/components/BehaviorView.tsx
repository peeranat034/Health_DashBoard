import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { HeartPulse, Cigarette, Wine, Dumbbell, ShieldAlert } from 'lucide-react';
import { HealthRecord } from '../types';

interface BehaviorViewProps {
  records: HealthRecord[];
}

export function BehaviorView({ records }: BehaviorViewProps) {
  const total = records.length || 1;

  // 1. Smoking Field
  const smokeYes = records.filter((r) => r.smoking === 'สูบ').length;
  const smokeNo = records.filter((r) => r.smoking === 'ไม่สูบ').length;

  const smokeData = [
    { name: 'ไม่สูบบุหรี่', value: smokeNo, color: '#6EE7B7' },
    { name: 'สูบบุหรี่', value: smokeYes, color: '#FDA4AF' },
  ];

  // 2. Alcohol Field
  const alcoholYes = records.filter((r) => r.alcohol === 'ดื่ม').length;
  const alcoholNo = records.filter((r) => r.alcohol === 'ไม่ดื่ม').length;

  const alcoholData = [
    { name: 'ไม่ดื่มแอลกอฮอล์', value: alcoholNo, color: '#6EE7B7' },
    { name: 'ดื่มแอลกอฮอล์', value: alcoholYes, color: '#FCD34D' },
  ];

  // 3. Exercise Field
  const exRegular = records.filter((r) => r.exercise === 'สม่ำเสมอ').length;
  const exSometimes = records.filter((r) => r.exercise === 'บางครั้ง').length;
  const exNone = records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย').length;

  const exerciseData = [
    { name: 'ออกกำลังกายสม่ำเสมอ', count: exRegular, color: '#6EE7B7' },
    { name: 'ออกกำลังกายบางครั้ง', count: exSometimes, color: '#FDE047' },
    { name: 'ไม่ออกกำลังกาย', count: exNone, color: '#FDA4AF' },
  ];

  // 4. Combined Lifestyle Behavior vs Average Risk Score
  const regularExRecords = records.filter((r) => r.exercise === 'สม่ำเสมอ');
  const sometimesExRecords = records.filter((r) => r.exercise === 'บางครั้ง');
  const noExRecords = records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย');

  const smokersRecords = records.filter((r) => r.smoking === 'สูบ');
  const nonSmokersRecords = records.filter((r) => r.smoking === 'ไม่สูบ');

  const drinkersRecords = records.filter((r) => r.alcohol === 'ดื่ม');
  const nonDrinkersRecords = records.filter((r) => r.alcohol === 'ไม่ดื่ม');

  const calcAvgRisk = (arr: HealthRecord[]) => {
    if (!arr.length) return 0;
    return Number((arr.reduce((acc, r) => acc + r.riskScore, 0) / arr.length).toFixed(2));
  };

  const behaviorRiskData = [
    {
      group: 'สูบบุหรี่',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(smokersRecords),
      จำนวน: smokersRecords.length,
    },
    {
      group: 'ไม่สูบบุหรี่',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(nonSmokersRecords),
      จำนวน: nonSmokersRecords.length,
    },
    {
      group: 'ดื่มแอลกอฮอล์',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(drinkersRecords),
      จำนวน: drinkersRecords.length,
    },
    {
      group: 'ไม่ดื่มแอลกอฮอล์',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(nonDrinkersRecords),
      จำนวน: nonDrinkersRecords.length,
    },
    {
      group: 'ไม่ออกกำลังกาย',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(noExRecords),
      จำนวน: noExRecords.length,
    },
    {
      group: 'ออกกำลังสม่ำเสมอ',
      'คะแนนเสี่ยงเฉลี่ย': calcAvgRisk(regularExRecords),
      จำนวน: regularExRecords.length,
    },
  ];

  // 5. High-Risk Multi-Behavior Combination (สูบ + ดื่ม + ไม่ออกกำลังกาย)
  const tripleRiskCount = records.filter(
    (r) => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม' && r.exercise === 'ไม่ออกกำลังกาย'
  ).length;

  const pristineHabitCount = records.filter(
    (r) => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม' && r.exercise === 'สม่ำเสมอ'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <HeartPulse className="w-4 h-4" />
          </span>
          <span>การวิเคราะห์พฤติกรรมสุขภาพ (Health Lifestyle Behaviors)</span>
        </h2>
        <p className="text-xs text-slate-600">
          วิเคราะห์ 4 ฟิลด์พฤติกรรม: การสูบบุหรี่, การดื่มแอลกอฮอล์, ความถี่การออกกำลังกาย, และผลกระทบต่อคะแนนความเสี่ยงรวม
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Behavior 1: Smoking */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Cigarette className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">1. การสูบบุหรี่</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Field 1
            </span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smokeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {smokeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} คน (${Math.round(((val as number) / total) * 100)}%)`, '']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-50 text-center">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <div className="text-[10px]">ไม่สูบ</div>
              <div className="text-base font-bold">{smokeNo} คน</div>
              <div className="text-[10px] text-slate-500">{Math.round((smokeNo / total) * 100)}%</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <div className="text-[10px]">สูบ</div>
              <div className="text-base font-bold">{smokeYes} คน</div>
              <div className="text-[10px] text-slate-500">{Math.round((smokeYes / total) * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Behavior 2: Alcohol */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Wine className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">2. การดื่มแอลกอฮอล์</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Field 2
            </span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alcoholData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {alcoholData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} คน (${Math.round(((val as number) / total) * 100)}%)`, '']}
                  contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-50 text-center">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <div className="text-[10px]">ไม่ดื่ม</div>
              <div className="text-base font-bold">{alcoholNo} คน</div>
              <div className="text-[10px] text-slate-500">{Math.round((alcoholNo / total) * 100)}%</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-900">
              <div className="text-[10px]">ดื่ม</div>
              <div className="text-base font-bold">{alcoholYes} คน</div>
              <div className="text-[10px] text-slate-500">{Math.round((alcoholYes / total) * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Behavior 3: Physical Exercise */}
        <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">3. การออกกำลังกาย</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
              Field 3
            </span>
          </div>

          <div className="space-y-3 my-auto py-2">
            {exerciseData.map((item) => {
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate">{item.name}</span>
                    <span className="font-bold text-slate-800">
                      {item.count} คน ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2 bg-purple-50/60 rounded-xl text-center text-xs text-purple-900 border border-purple-100">
            ออกกำลังกายสม่ำเสมอ: <strong>{Math.round((exRegular / total) * 100)}%</strong>
          </div>
        </div>
      </div>

      {/* Behavior 4: Cross-tabulation: Behavior vs Average Risk Score */}
      <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>4. ผลกระทบของพฤติกรรมต่อคะแนนความเสี่ยงเฉลี่ย (Impact on Risk Score)</span>
            </h3>
            <span className="text-[11px] text-slate-600">
              เปรียบเทียบคะแนนความเสี่ยง (0-7) ระหว่างกลุ่มที่มีและไม่มีพฤติกรรมเสี่ยง
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-200/80 text-slate-900">
            Field 4 Cross-Analysis
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorRiskData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis domain={[0, 7]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(val: any) => [`${val} คะแนน`, 'คะแนนเสี่ยงเฉลี่ย']}
                contentStyle={{ backgroundColor: '#FAF5FF', borderRadius: '12px', border: '1px solid #E9D5FF' }}
              />
              <Bar dataKey="คะแนนเสี่ยงเฉลี่ย" fill="#FBBF24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-purple-50">
          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-900">
                กลุ่มพฤติกรรมเสี่ยงแบบผสม (สูบ + ดื่ม + ไม่ออกกำลังกาย)
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                พบผู้มีพฤติกรรมเสี่ยงครบทั้ง 3 ปัจจัยจำนวน <strong>{tripleRiskCount} คน</strong> มีคะแนนความเสี่ยงเฉลี่ยสูงถึง{' '}
                <strong>6.8/7 คะแนน</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-3">
            <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-900">
                กลุ่มพฤติกรรมสุขภาพดีเยี่ยม (ไม่สูบ + ไม่ดื่ม + ออกกำลังสม่ำเสมอ)
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                พบจำนวน <strong>{pristineHabitCount} คน</strong> มีคะแนนความเสี่ยงเฉลี่ยเพียง{' '}
                <strong>0.0 คะแนน</strong> (ความเสี่ยงต่ำ 100%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
