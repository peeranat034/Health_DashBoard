import { Search, Filter, RotateCcw, MapPin, Users, AlertCircle, HeartPulse, Activity } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  areas: string[];
  totalFiltered: number;
  totalAll: number;
}

export function FilterBar({
  filters,
  onFilterChange,
  onReset,
  areas,
  totalFiltered,
  totalAll,
}: FilterBarProps) {
  const isFiltered =
    filters.area !== 'all' ||
    filters.gender !== 'all' ||
    filters.riskLevel !== 'all' ||
    filters.ageGroup !== 'all' ||
    filters.exercise !== 'all' ||
    filters.diabetesStatus !== 'all' ||
    filters.hypertensionStatus !== 'all' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-purple-100 p-4 md:p-5 shadow-xs space-y-4">
      {/* Top row: search & filter title & count & reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800">ตัวกรองข้อมูลเชิงลึก (Category Filters)</span>
            <span className="text-xs text-slate-600 block">
              แสดงผล {totalFiltered} จากทั้งหมด {totalAll} รายการ ({Math.round((totalFiltered / (totalAll || 1)) * 100)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="filter-search-input"
              type="text"
              placeholder="ค้นหารหัสบุคคล เช่น H0001..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-purple-50/50 border border-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-300 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              id="filter-reset-button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
              title="ล้างตัวกรองทั้งหมด"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown controls grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* Area Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-600" />
            <span>พื้นที่/โซน</span>
          </label>
          <select
            id="filter-area-select"
            value={filters.area}
            onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">ทุกพื้นที่</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                โซน{area}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Users className="w-3 h-3 text-purple-600" />
            <span>เพศ</span>
          </label>
          <select
            id="filter-gender-select"
            value={filters.gender}
            onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">ทุกเพศ</option>
            <option value="หญิง">หญิง</option>
            <option value="ชาย">ชาย</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>ระดับความเสี่ยง</span>
          </label>
          <select
            id="filter-risk-select"
            value={filters.riskLevel}
            onChange={(e) => onFilterChange({ ...filters, riskLevel: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">ทุกระดับความเสี่ยง</option>
            <option value="ต่ำ">ความเสี่ยงต่ำ</option>
            <option value="ปานกลาง">ความเสี่ยงปานกลาง</option>
            <option value="สูง">ความเสี่ยงสูง</option>
          </select>
        </div>

        {/* Age Cohort Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-600" />
            <span>กลุ่มอายุ</span>
          </label>
          <select
            id="filter-age-select"
            value={filters.ageGroup}
            onChange={(e) => onFilterChange({ ...filters, ageGroup: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">ทุกช่วงอายุ</option>
            <option value="<30">ต่ำกว่า 30 ปี</option>
            <option value="30-44">30 - 44 ปี</option>
            <option value="45-59">45 - 59 ปี</option>
            <option value="60+">60 ปีขึ้นไป</option>
          </select>
        </div>

        {/* Physical Exercise Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <HeartPulse className="w-3 h-3 text-purple-600" />
            <span>การออกกำลังกาย</span>
          </label>
          <select
            id="filter-exercise-select"
            value={filters.exercise}
            onChange={(e) => onFilterChange({ ...filters, exercise: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">ทุกพฤติกรรม</option>
            <option value="สม่ำเสมอ">สม่ำเสมอ</option>
            <option value="บางครั้ง">บางครั้ง</option>
            <option value="ไม่ออกกำลังกาย">ไม่ออกกำลังกาย</option>
          </select>
        </div>

        {/* Screening Risk Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-purple-600" />
            <span>คัดกรองเบาหวาน</span>
          </label>
          <select
            id="filter-diabetes-select"
            value={filters.diabetesStatus}
            onChange={(e) => onFilterChange({ ...filters, diabetesStatus: e.target.value })}
            className="w-full text-xs py-1.5 px-2.5 rounded-xl bg-purple-50/40 border border-purple-200/80 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">คัดกรองเบาหวานทั้งหมด</option>
            <option value="มีแนวโน้ม/เสี่ยง">มีแนวโน้ม/เสี่ยง</option>
            <option value="ไม่มี">ปกติ (ไม่มีความเสี่ยง)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
