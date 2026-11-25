import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Target,
  BarChart3,
  Calculator,
  Settings,
  X,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'marks-entry'
  | 'predictor'
  | 'target-sgpa'
  | 'analytics'
  | 'cgpa-tracker'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  expectedSgpa: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
  expectedSgpa,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marks-entry', label: 'Marks Entry', icon: GraduationCap },
    { id: 'predictor', label: 'Grade Predictor', icon: Sparkles, badge: 'Smart' },
    { id: 'target-sgpa', label: 'Target SGPA', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cgpa-tracker', label: 'CGPA Tracker', icon: Calculator },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-surface border-r border-charcoal-700/10 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-charcoal-700/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500 text-charcoal-900 font-bold shadow-soft">
              <Sparkles className="w-5 h-5 text-charcoal-900" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-charcoal-900 block leading-tight">
                Grade<span className="text-amber-600">Pilot</span>
              </span>
              <span className="text-xs font-medium text-charcoal-500">Smart SGPA & Exam Planner</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-surface-subtle lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live SGPA Badge in sidebar */}
        <div className="px-6 py-4 mx-4 my-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>Expected SGPA</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold">
              Live
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-charcoal-900">
              {expectedSgpa.toFixed(2)}
            </span>
            <span className="text-xs text-charcoal-500 font-medium">/ 10.00</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-charcoal-900 font-semibold shadow-soft'
                    : 'text-charcoal-600 hover:bg-surface-subtle hover:text-charcoal-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-charcoal-900' : 'text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-charcoal-900 text-amber-300' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-surface-subtle border border-charcoal-700/5 text-xs text-charcoal-500">
          <div className="flex items-center justify-between font-medium">
            <span>Assessment Model</span>
            <span className="font-semibold text-charcoal-800">DSU 60+40</span>
          </div>
          <p className="mt-1 text-[11px] text-charcoal-400 leading-relaxed">
            SEC 100% internal evaluated. Credit-weighted SGPA.
          </p>
        </div>
      </aside>
    </>
  );
};
