export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่: เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้
  gender: 'หญิง' | 'ชาย' | string;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  sbp: number; // SBP mmHg
  dbp: number; // DBP mmHg
  pulse: number; // ชีพจร bpm
  bloodSugar: number; // น้ำตาล mg/dL
  smoking: 'สูบ' | 'ไม่สูบ' | string;
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string;
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string;
  diabetesScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  hypertensionScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;
  riskScore: number;
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string;
  month: string; // เช่น 2026-01
}

export interface FilterState {
  area: string;
  gender: string;
  riskLevel: string;
  ageGroup: string; // all, <30, 30-44, 45-59, 60+
  exercise: string;
  smoking: string;
  alcohol: string;
  diabetesStatus: string;
  hypertensionStatus: string;
  searchQuery: string;
}

export interface KPIStats {
  totalCount: number;
  avgBmi: number;
  avgBloodSugar: number;
  avgSbp: number;
  avgDbp: number;
  avgPulse: number;
  avgAge: number;
  avgRiskScore: number;
  minBloodSugar: number;
  maxBloodSugar: number;
  minSbp: number;
  maxSbp: number;
  minBmi: number;
  maxBmi: number;
  minAge: number;
  maxAge: number;
  highRiskCount: number;
  highRiskPercentage: number;
  overweightCount: number;
  overweightPercentage: number;
  diabetesRiskCount: number;
  diabetesRiskPercentage: number;
  hypertensionRiskCount: number;
  hypertensionRiskPercentage: number;
}
