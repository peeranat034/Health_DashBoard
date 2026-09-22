import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  fetchHealthRecords,
  calculateKPIStats,
} from './services/sheetService';
import { HealthRecord, FilterState } from './types';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { TrendView } from './components/TrendView';
import { BehaviorView } from './components/BehaviorView';
import { DeepInsightsView } from './components/DeepInsightsView';
import { DataTableView } from './components/DataTableView';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  HeartPulse,
  BrainCircuit,
  Table,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SYNC_INTERVAL_SECONDS = 20;

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number>(SYNC_INTERVAL_SECONDS);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    area: 'all',
    gender: 'all',
    riskLevel: 'all',
    ageGroup: 'all',
    exercise: 'all',
    smoking: 'all',
    alcohol: 'all',
    diabetesStatus: 'all',
    hypertensionStatus: 'all',
    searchQuery: '',
  });

  // Fetch data function
  const loadData = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsLoading(true);
      setError(null);
      const { records: fetchedRecords, fetchedAt } = await fetchHealthRecords();
      setRecords(fetchedRecords);
      setLastUpdated(fetchedAt);
      setSecondsUntilNextSync(SYNC_INTERVAL_SECONDS);
    } catch (err: any) {
      console.error('Error fetching health records:', err);
      setError('ไม่สามารถเชื่อมต่อฐานข้อมูลได้ในขณะนี้ กรุณากดรีเฟรชอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Real-time Auto-Sync countdown timer & interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextSync((prev) => {
        if (prev <= 1) {
          loadData(false);
          return SYNC_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadData]);

  // Unique areas in dataset
  const areas = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set);
  }, [records]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      area: 'all',
      gender: 'all',
      riskLevel: 'all',
      ageGroup: 'all',
      exercise: 'all',
      smoking: 'all',
      alcohol: 'all',
      diabetesStatus: 'all',
      hypertensionStatus: 'all',
      searchQuery: '',
    });
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Area
      if (filters.area !== 'all' && r.area !== filters.area) return false;

      // Gender
      if (filters.gender !== 'all' && r.gender !== filters.gender) return false;

      // Risk level
      if (filters.riskLevel !== 'all' && r.riskLevel !== filters.riskLevel) return false;

      // Age cohort
      if (filters.ageGroup === '<30' && r.age >= 30) return false;
      if (filters.ageGroup === '30-44' && (r.age < 30 || r.age > 44)) return false;
      if (filters.ageGroup === '45-59' && (r.age < 45 || r.age > 59)) return false;
      if (filters.ageGroup === '60+' && r.age < 60) return false;

      // Exercise
      if (filters.exercise !== 'all' && r.exercise !== filters.exercise) return false;

      // Diabetes
      if (filters.diabetesStatus !== 'all' && r.diabetesScreening !== filters.diabetesStatus)
        return false;

      // Hypertension
      if (
        filters.hypertensionStatus !== 'all' &&
        r.hypertensionScreening !== filters.hypertensionStatus
      )
        return false;

      // Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchId = r.id.toLowerCase().includes(q);
        const matchArea = r.area.toLowerCase().includes(q);
        if (!matchId && !matchArea) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Calculate statistics
  const kpiStats = useMemo(() => {
    return calculateKPIStats(filteredRecords);
  }, [filteredRecords]);

  // Male & female counts
  const maleCount = useMemo(
    () => filteredRecords.filter((r) => r.gender === 'ชาย').length,
    [filteredRecords]
  );
  const femaleCount = useMemo(
    () => filteredRecords.filter((r) => r.gender === 'หญิง').length,
    [filteredRecords]
  );

  return (
    <div className="min-h-screen bg-[#F6F4FB] text-slate-800 pb-16 selection:bg-amber-200">
      {/* Top subtle tech ambient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 via-amber-300 to-indigo-400" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Section 1: Header */}
        <Header
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={() => loadData(true)}
          secondsUntilNextSync={secondsUntilNextSync}
          totalRecords={records.length}
        />

        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData(true)}
              className="px-3 py-1 rounded-lg bg-rose-100 font-semibold hover:bg-rose-200 cursor-pointer"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* Section 5: Navigation Controls */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          recordCount={filteredRecords.length}
        />

        {/* Section 1.2: Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          areas={areas}
          totalFiltered={filteredRecords.length}
          totalAll={records.length}
        />

        {/* Section 2: Health Overview KPI Cards (Rendered at top of Overview or always accessible) */}
        <KPICards stats={kpiStats} maleCount={maleCount} femaleCount={femaleCount} />

        {/* Main Tabbed Views with Smooth Motion Transition */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Visual Overview: Combines concise previews of Risk, Trends, Behaviors, and Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Overview card */}
                  <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          สรุปสถานะความเสี่ยงสุขภาพ (Health Risk)
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('risk')}
                        className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
                      >
                        ดูรายละเอียด &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center my-auto">
                      <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <div className="text-[11px] font-medium text-slate-600">เสี่ยงต่ำ</div>
                        <div className="text-2xl font-black">
                          {filteredRecords.filter((r) => r.riskLevel === 'ต่ำ').length}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {Math.round(
                            (filteredRecords.filter((r) => r.riskLevel === 'ต่ำ').length /
                              (filteredRecords.length || 1)) *
                              100
                          )}
                          %
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200">
                        <div className="text-[11px] font-medium text-slate-600">เสี่ยงปานกลาง</div>
                        <div className="text-2xl font-black">
                          {filteredRecords.filter((r) => r.riskLevel === 'ปานกลาง').length}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {Math.round(
                            (filteredRecords.filter((r) => r.riskLevel === 'ปานกลาง').length /
                              (filteredRecords.length || 1)) *
                              100
                          )}
                          %
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200">
                        <div className="text-[11px] font-medium text-slate-600">เสี่ยงสูง</div>
                        <div className="text-2xl font-black">{kpiStats.highRiskCount}</div>
                        <div className="text-[10px] text-slate-500">
                          {kpiStats.highRiskPercentage}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-50 text-xs text-slate-600 flex items-center justify-between">
                      <span>เสี่ยงเบาหวาน: {kpiStats.diabetesRiskCount} คน</span>
                      <span>เสี่ยงความดัน: {kpiStats.hypertensionRiskCount} คน</span>
                    </div>
                  </div>

                  {/* Trend & Behavior Overview card */}
                  <div className="bg-white/85 rounded-2xl p-5 border border-purple-100/90 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          แนวโน้มและพฤติกรรม (Trend & Behavior)
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('behavior')}
                        className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
                      >
                        ดูพฤติกรรม &rarr;
                      </button>
                    </div>

                    <div className="space-y-2.5 my-auto text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50">
                        <span className="text-slate-600">ออกกำลังกายสม่ำเสมอ:</span>
                        <strong className="text-emerald-700">
                          {filteredRecords.filter((r) => r.exercise === 'สม่ำเสมอ').length} คน (
                          {Math.round(
                            (filteredRecords.filter((r) => r.exercise === 'สม่ำเสมอ').length /
                              (filteredRecords.length || 1)) *
                              100
                          )}
                          %)
                        </strong>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50">
                        <span className="text-slate-600">สูบบุหรี่เป็นประจำ:</span>
                        <strong className="text-rose-700">
                          {filteredRecords.filter((r) => r.smoking === 'สูบ').length} คน (
                          {Math.round(
                            (filteredRecords.filter((r) => r.smoking === 'สูบ').length /
                              (filteredRecords.length || 1)) *
                              100
                          )}
                          %)
                        </strong>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50">
                        <span className="text-slate-600">ดื่มเครื่องดื่มแอลกอฮอล์:</span>
                        <strong className="text-amber-800">
                          {filteredRecords.filter((r) => r.alcohol === 'ดื่ม').length} คน (
                          {Math.round(
                            (filteredRecords.filter((r) => r.alcohol === 'ดื่ม').length /
                              (filteredRecords.length || 1)) *
                              100
                          )}
                          %)
                        </strong>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-50 text-xs text-slate-600 flex items-center justify-between">
                      <span>กลุ่มที่มีพฤติกรรมดีเลิศ: 0 ความเสี่ยง</span>
                      <button
                        onClick={() => setActiveTab('insights')}
                        className="font-semibold text-purple-900 hover:underline"
                      >
                        วิเคราะห์สหสัมพันธ์ &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct quick preview of the Deep Table */}
                <DataTableView records={filteredRecords} />
              </motion.div>
            )}

            {activeTab === 'risk' && (
              <motion.div
                key="tab-risk"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <RiskAnalysisView records={filteredRecords} />
              </motion.div>
            )}

            {activeTab === 'trend' && (
              <motion.div
                key="tab-trend"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <TrendView records={filteredRecords} />
              </motion.div>
            )}

            {activeTab === 'behavior' && (
              <motion.div
                key="tab-behavior"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <BehaviorView records={filteredRecords} />
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="tab-insights"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <DeepInsightsView records={filteredRecords} />
              </motion.div>
            )}

            {activeTab === 'table' && (
              <motion.div
                key="tab-table"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <DataTableView records={filteredRecords} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with Creator Credentials and PDPA Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-purple-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              <strong>VITA PULSE</strong> - แดชบอร์ดวิเคราะห์และเฝ้าระวังสุขภาพอัจฉริยะ (Pastel Tech)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-purple-100/70 text-purple-900 font-semibold border border-purple-200">
              ผู้จัดทำ: นายพีรณัฐ บุญรอด
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">
              Real-time Live Syncing &bull; PDPA Compliant
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
