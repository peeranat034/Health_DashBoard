import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { HealthRecord } from '../types';

interface DataTableViewProps {
  records: HealthRecord[];
}

type SortField = 'id' | 'screeningDate' | 'age' | 'bmi' | 'bloodSugar' | 'sbp' | 'riskScore';

export function DataTableView({ records }: DataTableViewProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [filterHighlightOnly, setFilterHighlightOnly] = useState<boolean>(false);

  const pageSize = 10;

  // Toggle or change sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter for abnormal highlight if user toggles "เฉพาะค่าผิดปกติ"
  const filteredList = useMemo(() => {
    if (!filterHighlightOnly) return records;
    return records.filter((r) => r.bloodSugar >= 126 || r.sbp >= 140 || r.bmi >= 25 || r.riskLevel === 'สูง');
  }, [records, filterHighlightOnly]);

  // Sorted list
  const sortedRecords = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [filteredList, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Export filtered CSV (client-side export without revealing Google Sheet raw URL, strictly PDPA compliant)
  const handleExportCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'BMI',
      'SBP',
      'DBP',
      'น้ำตาล',
      'สูบบุหรี่',
      'ดื่มสุรา',
      'ออกกำลังกาย',
      'ระดับความเสี่ยง',
    ];
    const rows = sortedRecords.map((r) => [
      r.id,
      r.screeningDate,
      r.area,
      r.gender,
      r.age,
      r.bmi,
      r.sbp,
      r.dbp,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.riskLevel,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VitaPulse_Health_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper formatting styles
  const getSugarBadge = (val: number) => {
    if (val >= 126) {
      return 'bg-rose-100 text-rose-800 border-rose-300 font-bold'; // Diabetes threshold
    }
    if (val >= 100) {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'; // Pre-diabetes
    }
    return 'bg-emerald-50 text-emerald-800 border-emerald-200'; // Normal
  };

  const getSbpBadge = (val: number) => {
    if (val >= 140) {
      return 'bg-rose-100 text-rose-800 border-rose-300 font-bold'; // Hypertension
    }
    if (val >= 120) {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'; // Pre-HTN
    }
    return 'bg-emerald-50 text-emerald-800 border-emerald-200'; // Normal
  };

  const getBmiBadge = (val: number) => {
    if (val >= 30) return 'bg-rose-100 text-rose-800 border-rose-300 font-bold'; // Obese II
    if (val >= 25) return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'; // Obese I
    if (val >= 23) return 'bg-yellow-100 text-yellow-900 border-yellow-200'; // Overweight
    if (val < 18.5) return 'bg-sky-100 text-sky-800 border-sky-200'; // Underweight
    return 'bg-emerald-50 text-emerald-800 border-emerald-200'; // Normal
  };

  const getRiskBadge = (level: string) => {
    if (level === 'สูง') return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    if (level === 'ปานกลาง') return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="space-y-4">
      {/* Header controls for data table */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-4 rounded-2xl border border-purple-100/90 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>ตารางข้อมูลคัดกรองรายบุคคลเชิงลึก (Clinical Detail View)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-normal">
              {filteredList.length} รายการ
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            ระบบจัดรูปแบบตามเงื่อนไข (Conditional Formatting): ไฮไลต์สีแดง-ส้มเน้นย้ำผู้มีค่าน้ำตาล, ความดัน, หรือ BMI เกินเกณฑ์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Highlight Only */}
          <button
            onClick={() => setFilterHighlightOnly(!filterHighlightOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterHighlightOnly
                ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs'
                : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-50'
            }`}
          >
            {filterHighlightOnly ? '● กำลังกรองเฉพาะค่าผิดปกติ' : 'ดูเฉพาะเคสผิดปกติ (Highlight)'}
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="ส่งออกข้อมูลเป็น CSV ปลอดภัยตาม PDPA"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ส่งออกตาราง (Export)</span>
          </button>
        </div>
      </div>

      {/* Legend for Conditional Formatting */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-slate-600">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>เกณฑ์สี Conditional Formatting:</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          สีแดงพาสเทล: น้ำตาล &ge; 126 mg/dL / SBP &ge; 140 / เสี่ยงสูง
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          สีเหลืองพาสเทล: น้ำตาล 100-125 / SBP 120-139 / เสี่ยงปานกลาง
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          สีเขียวพาสเทล: ค่าอยู่ในเกณฑ์ปกติ / ความเสี่ยงต่ำ
        </span>
      </div>

      {/* Data Table Container */}
      <div className="bg-white/90 rounded-2xl border border-purple-100/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF8FF] border-b border-purple-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-4 py-3 cursor-pointer hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล (PDPA)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('screeningDate')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>วันที่คัดกรอง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">พื้นที่</th>
                <th className="px-3 py-3">เพศ</th>
                <th
                  onClick={() => handleSort('age')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>อายุ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bmi')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>BMI (kg/m²)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sbp')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>ความดัน SBP/DBP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bloodSugar')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">พฤติกรรม (สูบ/ดื่ม/ออกกำลัง)</th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="px-3 py-3 cursor-pointer hover:bg-purple-100/50"
                >
                  <div className="flex items-center gap-1">
                    <span>คะแนน & ระดับเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 text-center">ดูประวัติ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-slate-600">
                    ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-purple-50/40 transition-colors group"
                  >
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <span className="font-mono bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {record.id}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                      {record.screeningDate}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 text-[11px] font-medium border border-purple-100">
                        โซน{record.area}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700 whitespace-nowrap">{record.gender}</td>
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {record.age} ปี
                    </td>

                    {/* Conditional BMI Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg border text-xs ${getBmiBadge(
                          record.bmi
                        )}`}
                      >
                        {record.bmi}
                      </span>
                    </td>

                    {/* Conditional Blood Pressure Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-lg border text-xs ${getSbpBadge(
                          record.sbp
                        )}`}
                      >
                        {record.sbp}/{record.dbp}
                      </span>
                    </td>

                    {/* Conditional Blood Sugar Highlight */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg border text-xs ${getSugarBadge(
                          record.bloodSugar
                        )}`}
                      >
                        {record.bloodSugar}
                      </span>
                    </td>

                    {/* Behavioral indicators */}
                    <td className="px-3 py-3 whitespace-nowrap text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            record.smoking === 'สูบ'
                              ? 'bg-rose-50 text-rose-700 font-bold'
                              : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {record.smoking}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            record.alcohol === 'ดื่ม'
                              ? 'bg-amber-50 text-amber-700 font-bold'
                              : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {record.alcohol}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            record.exercise === 'สม่ำเสมอ'
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : record.exercise === 'ไม่ออกกำลังกาย'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {record.exercise}
                        </span>
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{record.riskScore}/7</span>
                        <span
                          className={`px-2 py-0.5 rounded-lg border text-xs ${getRiskBadge(
                            record.riskLevel
                          )}`}
                        >
                          {record.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Detail modal trigger */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-amber-300 hover:text-slate-900 transition-colors cursor-pointer"
                        title="ดูแฟ้มข้อมูลสุขภาพ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-purple-50 bg-[#FAF8FF]">
          <span className="text-xs text-slate-500">
            แสดงหน้า <strong>{currentPage}</strong> จาก <strong>{totalPages}</strong> (ทั้งหมด{' '}
            {sortedRecords.length} รายการ)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-purple-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-purple-900 bg-white rounded-lg border border-purple-200">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-purple-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Individual Patient Record Modal (Health Passport Detail) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-purple-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-300 text-slate-900 flex items-center justify-center font-bold text-sm">
                  {selectedRecord.id.slice(-3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    แฟ้มประวัติคัดกรอง: {selectedRecord.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    วันที่ตรวจ: {selectedRecord.screeningDate} | โซน{selectedRecord.area}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="text-[11px] text-slate-500">เพศ & อายุ</div>
                <div className="text-sm font-bold text-purple-900">
                  {selectedRecord.gender} / {selectedRecord.age} ปี
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="text-[11px] text-slate-500">ระดับความเสี่ยง</div>
                <div className={`text-sm font-bold ${selectedRecord.riskLevel === 'สูง' ? 'text-rose-600' : selectedRecord.riskLevel === 'ปานกลาง' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {selectedRecord.riskLevel} ({selectedRecord.riskScore}/7)
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="text-[11px] text-slate-500">BMI</div>
                <div className="text-sm font-bold text-slate-800">
                  {selectedRecord.bmi} kg/m²
                </div>
              </div>
            </div>

            {/* Clinical metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ผลตรวจทางคลินิก (Clinical Measurements)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">น้ำตาลในเลือด:</span>
                  <span className={`px-2 py-0.5 rounded-lg border font-bold ${getSugarBadge(selectedRecord.bloodSugar)}`}>
                    {selectedRecord.bloodSugar} mg/dL
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">ความดันโลหิต SBP/DBP:</span>
                  <span className={`px-2 py-0.5 rounded-lg border font-bold ${getSbpBadge(selectedRecord.sbp)}`}>
                    {selectedRecord.sbp}/{selectedRecord.dbp} mmHg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">ชีพจร (Pulse):</span>
                  <span className="font-bold text-slate-800">{selectedRecord.pulse} bpm</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">ส่วนสูง/น้ำหนัก:</span>
                  <span className="font-bold text-slate-800">
                    {selectedRecord.heightCm} cm / {selectedRecord.weightKg} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Lifestyle & Screenings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                พฤติกรรมและการคัดกรอง NCDs
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-purple-50/50 flex justify-between">
                  <span className="text-slate-500">สูบบุหรี่:</span>
                  <strong className={selectedRecord.smoking === 'สูบ' ? 'text-rose-600' : 'text-slate-800'}>
                    {selectedRecord.smoking}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/50 flex justify-between">
                  <span className="text-slate-500">ดื่มแอลกอฮอล์:</span>
                  <strong className={selectedRecord.alcohol === 'ดื่ม' ? 'text-amber-600' : 'text-slate-800'}>
                    {selectedRecord.alcohol}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/50 flex justify-between">
                  <span className="text-slate-500">ออกกำลังกาย:</span>
                  <strong className="text-slate-800">{selectedRecord.exercise}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50/50 flex justify-between">
                  <span className="text-slate-500">ภาวะเสี่ยงเบาหวาน:</span>
                  <strong className={selectedRecord.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' ? 'text-rose-600' : 'text-emerald-700'}>
                    {selectedRecord.diabetesScreening}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
