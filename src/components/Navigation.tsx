import { LayoutDashboard, AlertTriangle, TrendingUp, HeartPulse, BrainCircuit, Table } from 'lucide-react';

export type NavTab = 'overview' | 'risk' | 'trend' | 'behavior' | 'insights' | 'table';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  recordCount: number;
}

export function Navigation({ activeTab, onTabChange, recordCount }: NavigationProps) {
  const tabs = [
    {
      id: 'overview' as NavTab,
      label: 'ภาพรวมสุขภาพ',
      sub: 'Overview & KPIs',
      icon: LayoutDashboard,
    },
    {
      id: 'risk' as NavTab,
      label: 'ความเสี่ยงสุขภาพ',
      sub: 'Risk Stratification',
      icon: AlertTriangle,
    },
    {
      id: 'trend' as NavTab,
      label: 'แนวโน้มสุขภาพ',
      sub: 'Health Trends',
      icon: TrendingUp,
    },
    {
      id: 'behavior' as NavTab,
      label: 'พฤติกรรมสุขภาพ',
      sub: 'Lifestyle Behavior',
      icon: HeartPulse,
    },
    {
      id: 'insights' as NavTab,
      label: 'ข้อมูลเชิงลึก & สหสัมพันธ์',
      sub: 'Deep Insights',
      icon: BrainCircuit,
    },
    {
      id: 'table' as NavTab,
      label: 'ตารางข้อมูลคัดกรอง',
      sub: `${recordCount} รายการ`,
      icon: Table,
    },
  ];

  return (
    <nav className="w-full overflow-x-auto pb-1 scrollbar-none" aria-label="Dashboard Navigation">
      <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-200/70 shadow-xs min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-purple-900 text-amber-200 shadow-sm'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/80'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-purple-800 text-amber-300' : 'bg-purple-100/60 text-purple-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="leading-tight">{tab.label}</div>
                <div
                  className={`text-[10px] font-normal ${
                    isActive ? 'text-purple-300' : 'text-slate-600'
                  }`}
                >
                  {tab.sub}
                </div>
              </div>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute right-2 top-2" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
