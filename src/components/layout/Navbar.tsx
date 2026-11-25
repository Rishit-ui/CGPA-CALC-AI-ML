import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  RotateCcw,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Check,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavbarProps {
  currentTab: NavTab;
  onOpenSidebar: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  onExportPdf: () => void;
  onExportCsv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenSidebar,
  onLoadDemo,
  onReset,
  onExportPdf,
  onExportCsv,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDemoFeedback, setShowDemoFeedback] = useState(false);

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Semester Dashboard', subtitle: 'Overview, live SGPA & quick assessment metrics' },
    'marks-entry': { title: 'Marks Entry & Assessment', subtitle: 'Live marks editor with instant validation' },
    predictor: { title: 'Smart SEE Grade Predictor', subtitle: 'Reverse SEE requirements for every target grade' },
    'target-sgpa': { title: 'Target SGPA Planner', subtitle: 'Optimal credit-weighted grade & SEE allocations' },
    analytics: { title: 'Performance & Scenarios', subtitle: 'Distribution charts & interactive performance simulation' },
    'cgpa-tracker': { title: 'Cumulative CGPA Tracker', subtitle: 'Credit-weighted cumulative CGPA across all semesters' },
    settings: { title: 'Grading & Subject Settings', subtitle: 'Configure grade cutoffs, minimum pass marks & courses' },
  };

  const handleDemoClick = () => {
    onLoadDemo();
    setShowDemoFeedback(true);
    setTimeout(() => setShowDemoFeedback(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 bg-surface/90 backdrop-blur-md border-b border-charcoal-700/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-xl text-charcoal-600 hover:text-charcoal-900 hover:bg-surface-subtle lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-charcoal-900 leading-tight">
              {tabTitles[currentTab]?.title}
            </h1>
            <p className="hidden sm:block text-xs text-charcoal-500 font-medium">
              {tabTitles[currentTab]?.subtitle}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo data button */}
          <button
            onClick={handleDemoClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors shadow-soft-sm"
            title="Preload realistic marks for all 7 subjects"
          >
            {showDemoFeedback ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline text-emerald-800">Loaded Demo!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Load Demo Data</span>
                <span className="sm:hidden">Demo</span>
              </>
            )}
          </button>

          {/* Reset button with confirmation modal */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-charcoal-600 hover:text-charcoal-900 hover:bg-surface-subtle border border-charcoal-700/10 transition-colors"
            title="Reset all marks to zero"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors shadow-soft-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
            </button>

            {exportOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 py-1.5 bg-surface rounded-xl border border-charcoal-700/10 shadow-soft-lg z-40">
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      onExportPdf();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-surface-subtle hover:text-charcoal-900"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>Download PDF Report</span>
                  </button>
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      onExportCsv();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-surface-subtle hover:text-charcoal-900"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Export Data (CSV)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft-lg">
            <h3 className="text-base font-bold text-charcoal-900">Reset Semester Marks?</h3>
            <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
              Are you sure you want to clear all entered CIA and SEE marks? Subject configurations and grade boundaries will remain saved.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-surface-subtle border border-charcoal-700/15"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-soft"
              >
                Yes, Clear Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
