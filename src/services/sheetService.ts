import { HealthRecord, KPIStats } from '../types';

// Google Sheet configuration (kept server/service level without leaking raw URL into UI)
const SHEET_ID = '11c_yid9NRK0vISMRlxbfDaz2wDw0MUKBOql70qEo1CU';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

// Helper: robust CSV line parser handling quotes
function parseCSVRow(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

export async function fetchHealthRecords(): Promise<{ records: HealthRecord[]; fetchedAt: Date }> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${CSV_URL}&_nocache=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      throw new Error('No data rows found in Google Sheet');
    }

    const records: HealthRecord[] = [];

    // Parse header to find index mapping if possible, or fallback to fixed indexes
    // "รหัสบุคคล","วันที่คัดกรอง","พื้นที่","เพศ","อายุ","ส่วนสูง_cm","น้ำหนัก_kg","BMI","SBP_mmHg","DBP_mmHg","ชีพจร_bpm","น้ำตาล_mg_dL","สูบบุหรี่","ดื่มแอลกอฮอล์","การออกกำลังกาย","เบาหวาน_คัดกรอง","ความดันโลหิตสูง_คัดกรอง","คะแนนความเสี่ยง","ระดับความเสี่ยง","เดือน"
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVRow(lines[i]);
      if (!cols[0] || cols[0].length === 0) continue;

      const record: HealthRecord = {
        id: cols[0].replace(/^"+|"+$/g, ''),
        screeningDate: (cols[1] || '').replace(/^"+|"+$/g, ''),
        area: (cols[2] || '').replace(/^"+|"+$/g, ''),
        gender: (cols[3] || '').replace(/^"+|"+$/g, ''),
        age: parseFloat(cols[4]) || 0,
        heightCm: parseFloat(cols[5]) || 0,
        weightKg: parseFloat(cols[6]) || 0,
        bmi: parseFloat(cols[7]) || 0,
        sbp: parseFloat(cols[8]) || 0,
        dbp: parseFloat(cols[9]) || 0,
        pulse: parseFloat(cols[10]) || 0,
        bloodSugar: parseFloat(cols[11]) || 0,
        smoking: (cols[12] || '').replace(/^"+|"+$/g, ''),
        alcohol: (cols[13] || '').replace(/^"+|"+$/g, ''),
        exercise: (cols[14] || '').replace(/^"+|"+$/g, ''),
        diabetesScreening: (cols[15] || '').replace(/^"+|"+$/g, ''),
        hypertensionScreening: (cols[16] || '').replace(/^"+|"+$/g, ''),
        riskScore: parseFloat(cols[17]) || 0,
        riskLevel: (cols[18] || '').replace(/^"+|"+$/g, ''),
        month: (cols[19] || '').replace(/^"+|"+$/g, ''),
      };

      records.push(record);
    }

    // Cache locally as backup
    try {
      localStorage.setItem('vita_pulse_cache', JSON.stringify(records));
      localStorage.setItem('vita_pulse_cached_at', new Date().toISOString());
    } catch {
      // ignore storage error
    }

    return { records, fetchedAt: new Date() };
  } catch (err) {
    console.warn('Network fetch error, checking local fallback cache:', err);
    const cached = localStorage.getItem('vita_pulse_cache');
    if (cached) {
      const records: HealthRecord[] = JSON.parse(cached);
      const cachedAt = localStorage.getItem('vita_pulse_cached_at')
        ? new Date(localStorage.getItem('vita_pulse_cached_at')!)
        : new Date();
      return { records, fetchedAt: cachedAt };
    }
    throw err;
  }
}

export function calculateKPIStats(records: HealthRecord[]): KPIStats {
  if (records.length === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      avgBloodSugar: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgPulse: 0,
      avgAge: 0,
      avgRiskScore: 0,
      minBloodSugar: 0,
      maxBloodSugar: 0,
      minSbp: 0,
      maxSbp: 0,
      minBmi: 0,
      maxBmi: 0,
      minAge: 0,
      maxAge: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
      overweightCount: 0,
      overweightPercentage: 0,
      diabetesRiskCount: 0,
      diabetesRiskPercentage: 0,
      hypertensionRiskCount: 0,
      hypertensionRiskPercentage: 0,
    };
  }

  const total = records.length;
  const sumBmi = records.reduce((acc, r) => acc + r.bmi, 0);
  const sumBloodSugar = records.reduce((acc, r) => acc + r.bloodSugar, 0);
  const sumSbp = records.reduce((acc, r) => acc + r.sbp, 0);
  const sumDbp = records.reduce((acc, r) => acc + r.dbp, 0);
  const sumPulse = records.reduce((acc, r) => acc + r.pulse, 0);
  const sumAge = records.reduce((acc, r) => acc + r.age, 0);
  const sumRiskScore = records.reduce((acc, r) => acc + r.riskScore, 0);

  const bloodSugars = records.map((r) => r.bloodSugar);
  const sbps = records.map((r) => r.sbp);
  const bmis = records.map((r) => r.bmi);
  const ages = records.map((r) => r.age);

  const highRiskCount = records.filter((r) => r.riskLevel === 'สูง').length;
  const overweightCount = records.filter((r) => r.bmi >= 25).length;
  const diabetesRiskCount = records.filter((r) => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionRiskCount = records.filter(
    (r) => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง'
  ).length;

  return {
    totalCount: total,
    avgBmi: Number((sumBmi / total).toFixed(1)),
    avgBloodSugar: Number((sumBloodSugar / total).toFixed(1)),
    avgSbp: Number((sumSbp / total).toFixed(1)),
    avgDbp: Number((sumDbp / total).toFixed(1)),
    avgPulse: Number((sumPulse / total).toFixed(1)),
    avgAge: Number((sumAge / total).toFixed(1)),
    avgRiskScore: Number((sumRiskScore / total).toFixed(1)),
    minBloodSugar: Math.min(...bloodSugars),
    maxBloodSugar: Math.max(...bloodSugars),
    minSbp: Math.min(...sbps),
    maxSbp: Math.max(...sbps),
    minBmi: Math.min(...bmis),
    maxBmi: Math.max(...bmis),
    minAge: Math.min(...ages),
    maxAge: Math.max(...ages),
    highRiskCount,
    highRiskPercentage: Number(((highRiskCount / total) * 100).toFixed(1)),
    overweightCount,
    overweightPercentage: Number(((overweightCount / total) * 100).toFixed(1)),
    diabetesRiskCount,
    diabetesRiskPercentage: Number(((diabetesRiskCount / total) * 100).toFixed(1)),
    hypertensionRiskCount,
    hypertensionRiskPercentage: Number(((hypertensionRiskCount / total) * 100).toFixed(1)),
  };
}
